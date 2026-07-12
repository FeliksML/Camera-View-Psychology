// PRODUCTIZED from design/CameraView Prototype.dc.html <script data-dc-script>.
// No longer byte-synced with the design file (that contract ended with product v1):
// real auth (Supabase email OTP), persisted sessions/settings, Claude-powered
// navigate/belief/threads via edge functions, real dates & stats, crisis deep links,
// TTS guide voice. Stage 4 is the Mirror Dialogue Loop (v2): the user asks their
// copy aloud and reports what came back; the AI navigates only — it never speaks
// as the copy. A question-bank + heuristic navigator covers offline/error.
// Visual bindings keep the design's names and CSS-string style.
import { StoreBase } from './StoreBase'
import {
  MOCK,
  loadCache,
  saveCache,
  clearCache,
  hydrate,
  pushSession,
  flushQueue,
  saveProfileDebounced,
  sendOtp,
  verifyOtp,
  signOutRemote,
  callFn,
} from './storage'

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const dayKey = (iso) => new Date(iso).toISOString().slice(0, 10)

export class AppStore extends StoreBase {
  constructor(props) {
    super(props);
    this.DRAFTS = [
      "Criticism stings, but it doesn't define my worth.",
      "I can handle moments like this — I've done it before.",
      "I know how to steady myself when things get loud."
    ];
    // Mirror Dialogue Loop (v2): the user asks their copy aloud and reports back what
    // it "said" — the AI navigates only, it never speaks as the copy. Everything below
    // is the offline navigator: question bank, scripted notes, and the legal-transition
    // table that also validates AI-proposed next_state.
    this.LOOP_INTRO = "I'll offer a question. Ask it to your copy out loud, watch them — then tell me what came back.";
    this.QUESTION_BANK = {
      en: {
        open: ["What's happening for you right now?", "What's hurting right now?", 'What do you feel right now?'],
        deeper: ["What's underneath that?", 'When did you first feel this?', 'What are you afraid of?'],
        support: ['What do you need from me right now?', 'What would help right now?'],
        checkin: ['How are you now?', "What's left in your body?"],
        strength: ['What do you know about yourself now?', 'What can you do next time?']
      },
      ru: {
        open: ['Что с тобой сейчас происходит?', 'Что сейчас болит?', 'Что ты сейчас чувствуешь?'],
        deeper: ['А что под этим?', 'Когда ты впервые это почувствовал?', 'Чего ты боишься?'],
        support: ['Что тебе сейчас нужно от меня?', 'Чем я могу помочь прямо сейчас?'],
        checkin: ['Как ты сейчас?', 'Что осталось в теле?'],
        strength: ['Что ты теперь о себе знаешь?', 'Что ты сможешь сделать в следующий раз?']
      }
    };
    this.QUESTION_INTENTS = ['open', 'deeper', 'deeper', 'support', 'checkin', 'strength'];
    this.WAIT_NOTE = {
      en: "That's normal. Give it another minute or two — just watch, no rush.",
      ru: 'Это нормально. Дай ещё минуту-две — просто наблюдай, без спешки.'
    };
    this.SCRIPT_NOTES = {
      en: {
        emotion: 'Heard. Let that land — then ask the next one.',
        memory: "Notice — it reached back on its own. Don't rush it; ask on.",
        relief: "See — it's quieter now. Let's check how much.",
        new_topic: "Noted — we'll come back to that. For now, stay with what's in front of you."
      },
      ru: {
        emotion: 'Слышу. Дай этому побыть услышанным — и спроси дальше.',
        memory: 'Смотри — оно само потянулось назад. Не торопи, спроси дальше.',
        relief: 'Видишь — стало тише. Давай сверим, насколько.',
        new_topic: 'Это отметим отдельно — вернёмся к нему. Сейчас останемся с тем, что перед тобой.'
      }
    };
    this.GROUNDING_NOTE = {
      en: "Let's stop here. Slow breath out. Feet on the floor. Name five things you can see. This deserves real human support — don't carry it alone.",
      ru: 'Остановимся. Медленный выдох. Ноги на пол, почувствуй опору. Назови пять вещей, которые видишь. Это заслуживает живой поддержки — не оставайся с этим один.'
    };
    this.LOOP_TRANSITIONS = {
      question: ['asking', 'question'],
      asking: ['awaiting_report', 'wait_more'],
      awaiting_report: ['analyzing'],
      analyzing: ['question', 'wait_more', 'intensity_check', 'fixation', 'grounding', 'complete'],
      wait_more: ['awaiting_report', 'question', 'wait_more'],
      intensity_check: ['question', 'fixation', 'complete'],
      grounding: []
    };
    this.SOFT_MAX = 18; // exchanges per session before a soft completion
    this.EMOTIONS = ['Anxiety', 'Anger', 'Sadness', 'Shame', 'Fear', 'Resentment', 'Other'];
    this.ECOLORS = { Anxiety: '#E8A188', Anger: '#D9A96B', Sadness: '#8E9BB8', Shame: '#B48FB8', Fear: '#7E96A8', Resentment: '#C98F9A', Other: '#A5A1C2' };
    this.STAGE_LABELS = ['GROUNDING', 'THE SCENE', 'STEP BACK', 'ASK YOUR COPY', 'THE BELIEF', 'COMING BACK'];
    this.state = this.freshState();
  }

  freshState() {
    const c = loadCache();
    const st = c.settings || {};
    return {
      screen: c.authed ? (c.onboarded ? 'home' : 'onb') : 'onb',
      onb: 0, paywall: false, plan: 'yearly', plus: true, toast: '',
      authed: c.authed, userId: c.userId, displayName: c.displayName, email: c.email, onboarded: c.onboarded,
      authMode: 'buttons', authEmail: '', authCode: '', authBusy: false, authErr: '',
      situation: '', emotion: 'Anxiety', intensity: 7,
      stage: 1, voiceOn: st.voiceOn !== undefined ? st.voiceOn : true, playing: false, audioT: 80,
      pullDepth: 0,
      chat: [{ g: true, u: false, c: false, t: this.LOOP_INTRO }],
      loopPhase: 'question', proposedQ: '', altQ: null, qRequests: 0,
      silenceCount: 0, silenceTotal: 0, exchangeCount: 0, report: '', typing: false,
      intensityTrail: [], lastIntensity: 7, lastCheckAt: 0,
      oldBelief: '', oldBeliefEdited: false, aiCheck: null, safetyStopped: false,
      copyClass: null, parkOffer: false, loopEnd: null, observeStart: null,
      draftI: 0, belief: "Criticism stings, but it doesn't define my worth.",
      aiDrafts: null,
      after: 3, remind: false, filter: 'All',
      sessions: c.sessions || [],
      threads: c.threads, threadsBusy: false,
      voiceSpeed: st.voiceSpeed !== undefined ? st.voiceSpeed : 0.5,
      haptics: st.haptics !== undefined ? st.haptics : true,
      transcripts: st.transcripts !== undefined ? st.transcripts : false,
      startedAt: null, sessionId: null,
      topics: [], topicOpen: false, topicText: '', mapOpen: false, thSel: 1
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const s = this.state;
      if (s.playing && s.screen === 'session' && s.stage === 2) {
        const t = Math.min(160, s.audioT + 1);
        this.setState({ audioT: t, playing: t < 160 });
      }
    }, 1000);
    this.onOnline = () => flushQueue();
    window.addEventListener('online', this.onOnline);
    this.boot();
  }
  componentWillUnmount() {
    clearInterval(this.timer); clearTimeout(this.tt); clearTimeout(this.ct);
    window.removeEventListener('online', this.onOnline);
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch { /* no tts */ }
  }

  async boot() {
    if (MOCK) return;
    const h = await hydrate();
    if (h) {
      const st = h.settings || {};
      const patch = {
        authed: true, userId: h.userId, displayName: h.displayName, email: h.email,
        onboarded: h.onboarded, sessions: h.sessions || [], threads: h.threads || this.state.threads,
      };
      if (st.voiceOn !== undefined) patch.voiceOn = st.voiceOn;
      if (st.voiceSpeed !== undefined) patch.voiceSpeed = st.voiceSpeed;
      if (st.haptics !== undefined) patch.haptics = st.haptics;
      if (st.transcripts !== undefined) patch.transcripts = st.transcripts;
      if ((this.state.screen === 'onb' || this.state.screen === 'signin') && h.onboarded) patch.screen = 'home';
      this.setState(patch);
    } else if (this.state.authed) {
      // cached session is stale — ask to sign in again, keep local data visible
      saveCache({ authed: false, userId: null });
      this.setState({ authed: false, screen: 'signin' });
    }
    flushQueue();
  }

  speak(text) {
    try {
      if (!this.state.voiceOn || !window.speechSynthesis || !text) return;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.75 + this.state.voiceSpeed * 0.55;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch { /* tts unavailable */ }
  }

  persistSettings() {
    const { voiceOn, voiceSpeed, haptics, transcripts } = this.state;
    saveProfileDebounced({ settings: { voiceOn, voiceSpeed, haptics, transcripts } });
  }

  markOnboarded() {
    if (!this.state.onboarded) {
      this.setState({ onboarded: true });
      saveProfileDebounced({ onboarded: true });
    }
  }

  async authSend() {
    const email = (this.state.authEmail || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { this.setState({ authErr: 'That email doesn’t look right.' }); return; }
    this.setState({ authBusy: true, authErr: '' });
    const { error } = await sendOtp(email);
    if (error) { this.setState({ authBusy: false, authErr: error }); return; }
    this.setState({ authBusy: false, authMode: 'code', authCode: '' });
    this.showToast('Code sent — check your email.');
  }

  async authVerify() {
    const { authEmail, authCode } = this.state;
    if ((authCode || '').length < 6) { this.setState({ authErr: 'Enter the 6-digit code.' }); return; }
    this.setState({ authBusy: true, authErr: '' });
    const { error } = await verifyOtp(authEmail.trim(), authCode);
    if (error) { this.setState({ authBusy: false, authErr: error }); return; }
    const h = await hydrate();
    const onboarded = h ? h.onboarded : false;
    this.setState(Object.assign({
      authBusy: false, authed: true, authMode: 'buttons', authCode: '',
    }, h ? {
      userId: h.userId, displayName: h.displayName, email: h.email,
      onboarded: h.onboarded, sessions: h.sessions || [], threads: h.threads || null,
    } : {}));
    if (!onboarded) this.markOnboarded();
    this.go('home');
    this.showToast('Signed in.');
    flushQueue();
  }

  signOut() {
    signOutRemote();
    clearCache();
    this.setState(Object.assign(this.freshState(), { screen: 'signin', authed: false }));
    this.showToast('Signed out.');
  }

  showToast(m) {
    clearTimeout(this.tt);
    this.setState({ toast: m });
    this.tt = setTimeout(() => this.setState({ toast: '' }), 2600);
  }
  go(screen, extra) {
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch { /* no tts */ }
    this.setState(Object.assign({ screen, paywall: false }, extra || {}));
  }
  startSession() {
    this.setState({
      screen: 'session', stage: 1, pullDepth: 0, playing: false, audioT: 80,
      chat: [{ g: true, u: false, c: false, t: this.LOOP_INTRO }],
      loopPhase: 'question', proposedQ: '', altQ: null, qRequests: 0,
      silenceCount: 0, silenceTotal: 0, exchangeCount: 0, report: '', typing: false,
      intensityTrail: [{ i: this.state.intensity, at: 0, source: 'setup' }],
      lastIntensity: this.state.intensity, lastCheckAt: 0,
      oldBelief: '', oldBeliefEdited: false, aiCheck: null, safetyStopped: false,
      copyClass: null, parkOffer: false, loopEnd: null, observeStart: null,
      after: 3, draftI: 0, belief: this.DRAFTS[0], mapOpen: false,
      aiDrafts: null, topics: [], remind: false,
      startedAt: Date.now(), sessionId: crypto.randomUUID()
    });
    this.setState({ proposedQ: this.bankQuestion(0) });
    this.speak("Let's arrive first. Three slow breaths — just follow the circle.");
  }
  // ----- Mirror Dialogue Loop (stage 4) -----
  // The user asks their copy aloud and reports back what it "said". The AI (edge fn
  // `navigate`) only classifies the report and proposes the next step; this machine
  // is the sole authority on transitions.
  langKey() {
    const s = this.state;
    const mine = s.chat.filter(m => !m.g).map(m => m.t).join(' ');
    return /[а-яё]/i.test((s.situation || '') + ' ' + mine) ? 'ru' : 'en';
  }
  loopIntent() {
    const i = Math.min(this.state.exchangeCount, this.QUESTION_INTENTS.length - 1);
    return this.QUESTION_INTENTS[i];
  }
  bankQuestion(shiftBy) {
    const bank = this.QUESTION_BANK[this.langKey()][this.loopIntent()];
    return bank[(this.state.qRequests + (shiftBy || 0)) % bank.length];
  }
  // The only place loopPhase is decided. Safety first, then the legal-transition
  // table, then guardrails — an illegal or unwise AI proposal gets coerced.
  applyTransition(next, extra) {
    extra = extra || {};
    const s = this.state;
    if (extra.acute) { this.enterGrounding(extra.note); return; }
    const legal = this.LOOP_TRANSITIONS[s.loopPhase] || [];
    if (legal.indexOf(next) < 0) {
      next = s.loopPhase === 'analyzing' ? 'question' : s.loopPhase === 'asking' ? 'wait_more' : s.loopPhase;
    }
    if (next === 'wait_more' && s.silenceCount >= 2) { next = 'question'; extra.softer = true; }
    if (next === 'intensity_check' && s.exchangeCount - s.lastCheckAt < 3) next = 'question';
    if ((next === 'question' || next === 'wait_more') && s.exchangeCount >= this.SOFT_MAX) next = 'complete';
    if (next === 'question') this.enterQuestion(extra);
    else if (next === 'wait_more') this.enterWait(extra.withNote !== false);
    else if (next === 'awaiting_report') this.setState({ loopPhase: 'awaiting_report', typing: false });
    else if (next === 'intensity_check') this.setState({ loopPhase: 'intensity_check', lastCheckAt: s.exchangeCount, typing: false });
    else if (next === 'fixation') this.finishLoop(false);
    else if (next === 'complete') this.finishLoop(true);
    else if (next === 'grounding') this.enterGrounding(extra.note);
  }
  enterQuestion(extra) {
    extra = extra || {};
    const q = extra.q || (extra.softer && this.state.altQ) || this.bankQuestion(extra.softer ? 1 : 0);
    this.setState({ proposedQ: q, loopPhase: 'question', typing: false, silenceCount: 0 });
  }
  enterWait(withNote) {
    if (withNote) {
      const note = this.WAIT_NOTE[this.langKey()];
      this.setState(s => ({ chat: s.chat.concat([{ g: true, u: false, c: false, t: note }]) }));
      this.speak(note);
    }
    this.setState(s => ({
      loopPhase: 'wait_more', typing: false,
      silenceCount: s.silenceCount + 1, silenceTotal: s.silenceTotal + 1
    }));
  }
  enterGrounding(note) {
    if (note) {
      this.setState(s => ({ chat: s.chat.concat([{ g: true, u: false, c: false, t: note }]) }));
      this.speak(note);
    }
    this.setState({ loopPhase: 'grounding', typing: false, safetyStopped: true, loopEnd: 'safety' });
  }
  askAloud() {
    const q = this.state.proposedQ;
    if (!q) return;
    this.setState(s => ({
      chat: s.chat.concat([{ g: false, u: true, c: false, t: q }]),
      loopPhase: 'asking', observeStart: Date.now(), qRequests: 0
    }));
  }
  anotherQuestion() {
    const s = this.state;
    if (s.altQ && s.altQ !== s.proposedQ) { this.setState({ proposedQ: s.altQ, altQ: null, qRequests: s.qRequests + 1 }); return; }
    this.setState({ qRequests: s.qRequests + 1 });
    this.setState({ proposedQ: this.bankQuestion(0) });
  }
  copySilent() {
    if (this.state.silenceCount >= 2) {
      // Two waits already — don't hold the user in silence; soften the question.
      this.enterQuestion({ softer: true });
      return;
    }
    this.enterWait(true);
  }
  finishLoop(atCap) {
    const s = this.state;
    const end = atCap ? 'cap' : 'flow';
    if (s.topics.some(tp => !tp.status || tp.status === 'parked')) {
      this.setState({ typing: false, loopEnd: end, parkOffer: true, loopPhase: 'question' });
      return;
    }
    this.setState({ typing: false, loopEnd: end });
    this.toBelief();
  }
  parkResolve(mode) {
    const s = this.state;
    if (mode === 'now') {
      const tp = s.topics.find(x => !x.status || x.status === 'parked') || s.topics[0];
      const q = this.langKey() === 'ru' ? 'Что для тебя «' + tp.t + '»?' : 'What is "' + tp.t + '" for you?';
      this.setState({
        parkOffer: false, loopEnd: null,
        topics: s.topics.map(x => (x === tp ? Object.assign({}, x, { status: 'now' }) : x)),
        proposedQ: q, loopPhase: 'question'
      });
    } else {
      this.setState({
        parkOffer: false,
        topics: s.topics.map(x => Object.assign({}, x, { status: x.status === 'now' ? 'now' : 'next_session' }))
      });
      this.showToast('Saved for your next session.');
      this.toBelief();
    }
  }
  toBelief() {
    this.setState({ stage: 5 });
    if (!this.state.aiDrafts) this.fetchBeliefs();
  }
  confirmIntensity() {
    const s = this.state;
    const i = Math.round(s.lastIntensity);
    this.setState({
      intensityTrail: s.intensityTrail.concat([{ i, at: s.exchangeCount, source: 'self' }]),
      lastCheckAt: s.exchangeCount, lastIntensity: i
    });
    if (i <= 3) this.finishLoop(false);
    else this.enterQuestion({});
  }
  submitReport(text) {
    const t = (text || '').trim();
    if (!t || this.state.typing) return;
    this.setState(s => ({
      chat: s.chat.concat([{ g: false, u: false, c: true, t }]),
      report: '', typing: true, loopPhase: 'analyzing', exchangeCount: s.exchangeCount + 1
    }));
    // Crisis backstop — instant and offline-safe; the AI's `risk` flag is the smarter net.
    if (/(kill myself|suicid|self.?harm|end my life|не хочу жить|покончи|убить себя)/i.test(t)) {
      this.setState({ typing: false, safetyStopped: true, loopEnd: 'safety' });
      this.go('crisis');
      return;
    }
    if (navigator.onLine === false) { this.mirrorScripted(t); return; }
    this.sendMirror(t);
  }
  stampReport(patch) {
    this.setState(s => {
      const chat = s.chat.slice();
      for (let i = chat.length - 1; i >= 0; i--) {
        if (chat[i].c) { chat[i] = Object.assign({}, chat[i], patch); break; }
      }
      return { chat };
    });
  }
  parkTopics(list) {
    if (!list || !list.length) return;
    this.setState(s => ({
      topics: s.topics.concat(list.map(tp => ({
        t: tp.label || tp.t, quote: tp.quote || '', status: 'parked',
        at: s.chat.filter(m => !m.g).length
      })))
    }));
    this.showToast('Noted for its own session.');
  }
  async sendMirror(reportText) {
    const s0 = this.state;
    const transcript = s0.chat.slice(-20).map(m => ({ who: m.g ? 'navigator' : m.u ? 'question' : 'report', text: m.t }));
    const r = await callFn('navigate', {
      situation: s0.situation, emotion: s0.emotion,
      intensity_setup: s0.intensity,
      intensity_history: s0.intensityTrail,
      exchange_count: s0.exchangeCount, silence_count: s0.silenceCount,
      exchanges_since_check: s0.exchangeCount - s0.lastCheckAt,
      parked_topics: s0.topics.map(tp => ({ label: tp.t, quote: tp.quote || '' })),
      transcript
    });
    if (!r || !r.reply || !r.next_state) { this.mirrorScripted(reportText); return; }
    if (this.state.screen !== 'session') return; // user left mid-request
    // The AI's read of the report feeds the path map, moments and threads.
    this.stampReport({ depth: r.report_depth, shift: !!r.shift, cls: r.copy_response_class });
    this.parkTopics(Array.isArray(r.parked_topics) ? r.parked_topics : []);
    const est = typeof r.intensity_estimate === 'number' ? Math.max(0, Math.min(10, Math.round(r.intensity_estimate))) : null;
    const patch = { copyClass: r.copy_response_class };
    if (r.belief_old && !this.state.oldBeliefEdited) patch.oldBelief = r.belief_old;
    if (r.suggested_question_alt) patch.altQ = r.suggested_question_alt;
    if (Array.isArray(r.belief_drafts) && r.belief_drafts.length) patch.aiDrafts = r.belief_drafts.slice(0, 3);
    if (r.copy_response_class !== 'silence') patch.silenceCount = 0;
    if (est !== null) patch.lastIntensity = est;
    this.setState(patch);
    if (est !== null) this.setState(s => ({ intensityTrail: s.intensityTrail.concat([{ i: est, at: s.exchangeCount, source: 'ai' }]) }));
    // Staged reveal keeps the design's rhythm even though the reply is already here.
    this.ct = setTimeout(() => {
      this.setState(s => ({ chat: s.chat.concat([{ g: true, u: false, c: false, t: r.reply }]) }));
      this.speak(r.reply);
      this.applyTransition(r.next_state, {
        acute: r.risk === 'acute',
        q: r.suggested_question || null,
        withNote: false
      });
    }, 900);
  }
  // Offline navigator — heuristics only; it never fabricates the copy's voice.
  classifyReport(t) {
    const x = (t || '').toLowerCase();
    if (/(паник|задыха|не могу дышать|panic|can't breathe|cant breathe)/.test(x)) return { kind: 'acute' };
    if (x.split(/\s+/).filter(Boolean).length <= 2 || /молч|ничего не|нет ответа|отвора|silent|says nothing|nothing came|looks away/.test(x)) return { kind: 'silence', depth: 0 };
    if (this.isShift(x)) return { kind: 'relief', shift: true, depth: this.depthOf(x) };
    const depth = this.depthOf(x);
    // Reaching back on the SAME thread ("это как когда мне было восемь…") is the
    // therapeutic path, not a side topic — deep memories win over new-topic markers.
    if (depth < 2 && /(а ещё|кстати|ещё вспомнил|вспомнил ещё|заодно|reminds me of|another memory|also remember)/.test(x)) return { kind: 'new_topic', depth };
    return { kind: depth > 0 ? 'memory' : 'emotion', depth };
  }
  mirrorScripted(reportText) {
    const cls = this.classifyReport(reportText);
    const lang = this.langKey();
    this.ct = setTimeout(() => {
      if (cls.kind === 'acute') { this.enterGrounding(this.GROUNDING_NOTE[lang]); return; }
      this.stampReport({ depth: cls.depth || 0, shift: !!cls.shift, cls: cls.kind });
      if (cls.kind === 'silence') { this.applyTransition('wait_more', {}); return; }
      this.setState({ silenceCount: 0 });
      const note = this.SCRIPT_NOTES[lang][cls.kind] || this.SCRIPT_NOTES[lang].emotion;
      this.setState(s => ({ chat: s.chat.concat([{ g: true, u: false, c: false, t: note }]) }));
      this.speak(note);
      if (cls.kind === 'new_topic') {
        this.parkTopics([{ label: this.trunc(reportText, 32), quote: reportText }]);
        this.applyTransition('question', {});
      } else if (cls.kind === 'relief') {
        this.applyTransition('intensity_check', {});
      } else {
        this.applyTransition('question', {});
      }
    }, 900);
  }
  async fetchBeliefs() {
    const s0 = this.state;
    const transcript = s0.chat.map(m => ({ who: m.g ? 'coach' : m.u ? 'you' : 'copy', text: m.t }));
    const r = await callFn('belief', {
      situation: s0.situation, emotion: s0.emotion, oldBelief: s0.oldBelief || '',
      currentBelief: s0.belief, transcript
    });
    if (r && Array.isArray(r.drafts) && r.drafts.length) {
      const patch = { aiDrafts: r.drafts.slice(0, 3), belief: r.drafts[0], draftI: 0 };
      if (r.check_text && r.check_kind) patch.aiCheck = { text: r.check_text, kind: r.check_kind, for: r.drafts[0] };
      this.setState(patch);
    }
  }
  async loadThreads(force) {
    const s = this.state;
    if (s.threadsBusy) return;
    const fresh = s.threads && s.threads.computed_at &&
      (Date.now() - new Date(s.threads.computed_at).getTime()) < 6 * 3600 * 1000 &&
      (s.threads.n_sessions || 0) === s.sessions.length;
    if (fresh && !force) return;
    this.setState({ threadsBusy: true });
    const r = await callFn('threads', {});
    this.setState({ threadsBusy: false });
    if (r) {
      this.setState({ threads: r });
      saveCache({ threads: r });
    }
  }
  saveTopic() {
    const t = (this.state.topicText || '').trim();
    if (!t) { this.setState({ topicOpen: false }); return; }
    this.setState(s => ({ topics: s.topics.concat([{ t, at: s.chat.filter(m => !m.g).length }]), topicText: '', topicOpen: false }));
    this.showToast('Noted for its own session.');
  }
  // ----- session path map (algorithmic for now — an LLM will link these dots later) -----
  depthOf(t) {
    const x = (t || '').toLowerCase();
    if (/(when i was|as a kid|as a child|childhood|years old|когда мне было|в детстве|маленьк)/.test(x)) return 3;
    if (/(school|homework|teenag|grew up|growing up|my (dad|father|mom|mother|parents)|школ|подрост|отец|папа|мама|родител)/.test(x)) return 2;
    if (/(\balways\b|\bnever\b|\bever\b|every time|used to|years ago|months ago|last year|всегда|никогда|каждый раз|год назад|раньше)/.test(x)) return 1;
    return 0;
  }
  isShift(t) { return /(i can |i know |i've |i handle|it's over|okay|quieter|breathe|calmer|passed|тише|отпустило|легче|спокойн|дыш|прошло)/.test((t || '').toLowerCase()); }
  classifyMoments(chat) {
    const out = [];
    (chat || []).forEach(m => {
      if (m.g) return;
      if (m.u) {
        const q = /\?/.test(m.t) || /^(what|why|how|where|when|who|do you|are you|can you|tell me)/i.test(m.t);
        out.push({ who: 'you', kind: q ? 'q' : 'support', depth: 0, t: m.t });
      } else if (m.c) {
        // AI messages carry authoritative depth/shift; regex is the fallback.
        const d = typeof m.depth === 'number' ? m.depth : this.depthOf(m.t);
        const shifted = typeof m.shift === 'boolean' ? m.shift : this.isShift(m.t);
        out.push({ who: 'copy', kind: d > 0 ? 'memory' : (shifted ? 'shift' : 'release'), depth: d, t: m.t });
      }
    });
    return out;
  }
  demoChat() {
    const qs = ["What's hurting right now?", "What's underneath that?", 'What do you need from me?', 'How are you now?', 'What do you know about yourself now?'];
    const rs = [
      'I felt so small in front of everyone… like nothing I do is ever enough.',
      "It's the same feeling as when I was eight — dad checking my homework, waiting for the mistake.",
      'Someone to actually hear me — not fix me.',
      "It's quieter in my chest now. I can breathe.",
      "I can handle moments like this. I've done it before."
    ];
    const out = [];
    qs.forEach((t, i) => { out.push({ u: true, t }); out.push({ c: true, t: rs[i] }); });
    return out;
  }
  trunc(t, n) { t = t || ''; return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t; }
  smoothPath(pts) {
    if (!pts || pts.length < 2) return '';
    let d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += 'C' + (p1.x + (p2.x - p0.x) / 6).toFixed(1) + ' ' + (p1.y + (p2.y - p0.y) / 6).toFixed(1) + ',' +
        (p2.x - (p3.x - p1.x) / 6).toFixed(1) + ' ' + (p2.y - (p3.y - p1.y) / 6).toFixed(1) + ',' +
        p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    return d;
  }
  mapModel(moments, topics, W, H, annotate) {
    const yNow = H * 0.30;
    const yRow = [yNow, H * 0.50, H * 0.66, H * 0.84];
    const HEAT = ['#E26454', '#E48769', '#D9A96B', '#C9A38C', '#A0B698', '#8FBFAF'];
    const pts = [{ x: 0, y: yNow, kind: 'start', depth: 0 }];
    let shifts = 0, prevY = yNow, deepest = 0;
    moments.forEach(m => {
      let y;
      if (m.who === 'you') y = prevY;
      else if (m.kind === 'shift') { shifts += 1; y = Math.max(H * 0.08, yNow - 4 - shifts * 8); }
      else y = yRow[m.depth];
      prevY = y;
      deepest = Math.max(deepest, m.depth);
      pts.push({ x: 0, y, kind: m.kind, depth: m.depth, t: m.t });
    });
    const slot = (W - 30) / Math.max(9, pts.length - 1);
    pts.forEach((p, i) => { p.x = 15 + i * slot; });
    const heat = (i) => HEAT[Math.round(i / Math.max(1, pts.length - 1) * (HEAT.length - 1))];
    let deepIdx = -1, deepVal = 0;
    pts.forEach((p, i) => { if (p.kind === 'memory' && p.depth > deepVal) { deepVal = p.depth; deepIdx = i; } });
    let qSeen = false;
    const dots = pts.map((p, i) => {
      const c = heat(i);
      const base = 'position:absolute;transform:translate(-50%,-50%);border-radius:50%;left:' + p.x.toFixed(1) + 'px;top:' + p.y.toFixed(1) + 'px;';
      let st;
      if (p.kind === 'start') st = base + 'width:7px;height:7px;background:#E8A188;box-shadow:0 0 8px rgba(232,161,136,.6)';
      else if (p.kind === 'q') st = base + 'width:8px;height:8px;border:1.2px solid #ECEAF7;background:#171526;box-sizing:border-box';
      else if (p.kind === 'support') st = base + 'width:8px;height:8px;border:1.2px dashed #E8A188;background:#171526;box-sizing:border-box';
      else if (p.kind === 'shift') st = base + 'width:8px;height:8px;background:#8FBFAF;box-shadow:0 0 10px rgba(143,191,175,.7)';
      else st = base + 'width:' + (p.depth >= 2 ? '9' : '7') + 'px;height:' + (p.depth >= 2 ? '9' : '7') + 'px;background:' + c + ';box-shadow:0 0 10px ' + c + '66';
      let label = '';
      if (annotate) {
        if (p.kind === 'q' && !qSeen) { label = 'you asked'; qSeen = true; }
        else if (i === deepIdx && deepVal >= 2) label = deepVal >= 3 ? 'childhood' : 'growing up';
        else if (i === pts.length - 1 && p.kind === 'shift') label = 'the shift';
      }
      const above = p.kind === 'q';
      const lx = Math.min(W - 34, Math.max(30, p.x));
      return {
        style: st, has: !!label, label,
        labStyle: 'position:absolute;transform:translate(-50%,0);left:' + lx.toFixed(1) + 'px;top:' + (above ? p.y - 18 : p.y + 9).toFixed(1) + 'px;font-size:8.5px;letter-spacing:.09em;color:#A5A1C2;white-space:nowrap'
      };
    });
    const rows = [[yNow, 'NOW'], [yRow[2], 'DEEPER'], [yRow[3], 'CHILDHOOD']].map(r => ({
      label: r[1],
      line: 'position:absolute;left:0;right:0;top:' + r[0].toFixed(1) + 'px;border-top:1px dashed rgba(236,234,247,.08)',
      lab: 'position:absolute;left:1px;top:' + (r[0] - 12).toFixed(1) + 'px;font-size:8px;letter-spacing:.14em;color:#4E4A6E'
    }));
    const branches = (topics || []).map(tp => {
      const at = Math.max(1, Math.min(pts.length - 1, tp.at || 0));
      const bx = Math.min(W - 12, pts[at].x + slot * 0.4);
      const by = pts[at].y;
      const ty = Math.max(12, by - 30);
      const lx = Math.min(W - 44, Math.max(40, bx));
      const label = (tp.t || '').length > 16 ? (tp.t || '').slice(0, 15) + '…' : (tp.t || '');
      return {
        t: label,
        stub: 'position:absolute;left:' + bx.toFixed(1) + 'px;top:' + ty.toFixed(1) + 'px;height:' + (by - ty).toFixed(1) + 'px;width:0;border-left:1px dashed rgba(143,191,175,.5)',
        dot: 'position:absolute;transform:translate(-50%,-50%);left:' + (bx + 0.5).toFixed(1) + 'px;top:' + ty.toFixed(1) + 'px;width:7px;height:7px;border-radius:50%;border:1px dashed #8FBFAF;background:#171526;box-sizing:border-box',
        lab: 'position:absolute;transform:translate(-50%,0);left:' + lx.toFixed(1) + 'px;top:' + (ty - 15).toFixed(1) + 'px;font-size:8.5px;color:#8FBFAF;white-space:nowrap'
      };
    });
    const hp = pts[pts.length - 1];
    const head = 'position:absolute;left:' + (hp.x - 9).toFixed(1) + 'px;top:' + (hp.y - 9).toFixed(1) + 'px;width:18px;height:18px;border-radius:50%;border:1px solid rgba(236,234,247,.4);animation:cvPulse 2.6s ease-in-out infinite';
    return { path: this.smoothPath(pts), dots, rows, branches, head, deepest };
  }
  threadsVals(s) {
    const E = this.ECOLORS, R1 = '#E8A188', R2 = '#D9A96B';
    const cacheData = s.threads || {};
    const roots = Array.isArray(cacheData.roots) ? cacheData.roots.slice(0, 2) : [];
    const nSessions = s.sessions.length;
    const thEmpty = roots.length === 0;
    const thEmptyText = s.threadsBusy
      ? 'Connecting the threads…'
      : nSessions < 5
        ? 'A few more sessions and the threads will start to show. ' + nSessions + ' of 5 so far.'
        : 'No shared roots surfaced yet — every session still stands on its own.';
    const SS = thEmpty ? [] : (Array.isArray(cacheData.session_points) ? cacheData.session_points : [])
      .map((p, i) => ({
        n: p.n || i + 1,
        area: p.area || 'Other',
        emo: E[p.emo] ? p.emo : 'Other',
        root: Math.min(p.root || 0, roots.length),
        depth: typeof p.depth === 'number' ? p.depth : 1,
        t: p.t || '',
        d: p.d || ''
      }));
    const dot = (x, y, c, r, ring) =>
      'position:absolute;left:' + (x - r).toFixed(1) + 'px;top:' + (y - r).toFixed(1) + 'px;width:' + (r * 2) + 'px;height:' + (r * 2) + 'px;border-radius:50%;background:' + c + ';box-shadow:0 0 9px ' + c + '77' + (ring ? ';outline:1.5px solid ' + ring + ';outline-offset:2px' : '');
    const lab = (x, y, c, mid) => 'position:absolute;left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;' + (mid ? 'transform:translateX(-50%);' : '') + 'font-size:8.5px;letter-spacing:.08em;color:' + c + ';white-space:nowrap';

    // A · constellation — sessions gather around a shared core belief
    const aC1 = [118, 200], aC2 = [272, 92];
    const aAng1 = [-90, -30, 30, 90, 150, 210], aAng2 = [-150, -20, 110];
    const aDots = []; let aL1 = '', aL2 = ''; let i1 = 0, i2 = 0, i0 = 0;
    const sel = s.thSel || 1;
    SS.forEach(ss => {
      let x, y;
      if (ss.root === 1) {
        // reuse the base angles, spiralling outward slightly when a root has >6 sessions
        const a = (aAng1[i1 % aAng1.length] + Math.floor(i1 / aAng1.length) * 17) * Math.PI / 180;
        const rad = 82 + Math.floor(i1 / aAng1.length) * 14; i1++;
        x = aC1[0] + rad * Math.cos(a); y = aC1[1] + rad * Math.sin(a);
        aL1 += 'M' + aC1[0] + ' ' + aC1[1] + 'L' + x.toFixed(0) + ' ' + y.toFixed(0);
      } else if (ss.root === 2) {
        const a = (aAng2[i2 % aAng2.length] + Math.floor(i2 / aAng2.length) * 23) * Math.PI / 180;
        const rad = 64 + Math.floor(i2 / aAng2.length) * 14; i2++;
        x = aC2[0] + rad * Math.cos(a); y = aC2[1] + rad * Math.sin(a);
        aL2 += 'M' + aC2[0] + ' ' + aC2[1] + 'L' + x.toFixed(0) + ' ' + y.toFixed(0);
      } else {
        x = 322 - (i0 % 3) * 16; y = 268 - Math.floor(i0 / 3) * 16; i0++;
      }
      const r = ss.depth >= 3 ? 6 : (ss.depth === 2 ? 5 : 4);
      const on = ss.root === sel;
      aDots.push({
        style: dot(x, y, E[ss.emo], r) + ';cursor:pointer;transition:opacity .3s;opacity:' + (on ? '1' : (ss.root === 0 ? '.55' : '.25')),
        has: true, label: ss.area,
        labStyle: lab(x, y + r + 5, '#6B678C', true) + ';transition:opacity .3s;opacity:' + (on ? '1' : '.4'),
        tap: () => { if (ss.root) this.setState({ thSel: ss.root }); this.showToast('“' + ss.t + '” · ' + ss.d); }
      });
    });
    const ring = (c, p, on) => 'position:absolute;left:' + (p[0] - 13) + 'px;top:' + (p[1] - 13) + 'px;width:26px;height:26px;border-radius:50%;cursor:pointer;transition:all .3s;background:rgba(30,28,48,.92);border:1.4px solid ' + c + ';box-shadow:0 0 ' + (on ? '26px ' + c + '99' : '10px ' + c + '44') + ';opacity:' + (on ? '1' : '.55');
    const core = (c, p, on) => 'position:absolute;left:' + (p[0] - 4) + 'px;top:' + (p[1] - 4) + 'px;width:8px;height:8px;border-radius:50%;background:' + c + ';transition:opacity .3s;opacity:' + (on ? '1' : '.5');
    const rootLab = (p, dy, c, on) => lab(p[0], p[1] + dy, c, true) + ';transition:opacity .3s;opacity:' + (on ? '1' : '.4');
    const card = (c, on, mt) => 'margin-top:' + mt + 'px;border-radius:20px;padding:16px 18px;cursor:pointer;transition:all .25s;background:rgba(38,36,64,.8);' + (on ? 'border:1px solid ' + c + '88;box-shadow:0 0 22px ' + c + '1f,inset 0 0 24px rgba(236,234,247,.03)' : 'border:1px solid rgba(58,55,82,.6);box-shadow:inset 0 0 24px rgba(236,234,247,.03);opacity:.72');
    const memChipS = 'height:26px;padding:0 10px;border-radius:99px;border:1px solid rgba(58,55,82,.8);display:flex;align-items:center;gap:6px;font-size:10.5px;color:#A5A1C2';
    const mems = (root, max) => {
      const list = SS.filter(x => x.root === root);
      const out = list.slice(0, max).map(x => ({ t: x.d + ' · ' + x.area, style: memChipS, dot: 'width:5px;height:5px;border-radius:50%;background:' + E[x.emo] }));
      if (list.length > max) out.push({ t: '+' + (list.length - max) + ' more', style: memChipS, dot: 'display:none' });
      return out;
    };
    const draw = (delay) => 'stroke-dasharray:520;stroke-dashoffset:520;animation:cvDraw 1.6s ease ' + delay + ' forwards';

    const root1 = roots[0] || {};
    const root2 = roots[1] || {};
    const hasLoners = SS.some(x => x.root === 0);
    return {
      thEmpty, thEmptyText, thHasRoots: !thEmpty, thHasRoot2: roots.length >= 2, thHasLoners: hasLoners,
      thCountLine: nSessions + ' session' + (nSessions === 1 ? '' : 's') + ' · ' + roots.length + ' shared root' + (roots.length === 1 ? '' : 's') + ' surfaced',
      thAge1: root1.age_label || '', thAge2: root2.age_label || '',
      thPair1: root1.pair_label || '', thPair2: root2.pair_label || '',
      thBelief1: '“' + (root1.belief || '') + '”', thBelief2: '“' + (root2.belief || '') + '”',
      thNarr1: root1.narrative || '', thNarr2: root2.narrative || '',
      thaLines1: aL1, thaLines2: aL2, thaDots: aDots,
      thaStroke1: sel === 2 ? 'rgba(232,161,136,.12)' : 'rgba(232,161,136,.45)',
      thaStroke2: sel === 1 ? 'rgba(217,169,107,.12)' : 'rgba(217,169,107,.42)',
      thaDraw1: draw('.2s'), thaDraw2: draw('.6s'),
      thaRoot1: ring(R1, aC1, sel === 1), thaCore1: core(R1, aC1, sel === 1), thaRoot1Lab: rootLab(aC1, 22, R1, sel === 1),
      thaRoot2: ring(R2, aC2, sel === 2), thaCore2: core(R2, aC2, sel === 2), thaRoot2Lab: rootLab(aC2, 20, R2, sel === 2),
      thaLoneLab: lab(322, 288, '#4E4A6E', true),
      selRoot1: () => this.setState({ thSel: 1 }),
      selRoot2: () => this.setState({ thSel: 2 }),
      rootCard1: card(R1, sel === 1, 16), rootCard2: card(R2, sel === 2, 12),
      thMems1: mems(1, 3), thMems2: mems(2, 3),
      toThreads: () => { this.go('threads'); this.loadThreads(); },
      thBack: () => this.go('progress'),
      rootSession1: () => { this.setState({ screen: 'setup', situation: 'The root: ' + (root1.belief || ''), paywall: false }); this.showToast('Session aimed at the root.'); },
      rootSession2: () => { this.setState({ screen: 'setup', situation: 'The root: ' + (root2.belief || ''), paywall: false }); this.showToast('Session aimed at the root.'); }
    };
  }
  mkSlider(key, max, round) {
    return (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const set = (cx) => {
        let v = ((cx - rect.left) / rect.width) * max;
        v = Math.max(0, Math.min(max, v));
        if (round) v = Math.round(v);
        this.setState({ [key]: v });
      };
      set(e.clientX);
      const mv = (ev) => set(ev.clientX);
      const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
      window.addEventListener('pointermove', mv);
      window.addEventListener('pointerup', up);
    };
  }

  renderVals() {
    const s = this.state;
    const P = this.props || {};
    const plus = true; // personal build: Plus is always on; the paywall stays as a showcase
    // Journal rows derive from stored sessions (newest first).
    const journal = P.journalEmpty ? [] : s.sessions.map(row => ({
      tag: row.emotion || 'Other',
      date: row.started_at ? fmtDate(row.started_at) : '',
      dur: (row.duration_min || 1) + ' min',
      belief: row.belief || '',
      shift: row.shift || ''
    }));

    // ----- real stats -----
    const dayKeys = Array.from(new Set(s.sessions.map(r => r.started_at && dayKey(r.started_at)).filter(Boolean))).sort().reverse();
    let streak = 0;
    if (dayKeys.length) {
      const today = dayKey(new Date().toISOString());
      const yesterday = dayKey(new Date(Date.now() - 86400000).toISOString());
      if (dayKeys[0] === today || dayKeys[0] === yesterday) {
        streak = 1;
        for (let i = 1; i < dayKeys.length; i++) {
          const gap = (new Date(dayKeys[i - 1]).getTime() - new Date(dayKeys[i]).getTime()) / 86400000;
          if (gap === 1) streak++; else break;
        }
      }
    }
    const drops = s.sessions
      .filter(r => typeof r.intensity === 'number' && typeof r.after_intensity === 'number')
      .map(r => r.intensity - r.after_intensity);
    const avgDrop = drops.length ? drops.reduce((a, b) => a + b, 0) / drops.length : 0;
    const calmShiftLabel = drops.length ? '−' + avgDrop.toFixed(1) : '—';
    const monthAgo = Date.now() - 30 * 86400000;
    const recent = s.sessions.filter(r => r.started_at && new Date(r.started_at).getTime() >= monthAgo);

    // ----- rail -----
    const railDef = [
      ['head', 'FLOW'],
      ['01 Onboarding', () => this.setState(Object.assign(this.freshState(), { screen: 'onb' }))],
      ['02 Sign in', () => this.go('signin')],
      ['03 Home · Today', () => this.go('home')],
      ['04 Session setup', () => this.go('setup')],
      ['head', 'SESSION'],
      ['05 Grounding', () => this.go('session', { stage: 1 })],
      ['06 The scene', () => this.go('session', { stage: 2 })],
      ['07 Step back ★', () => this.go('session', { stage: 3 })],
      ['08 Ask your copy', () => this.go('session', { stage: 4 })],
      ['09 The belief', () => this.go('session', { stage: 5 })],
      ['10 Coming back', () => this.go('session', { stage: 6 })],
      ['11 Session complete', () => this.go('summary')],
      ['head', 'APP'],
      ['12 Journal', () => this.go('journal')],
      ['13 Progress', () => this.go('progress')],
      ['17 Connections ★', () => { this.go('threads'); this.loadThreads(); }],
      ['14 Paywall', () => this.setState({ screen: 'home', paywall: true })],
      ['15 Settings', () => this.go('settings')],
      ['16 Crisis support', () => this.go('crisis')]
    ];
    const activeLabel = (() => {
      if (s.paywall) return '14';
      if (s.screen === 'onb') return '01';
      if (s.screen === 'signin') return '02';
      if (s.screen === 'home') return '03';
      if (s.screen === 'setup') return '04';
      if (s.screen === 'session') return '0' + (4 + s.stage);
      if (s.screen === 'summary') return '11';
      if (s.screen === 'journal') return '12';
      if (s.screen === 'progress') return '13';
      if (s.screen === 'threads') return '17';
      if (s.screen === 'settings') return '15';
      if (s.screen === 'crisis') return '16';
      return '';
    })();
    const railItems = railDef.map(r => {
      if (r[0] === 'head') return { head: true, item: false, label: r[1] };
      const act = r[0].slice(0, 2) === ('0' + activeLabel).slice(-2) || r[0].slice(0, 2) === activeLabel;
      return {
        head: false, item: true, label: r[0], go: r[1],
        style: 'padding:6.5px 10px;border-radius:8px;font-size:12.5px;cursor:pointer;transition:background .15s;' +
          (act ? 'color:#ECEAF7;background:rgba(232,161,136,.13)' : 'color:#A5A1C2')
      };
    });

    // ----- onboarding -----
    const onbData = [
      { t: 'See yourself from the outside', b: 'CameraView teaches you to step back from a difficult moment and watch yourself with kindness — like a scene through a camera.', btn: 'Continue' },
      { t: "Watch, don't drown", b: 'From the outside, anxiety, anger and sadness lose their grip. You guide your copy from distress to calm.', btn: 'Continue' },
      { t: 'Leave with a better belief', b: 'Every session ends by replacing the old, harsh belief with one that actually helps you.', btn: 'Try a 3-minute session' }
    ];
    const dot = (i) => i === s.onb
      ? 'width:10px;height:10px;border-radius:50%;border:1.6px solid #E8A188;box-sizing:border-box'
      : 'width:6px;height:6px;border-radius:50%;background:#3A3752';

    // ----- setup -----
    const emotions = this.EMOTIONS.map(name => ({
      name,
      pick: () => this.setState({ emotion: name }),
      style: 'height:38px;padding:0 16px;border-radius:99px;display:flex;align-items:center;gap:7px;font-size:13.5px;cursor:pointer;transition:all .2s;' +
        (s.emotion === name
          ? 'border:1px solid rgba(232,161,136,.7);background:rgba(232,161,136,.13);color:#ECEAF7;box-shadow:0 0 14px rgba(232,161,136,.15)'
          : 'border:1px solid #3A3752;color:#A5A1C2')
    }));
    const thumb = (v, max) =>
      'position:absolute;top:3px;left:calc(' + (v / max * 100) + '% - 19px);width:38px;height:38px;border-radius:50%;background:#1E1C33;border:1.6px solid #ECEAF7;box-shadow:0 0 16px rgba(232,161,136,.35);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#ECEAF7;transition:left .1s';

    // ----- session -----
    const segs = [1, 2, 3, 4, 5, 6].map(i => ({
      style: 'width:30px;height:3px;border-radius:99px;transition:background .4s;' +
        (i <= s.stage ? 'background:#E8A188;box-shadow:0 0 8px rgba(232,161,136,.5)' : 'background:#3A3752')
    }));
    const scale = [1, 0.78, 0.6][s.pullDepth];
    const pullScene = 'position:absolute;inset:0;transform:scale(' + scale + ');transition:transform 1.1s cubic-bezier(.3,.7,.3,1)';
    const dollyCard = 'position:absolute;left:50%;top:55%;width:290px;height:400px;transform:translate(-50%,-50%) scale(' + [1, 0.93, 0.86][s.pullDepth] + ');transition:transform 1.1s cubic-bezier(.3,.7,.3,1);border:1px solid rgba(236,234,247,.25);border-radius:6px;background:rgba(16,14,27,.55)';

    const auraColors = ['rgba(226,100,84,.55)', 'rgba(228,135,105,.45)', 'rgba(196,160,124,.4)', 'rgba(172,178,148,.4)', 'rgba(160,182,152,.42)', 'rgba(143,191,175,.45)'];
    // The aura cools as intensity drops (setup rating → latest estimate/re-rate).
    const calmDrop = s.intensity > 0 ? Math.max(0, Math.min(1, (s.intensity - s.lastIntensity) / s.intensity)) : 0;
    const aura = auraColors[Math.min(auraColors.length - 1, Math.round(calmDrop * (auraColors.length - 1)))];
    const auraStyle = 'position:absolute;left:50%;top:34%;width:72px;height:44px;transform:translateX(-50%);border-radius:50%;filter:blur(15px);background:' + aura + ';transition:background 1.4s ease';
    const calmPct = Math.min(88, 14 + Math.round(calmDrop * 74));
    const calmRef = (el) => { if (el) el.style.width = calmPct + '%'; };
    const chatRef = (el) => { if (el) el.scrollTop = el.scrollHeight; };

    // ----- session path map (algorithmic for now) -----
    const liveMoments = this.classifyMoments(s.chat);
    const liveMap = this.mapModel(liveMoments, s.topics, 362, 148, false);
    const copyCount = liveMoments.filter(m => m.who === 'copy').length;
    const sumMoments = copyCount >= 2 ? liveMoments : this.classifyMoments(this.demoChat());
    const sumMap = this.mapModel(sumMoments, copyCount >= 2 ? s.topics : [], 314, 150, true);
    const firstQ = sumMoments.find(m => m.kind === 'q');
    let deepM = null;
    sumMoments.forEach(m => { if (m.kind === 'memory' && (!deepM || m.depth > deepM.depth)) deepM = m; });
    const beatDot = (v) => 'width:9px;height:9px;border-radius:50%;flex:none;margin-top:3px;position:relative;z-index:1;' + v;
    const beats = [
      { k: 'STARTED WITH', t: (s.situation || 'The team meeting — criticized in front of everyone') + ' · ' + s.emotion.toLowerCase() + ' at ' + s.intensity + '/10', dot: beatDot('background:#E8A188') },
      firstQ ? { k: 'YOU ASKED', t: '\u201C' + this.trunc(firstQ.t, 70) + '\u201D', dot: beatDot('border:1.2px solid #ECEAF7;box-sizing:border-box;background:#262440') } : null,
      deepM ? { k: deepM.depth >= 3 ? 'IT REACHED BACK — CHILDHOOD' : (deepM.depth === 2 ? 'IT REACHED BACK — GROWING UP' : 'A PATTERN SURFACED'), t: '\u201C' + this.trunc(deepM.t, 116) + '\u201D', dot: beatDot('background:#B48FB8') } : null,
      { k: 'YOU ARRIVED AT', t: s.belief, dot: beatDot('background:#8FBFAF;box-shadow:0 0 8px rgba(143,191,175,.55)') }
    ].filter(Boolean);

    // ----- connections across sessions (algorithmic preview) -----
    const TH = this.threadsVals(s);

    // belief self-check (stage 5) — the AI's check wins while the wording it checked
    // is untouched; the regex is the live/offline fallback.
    let beliefCheckText, beliefCheckColor;
    if (s.aiCheck && s.aiCheck.for === s.belief) {
      beliefCheckText = s.aiCheck.text;
      beliefCheckColor = s.aiCheck.kind === 'strong' ? '#8FBFAF' : s.aiCheck.kind === 'others' ? '#D9A96B' : '#A5A1C2';
    } else {
      const bl = (s.belief || '').toLowerCase();
      const aboutOthers = /(they|them|he |she |people|everyone|my boss|others|они|людям|начальник|другие)/.test(bl);
      const strong = /(i can|i know|i handle|i've|i am able|i will|i'm in charge|handle|я могу|я знаю|я справл|я умею)/.test(bl);
      if (aboutOthers) { beliefCheckText = 'This leans on other people. Can it live inside you instead?'; beliefCheckColor = '#D9A96B'; }
      else if (strong) { beliefCheckText = 'Lives inside you — and it\'s strong. Keep it.'; beliefCheckColor = '#8FBFAF'; }
      else { beliefCheckText = 'True and calm. Could it be stronger — what do you know you can do?'; beliefCheckColor = '#A5A1C2'; }
    }
    const beliefCheckStyle = 'margin-top:6px;padding-top:10px;border-top:1px solid rgba(58,55,82,.5);font-size:12px;line-height:1.45;color:' + beliefCheckColor;

    // ----- summary -----
    const barBefore = 'position:absolute;left:0;top:0;bottom:0;border-radius:99px;background:rgba(165,161,194,.35);width:' + (s.intensity * 10) + '%';
    const barAfter = 'position:absolute;left:0;top:0;bottom:0;border-radius:99px;background:#8FBFAF;box-shadow:0 0 8px rgba(143,191,175,.5);width:' + (s.after * 10) + '%';
    const remindChip = 'height:34px;padding:0 14px;border-radius:99px;display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer;transition:all .2s;' +
      (s.remind ? 'border:1px solid rgba(143,191,175,.7);background:rgba(143,191,175,.12);color:#8FBFAF' : 'border:1px solid #3A3752;color:#A5A1C2');

    // ----- journal -----
    const filtered = s.filter === 'All' ? journal : journal.filter(j => j.tag === s.filter);
    const jRows = [];
    filtered.forEach((j, i) => {
      const c = this.ECOLORS[j.tag] || '#A5A1C2';
      jRows.push({
        ins: false, card: true, tag: j.tag, date: j.date, dur: j.dur, belief: j.belief, shift: j.shift, text: '',
        barStyle: 'position:absolute;left:8px;top:16px;bottom:16px;width:4px;border-radius:99px;background:' + c,
        tagStyle: 'height:22px;padding:0 10px;border-radius:99px;font-size:11px;display:flex;align-items:center;border:1px solid ' + c + '55;color:' + c + ';background:' + c + '14'
      });
      if (i === 0 && s.filter === 'All' && recent.length >= 3) {
        const counts = {};
        recent.forEach(r => { counts[r.emotion] = (counts[r.emotion] || 0) + 1; });
        const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
        jRows.push({
          ins: true, card: false,
          text: "You've calmed " + (top || '').toLowerCase() + ' ' + counts[top] + ' times this month. Average drop: ' + avgDrop.toFixed(1) + ' points.',
          tag: '', date: '', dur: '', belief: '', shift: '', barStyle: '', tagStyle: ''
        });
      }
    });

    // ----- progress (derived from stored sessions) -----
    const beliefRows = s.sessions.slice(0, 3).map(r => ({
      old: r.old_belief || '—',
      neu: r.belief || ''
    }));
    const emoCounts = {};
    recent.forEach(r => { emoCounts[r.emotion || 'Other'] = (emoCounts[r.emotion || 'Other'] || 0) + 1; });
    const emoSegs = Object.keys(emoCounts)
      .sort((a, b) => emoCounts[b] - emoCounts[a])
      .slice(0, 4)
      .map(name => ({
        label: name, count: emoCounts[name],
        style: 'flex:' + emoCounts[name] + ';border-radius:99px;background:' + (this.ECOLORS[name] || '#A5A1C2') + ';opacity:.85',
        labelStyle: 'flex:' + emoCounts[name] + ';font-size:10.5px;color:#A5A1C2;white-space:nowrap;overflow:hidden'
      }));

    // ----- paywall -----
    const planCard = (sel) => 'position:relative;flex:1;border-radius:18px;padding:16px;box-sizing:border-box;cursor:pointer;transition:all .2s;' +
      (sel ? 'border:1px solid #E8A188;background:rgba(232,161,136,.07);box-shadow:0 0 20px rgba(232,161,136,.12)' : 'border:1px solid #3A3752');

    // ----- settings -----
    const track = (on) => 'width:46px;height:28px;border-radius:99px;position:relative;cursor:pointer;transition:background .25s;flex:none;' +
      (on ? 'background:rgba(143,191,175,.55)' : 'background:#3A3752');
    const knob = (on) => 'position:absolute;top:3px;width:22px;height:22px;border-radius:50%;background:#ECEAF7;transition:left .25s;left:' + (on ? '21px' : '3px');
    const voiceThumb = 'position:absolute;top:6px;left:calc(' + (s.voiceSpeed * 100) + '% - 8px);width:16px;height:16px;border-radius:50%;background:#ECEAF7;box-shadow:0 0 8px rgba(232,161,136,.4)';

    const mmss = (t) => Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2);

    return {
      // rail / chrome
      railItems,
      restart: () => this.setState(Object.assign(this.freshState(), { screen: 'onb', onb: 0 })),
      hasToast: !!s.toast, toastMsg: s.toast,

      // screen flags
      sOnb: s.screen === 'onb', sSignin: s.screen === 'signin', sHome: s.screen === 'home',
      sSetup: s.screen === 'setup', sSession: s.screen === 'session', sSummary: s.screen === 'summary',
      sJournal: s.screen === 'journal', sProgress: s.screen === 'progress', sSettings: s.screen === 'settings',
      sThreads: s.screen === 'threads',
      sCrisis: s.screen === 'crisis',
      hasTabs: ['home', 'journal', 'progress', 'settings'].indexOf(s.screen) >= 0,

      // onboarding
      onb0: s.onb === 0, onb1: s.onb === 1, onb2: s.onb === 2,
      onbTitle: onbData[s.onb].t, onbBody: onbData[s.onb].b, onbBtn: onbData[s.onb].btn,
      dot0: dot(0), dot1: dot(1), dot2: dot(2),
      onbNext: () => {
        if (s.onb < 2) this.setState({ onb: s.onb + 1 });
        else if (s.authed) { this.markOnboarded(); this.go(s.onboarded ? 'setup' : 'home'); }
        else this.go('signin');
      },
      toSignin: () => { if (s.authed) { this.markOnboarded(); this.go('home'); } else this.go('signin'); },

      // sign in — Supabase email OTP; Apple/Google are Phase 2
      authButtons: s.authMode === 'buttons',
      authEmailMode: s.authMode === 'email',
      authCodeMode: s.authMode === 'code',
      authEmail: s.authEmail, authCode: s.authCode, authBusy: s.authBusy, authErr: s.authErr,
      hasAuthErr: !!s.authErr,
      onAuthEmail: (e) => this.setState({ authEmail: e.target.value, authErr: '' }),
      onAuthCode: (e) => this.setState({ authCode: e.target.value.replace(/\D/g, '').slice(0, 6), authErr: '' }),
      authEmailKey: (e) => { if (e.key === 'Enter') this.authSend(); },
      authCodeKey: (e) => { if (e.key === 'Enter') this.authVerify(); },
      signIn: () => this.showToast('Sign in with Apple is coming soon — use email.'),
      signInGoogle: () => this.showToast('Google sign-in is coming soon — use email.'),
      signInEmail: () => {
        if (MOCK) { this.markOnboarded(); this.go('home'); this.showToast('Signed in (dev mock)'); return; }
        this.setState({ authMode: 'email', authErr: '' });
      },
      authBack: () => this.setState({ authMode: 'buttons', authErr: '', authCode: '' }),
      authSend: () => this.authSend(),
      authVerify: () => this.authVerify(),
      authSendLabel: s.authBusy ? 'Sending…' : 'Send code',
      authVerifyLabel: s.authBusy ? 'Verifying…' : 'Verify & continue',

      // home
      greeting: (() => {
        const h = new Date().getHours();
        const part = h < 6 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
        return s.displayName ? part + ', ' + s.displayName : part;
      })(),
      avatarLetter: (s.displayName || s.email || 'Y')[0].toUpperCase(),
      streakNum: String(streak),
      streakUnit: streak === 1 ? 'day in a row' : 'days in a row',
      calmNum: calmShiftLabel,
      toSettings: () => this.go('settings'),
      beginSession: () => this.go('setup'),
      seeAll: () => this.go('journal'),
      hasBeliefCards: s.sessions.length > 0,
      beliefCards: s.sessions.slice(0, 6).map(row => ({
        old: row.old_belief || '',
        neu: row.belief || '',
        meta: (row.started_at ? fmtDate(row.started_at) : '') + ' · ' + (row.emotion || '')
      })),

      // setup
      situation: s.situation,
      onSituation: (e) => this.setState({ situation: e.target.value }),
      emotions, intensity: s.intensity,
      intThumb: thumb(s.intensity, 10),
      intDown: this.mkSlider('intensity', 10, true),
      backHome: () => this.go('home'),
      startSession: () => this.startSession(),

      // session shell
      segs, closeSession: () => this.go('home'),
      stageLabel: 'STAGE ' + s.stage + ' OF 6 · ' + this.STAGE_LABELS[s.stage - 1],
      st1: s.stage === 1, st2: s.stage === 2, st3: s.stage === 3, st4: s.stage === 4, st5: s.stage === 5, st6: s.stage === 6,

      // stage 1
      voiceLabel: s.voiceOn ? 'Guide voice on' : 'Guide voice off',
      voiceChip: 'height:38px;padding:0 16px;border-radius:99px;display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;transition:all .2s;' +
        (s.voiceOn ? 'border:1px solid rgba(143,191,175,.6);color:#8FBFAF;background:rgba(143,191,175,.08)' : 'border:1px solid #3A3752;color:#6B678C'),
      toggleVoice: () => { this.setState({ voiceOn: !s.voiceOn }); this.persistSettings(); },
      skipBreath: () => this.setState({ stage: 2 }),
      ground: () => this.setState({ stage: 2 }),

      // stage 2
      isPlaying: s.playing, isPaused: !s.playing,
      togglePlay: () => this.setState({ playing: !s.playing }),
      audioFill: 'position:absolute;left:0;top:0;bottom:0;border-radius:99px;background:#E8A188;transition:width .9s linear;width:' + (s.audioT / 160 * 100) + '%',
      audioTime: mmss(s.audioT) + ' / 2:40',
      ready3: () => this.setState({ stage: 3, pullDepth: 0 }),
      tooIntense: () => { this.setState({ stage: 1 }); this.showToast("Let's ground first — no rush."); },

      // stage 3 · film dolly
      pullScene, dollyCard, takeLabel: 'TAKE 0' + (s.pullDepth + 1),
      pull1: s.pullDepth >= 1, pull2: s.pullDepth >= 2,
      pullBack: () => {
        if (s.pullDepth >= 2) this.showToast("That's far enough — you're safe here.");
        else this.setState({ pullDepth: s.pullDepth + 1 });
      },
      canSee: () => this.setState({ stage: 4 }),

      // stage 4 — mirror dialogue loop
      emoChip: s.emotion + ' · ' + s.intensity + '/10',
      auraStyle, calmRef, chatRef,
      chat: s.chat, typing: s.typing,
      phQuestion: s.loopPhase === 'question' && !s.parkOffer && !s.typing,
      phAsking: s.loopPhase === 'asking',
      phWait: s.loopPhase === 'wait_more',
      phReport: s.loopPhase === 'awaiting_report',
      phCheck: s.loopPhase === 'intensity_check',
      phGrounding: s.loopPhase === 'grounding',
      parkOffer: s.parkOffer,
      proposedQ: s.proposedQ,
      askAloud: () => this.askAloud(),
      anotherQuestion: () => this.anotherQuestion(),
      copySilent: () => this.copySilent(),
      hasAnswer: () => this.setState({ loopPhase: 'awaiting_report' }),
      report: s.report,
      onReport: (e) => this.setState({ report: e.target.value }),
      reportKey: (e) => { if (e.key === 'Enter') this.submitReport(this.state.report); },
      sendReport: () => this.submitReport(this.state.report),
      loopIntensity: Math.round(s.lastIntensity),
      loopThumb: thumb(s.lastIntensity, 10),
      loopDown: this.mkSlider('lastIntensity', 10, true),
      confirmIntensity: () => this.confirmIntensity(),
      parkNow: () => this.parkResolve('now'),
      parkLater: () => this.parkResolve('later'),
      groundExit: () => this.setState({ stage: 6 }),
      groundCrisis: () => this.go('crisis'),
      canFixate: s.exchangeCount >= 6 && s.loopPhase === 'question' && !s.parkOffer,
      toFixation: () => this.finishLoop(false),

      // session path map
      figureShown: !s.mapOpen,
      mapOpen: s.mapOpen,
      toggleMap: () => this.setState({ mapOpen: !s.mapOpen }),
      mapChipStyle: 'position:absolute;left:20px;top:104px;height:24px;padding:0 11px;border-radius:99px;display:flex;align-items:center;gap:6px;font-size:11px;cursor:pointer;z-index:4;transition:all .2s;' +
        (s.mapOpen ? 'border:1px solid rgba(232,161,136,.7);background:rgba(232,161,136,.12);color:#E8A188' : 'border:1px solid #3A3752;background:rgba(38,36,64,.6);color:#A5A1C2'),
      mapChipLabel: liveMap.deepest >= 3 ? 'Path · childhood' : (liveMap.deepest >= 1 ? 'Path · deeper' : 'Path'),
      liveMapPath: liveMap.path, liveDots: liveMap.dots, liveRows: liveMap.rows, liveBranches: liveMap.branches,
      liveHead: liveMap.head, liveEmpty: liveMoments.length === 0,
      sumMapPath: sumMap.path, sumDots: sumMap.dots, sumRows: sumMap.rows, sumBranches: sumMap.branches,
      beats,

      // side topics
      topicClosed: !s.topicOpen, topicOpen: s.topicOpen, topicText: s.topicText,
      openTopic: () => this.setState({ topicOpen: true }),
      onTopicText: (e) => this.setState({ topicText: e.target.value }),
      topicKey: (e) => { if (e.key === 'Enter') this.saveTopic(); },
      saveTopic: () => this.saveTopic(),

      // stage 5 belief check
      beliefCheckText, beliefCheckStyle,

      // stage 5
      oldBeliefText: s.oldBelief || 'The harsh belief underneath this moment.',
      onOldBelief: (e) => this.setState({ oldBelief: e.target.value, oldBeliefEdited: true }),
      calmerChip: 'Your copy feels calmer · ' + Math.round(s.lastIntensity) + '/10',
      belief: s.belief,
      onBelief: (e) => this.setState({ belief: e.target.value }),
      regen: () => {
        const drafts = s.aiDrafts && s.aiDrafts.length ? s.aiDrafts : this.DRAFTS;
        const i = (s.draftI + 1) % drafts.length;
        this.setState({ draftI: i, belief: drafts[i] });
      },
      feelsTrue: () => this.setState({ stage: 6 }),

      // stage 6
      wasLabel: 'was ' + s.intensity,
      after: Math.round(s.after),
      afterThumb: thumb(s.after, 10),
      afterDown: this.mkSlider('after', 10, true),
      complete: () => this.go('summary'),

      // summary
      sumMeta: s.emotion + ' · ' + Math.max(1, Math.round(((Date.now() - (s.startedAt || Date.now())) / 60000))) + ' min session',
      shiftText: s.intensity + ' → ' + Math.round(s.after),
      barBefore, barAfter, remindChip,
      toggleRemind: () => this.setState({ remind: !s.remind }),
      save: () => {
        const now = Date.now();
        const startedAt = s.startedAt || now - 60000;
        const moments = this.classifyMoments(s.chat);
        const row = {
          id: s.sessionId || crypto.randomUUID(),
          started_at: new Date(startedAt).toISOString(),
          ended_at: new Date(now).toISOString(),
          duration_min: Math.max(1, Math.round((now - startedAt) / 60000)),
          situation: s.situation || null,
          emotion: s.emotion,
          intensity: s.intensity,
          after_intensity: Math.round(s.after),
          old_belief: s.oldBelief || null,
          old_belief_source: s.oldBelief ? (s.oldBeliefEdited ? 'edited' : (s.safetyStopped ? 'inferred' : 'confirmed')) : null,
          belief: s.belief,
          shift: s.intensity + ' → ' + Math.round(s.after),
          chat: s.chat,
          moments,
          topics: s.topics,
          intensity_checkpoints: s.intensityTrail.concat([{ i: Math.round(s.after), at: s.exchangeCount, source: 'self' }]),
          outcome: s.safetyStopped ? 'safety_stopped' : (s.loopEnd === 'cap' ? 'partial' : 'completed'),
          loop_stats: {
            exchanges: s.exchangeCount,
            silences: s.silenceTotal,
            checks: s.intensityTrail.filter(p => p.source === 'self').length,
            deepest_depth: moments.reduce((d, m) => Math.max(d, m.depth || 0), 0)
          }
        };
        pushSession(row);
        this.setState({ sessions: [row].concat(s.sessions), screen: 'journal', filter: 'All' });
        this.showToast('Saved to your journal.');
      },

      // journal
      filterLabel: s.filter === 'All' ? 'All emotions' : s.filter,
      cycleFilter: () => {
        const order = ['All', 'Anxiety', 'Anger', 'Sadness'];
        this.setState({ filter: order[(order.indexOf(s.filter) + 1) % order.length] });
      },
      jRows, jEmpty: filtered.length === 0, jHas: filtered.length > 0,
      beginNow: () => this.go('setup'),
      // "for later" notes come from recent saved sessions (plus any noted mid-session)
      hasTopics: (() => {
        const fromSessions = s.sessions.slice(0, 5).flatMap(r => Array.isArray(r.topics) ? r.topics : []);
        return (s.topics.length + fromSessions.length) > 0;
      })(),
      topicChips: s.topics.concat(s.sessions.slice(0, 5).flatMap(r => Array.isArray(r.topics) ? r.topics : []))
        .slice(0, 6)
        .map(tp => ({
          t: tp.t,
          tap: () => { this.setState({ screen: 'setup', situation: tp.t, paywall: false }); this.showToast('New session from your note.'); }
        })),

      // connections (threads)
      ...TH,

      // progress
      beliefRows, emoSegs,
      hasProgressData: s.sessions.length > 0,
      totalSessions: String(recent.length),
      avgDropLabel: drops.length ? avgDrop.toFixed(1) : '—',
      rangeLabel: (s.sessions.length ? fmtDate(s.sessions[s.sessions.length - 1].started_at) : '') + ' — ' + (s.sessions.length ? fmtDate(s.sessions[0].started_at) : ''),

      // tabs
      tabs: [
        ['home', 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z'],
        ['journal', 'M5 20V5.5A2.5 2.5 0 0 1 7.5 3H19v15H7a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h12M9 7.5h6'],
        ['progress', 'M3 14c2.2-5.5 4-.5 6 1s4-8 6-5 2.8 2.5 6 1'],
        ['settings', 'M4 7h16M4 12h16M4 17h16M9 5v4M16 10v4M8 15v4']
      ].map(t => ({
        d: t[1],
        color: s.screen === t[0] ? '#E8A188' : '#7A7699',
        dot: 'width:4px;height:4px;border-radius:50%;transition:background .2s;background:' + (s.screen === t[0] ? '#E8A188' : 'transparent'),
        go: () => this.go(t[0])
      })),

      // paywall
      paywallOpen: s.paywall,
      yearCard: planCard(s.plan === 'yearly'), monthCard: planCard(s.plan === 'monthly'),
      pickYear: () => this.setState({ plan: 'yearly' }),
      pickMonth: () => this.setState({ plan: 'monthly' }),
      trial: () => { this.setState({ plus: true, paywall: false }); this.showToast('Plus is yours — 7 days free.'); },
      closePaywall: () => this.setState({ paywall: false }),

      // settings
      plus,
      profileName: s.displayName || 'You',
      profileEmail: s.email || '',
      accountTap: () => { if (!plus) this.setState({ paywall: true }); },
      voiceThumb, voiceDown: (e) => { this.mkSlider('voiceSpeed', 1, false)(e); this.persistSettings(); },
      hapTrack: track(s.haptics), hapKnob: knob(s.haptics),
      toggleHap: () => { this.setState({ haptics: !s.haptics }); this.persistSettings(); },
      trTrack: track(s.transcripts), trKnob: knob(s.transcripts),
      toggleTr: () => {
        this.setState({ transcripts: !s.transcripts });
        this.persistSettings();
        if (!s.transcripts) this.showToast('Transcripts will sync securely.');
      },
      exportTap: () => this.showToast('Export is coming in a future update.'),
      deleteTap: () => this.showToast('Account deletion is coming in a future update.'),
      methodTap: () => this.setState({ screen: 'onb', onb: 0 }),
      crisisTap: () => this.go('crisis'),
      signOut: () => this.signOut(),

      // crisis — real handoffs (numbers are US-based; findHelp covers the rest)
      call988: () => { this.showToast('Calling 988…'); try { window.location.href = 'tel:988'; } catch { /* browser */ } },
      text741: () => { this.showToast('Opening Messages…'); try { window.location.href = 'sms:741741&body=HOME'; } catch { /* browser */ } },
      findHelp: () => { try { window.open('https://findahelpline.com', '_blank'); } catch { /* popup blocked */ } },
      breatheInstead: () => this.go('session', { stage: 1 }),
      endOkay: () => { this.go('home'); this.showToast("Session ended. You're in control."); }
    };
  }
}
