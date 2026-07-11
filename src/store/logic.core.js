// PORTED 1:1 from design/CameraView Prototype.dc.html <script data-dc-script>.
// Only the class header changed (Component/DCLogic -> AppStore/StoreBase).
// Keep byte-faithful to the design; fidelity fixes belong in the design file first.
import { StoreBase } from './StoreBase'

export class AppStore extends StoreBase {
  constructor(props) {
    super(props);
    this.OLD = "If I get criticized, it means I'm worthless.";
    this.DRAFTS = [
      "Criticism stings, but it doesn't define my worth.",
      "I can handle moments like this — I've done it before.",
      "I know how to steady myself when things get loud."
    ];
    this.COPY_SAYS = [
      "I felt so small in front of everyone… like nothing I do is ever enough.",
      "That they're right about me. It's the same feeling as when I was eight — dad checking my homework at the kitchen table, waiting for the mistake. I just want someone to actually hear me — not fix me.",
      "…That helps. It's quieter in my chest now. I can breathe.",
      "I'm… okay, I think. It's over. It wasn't the end of the world.",
      "I can handle moments like this. I've done it before — I know how."
    ];
    this.COACH = [
      "They needed to say that out loud. Don't fix it yet — stay curious, ask what's underneath. And if other memories flash up while they talk, note them for later — each one is its own session.",
      "Hear that — it just reached back to age eight, all on its own. You didn't have to dig; the path dipped into childhood by itself. Let it keep moving, and when it's had its say — tell them what they need to hear, as a kind friend.",
      "Watch their shoulders drop. The wave passed because you let it speak. Now circle back to the start — ask them again: how are you now?",
      "'Okay' is progress — the storm passed. But don't stop at neutral. Ask what they can do now, what they know about themselves — help them find something stronger.",
      "Hear where that belief lives — inside you, not in anyone else's hands. That's the one we keep. Let's write it down."
    ];
    this.REDIRECT = [
      "Gently — that might quiet them before they've spoken. Ask a question instead, and let them empty it out.",
      "Kind words come later. Right now curiosity heals more — ask what's going on inside them."
    ];
    this.ASK_REDIRECT = "Put it as a question — it lands deeper when the words come from them, not from you.";
    this.EMOTIONS = ['Anxiety', 'Anger', 'Sadness', 'Shame', 'Fear', 'Resentment', 'Other'];
    this.ECOLORS = { Anxiety: '#E8A188', Anger: '#D9A96B', Sadness: '#8E9BB8', Shame: '#B48FB8', Fear: '#7E96A8', Resentment: '#C98F9A', Other: '#A5A1C2' };
    this.STAGE_LABELS = ['GROUNDING', 'THE SCENE', 'STEP BACK', 'GUIDE YOUR COPY', 'THE BELIEF', 'COMING BACK'];
    this.state = this.freshState();
  }

  freshState() {
    return {
      screen: 'onb', onb: 0, paywall: false, plan: 'yearly', plus: false, toast: '',
      situation: '', emotion: 'Anxiety', intensity: 7,
      stage: 1, voiceOn: true, playing: false, audioT: 80,
      pullDepth: 0,
      chat: [{ g: true, u: false, c: false, t: "Look at them standing there. Don't rush to calm them — let them speak first. Ask your copy a question: what is happening for them right now?" }],
      chatStep: 0, redir: 0, chatInput: '', typing: false,
      draftI: 0, belief: "Criticism stings, but it doesn't define my worth.",
      after: 3, remind: false, filter: 'All',
      journal: [
        { tag: 'Anxiety', date: 'Jul 9', dur: '14 min', belief: 'I handle hard moments better than I think.', shift: '6 → 2' },
        { tag: 'Anger', date: 'Jul 5', dur: '11 min', belief: 'Anger is a signal, not a command.', shift: '7 → 3' },
        { tag: 'Sadness', date: 'Jul 2', dur: '16 min', belief: 'Missing them means the love was real.', shift: '5 → 2' }
      ],
      voiceSpeed: 0.5, haptics: true, transcripts: false,
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
  }
  componentWillUnmount() { clearInterval(this.timer); clearTimeout(this.tt); clearTimeout(this.ct); }

  showToast(m) {
    clearTimeout(this.tt);
    this.setState({ toast: m });
    this.tt = setTimeout(() => this.setState({ toast: '' }), 2600);
  }
  go(screen, extra) { this.setState(Object.assign({ screen, paywall: false }, extra || {})); }
  startSession() {
    this.setState({
      screen: 'session', stage: 1, pullDepth: 0, playing: false, audioT: 80,
      chat: [{ g: true, u: false, c: false, t: "Look at them standing there. Don't rush to calm them — let them speak first. Ask your copy a question: what is happening for them right now?" }],
      chatStep: 0, redir: 0, chatInput: '', typing: false, after: 3, draftI: 0, belief: this.DRAFTS[0], mapOpen: false
    });
  }
  send(text) {
    const t = (text || '').trim();
    if (!t || this.state.typing || this.state.chatStep >= 5) return;
    const step = this.state.chatStep;
    const isQ = /\?/.test(t) || /^(what|why|how|where|when|who|do you|are you|can you|tell me)/i.test(t);
    this.setState(s => ({ chat: s.chat.concat([{ g: false, u: true, c: false, t }]), chatInput: '', typing: true }));
    const needsQ = step !== 2;
    if (needsQ && !isQ) {
      this.ct = setTimeout(() => {
        this.setState(s => ({
          chat: s.chat.concat([{ g: true, u: false, c: false, t: step < 2 ? this.REDIRECT[s.redir % this.REDIRECT.length] : this.ASK_REDIRECT }]),
          redir: s.redir + 1, typing: false
        }));
      }, 1100);
      return;
    }
    this.ct = setTimeout(() => {
      this.setState(s => ({ chat: s.chat.concat([{ g: false, u: false, c: true, t: this.COPY_SAYS[step] }]) }));
      this.ct = setTimeout(() => {
        this.setState(s => ({
          chat: s.chat.concat([{ g: true, u: false, c: false, t: this.COACH[step] }]),
          chatStep: s.chatStep + 1, typing: false
        }));
      }, 1600);
    }, 1100);
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
    if (/(when i was|as a kid|as a child|childhood|years old)/.test(x)) return 3;
    if (/(school|homework|teenag|grew up|growing up|my (dad|father|mom|mother|parents))/.test(x)) return 2;
    if (/(\balways\b|\bnever\b|\bever\b|every time|used to|years ago|months ago|last year)/.test(x)) return 1;
    return 0;
  }
  isShift(t) { return /(i can |i know |i've |i handle|it's over|okay|quieter|breathe|calmer|passed)/.test((t || '').toLowerCase()); }
  classifyMoments(chat) {
    const out = [];
    (chat || []).forEach(m => {
      if (m.g) return;
      if (m.u) {
        const q = /\?/.test(m.t) || /^(what|why|how|where|when|who|do you|are you|can you|tell me)/i.test(m.t);
        out.push({ who: 'you', kind: q ? 'q' : 'support', depth: 0, t: m.t });
      } else if (m.c) {
        const d = this.depthOf(m.t);
        out.push({ who: 'copy', kind: d > 0 ? 'memory' : (this.isShift(m.t) ? 'shift' : 'release'), depth: d, t: m.t });
      }
    });
    return out;
  }
  demoChat() {
    const qs = ["What's hurting right now?", "What's underneath that?", "You're allowed to feel this", 'How are you feeling now?', 'What do you know about yourself now?'];
    const out = [];
    qs.forEach((t, i) => { out.push({ u: true, t }); out.push({ c: true, t: this.COPY_SAYS[i] }); });
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
    const SS = [
      { n: 1, area: 'Work', emo: 'Anxiety', root: 1, depth: 3, t: 'Presentation torn apart', d: 'Jun 12' },
      { n: 2, area: 'Work', emo: 'Anxiety', root: 1, depth: 1, t: "Boss CC'd everyone", d: 'Jun 16' },
      { n: 3, area: 'Family', emo: 'Anger', root: 2, depth: 2, t: 'Talked over at dinner', d: 'Jun 19' },
      { n: 4, area: 'Friends', emo: 'Sadness', root: 1, depth: 3, t: 'Left out of the trip', d: 'Jun 23' },
      { n: 5, area: 'Self', emo: 'Shame', root: 0, depth: 1, t: 'Missed the gym again', d: 'Jun 26' },
      { n: 6, area: 'Work', emo: 'Anger', root: 2, depth: 2, t: 'Idea credited to someone else', d: 'Jun 30' },
      { n: 7, area: 'Friends', emo: 'Anxiety', root: 1, depth: 1, t: 'Unanswered message spiral', d: 'Jul 2' },
      { n: 8, area: 'Family', emo: 'Resentment', root: 2, depth: 2, t: 'Holiday plans decided for me', d: 'Jul 5' },
      { n: 9, area: 'Work', emo: 'Anxiety', root: 1, depth: 3, t: 'Quarterly review dread', d: 'Jul 8' },
      { n: 10, area: 'Friends', emo: 'Sadness', root: 1, depth: 1, t: 'Joke that landed wrong', d: 'Jul 9' }
    ];
    const dot = (x, y, c, r, ring) =>
      'position:absolute;left:' + (x - r).toFixed(1) + 'px;top:' + (y - r).toFixed(1) + 'px;width:' + (r * 2) + 'px;height:' + (r * 2) + 'px;border-radius:50%;background:' + c + ';box-shadow:0 0 9px ' + c + '77' + (ring ? ';outline:1.5px solid ' + ring + ';outline-offset:2px' : '');
    const lab = (x, y, c, mid) => 'position:absolute;left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;' + (mid ? 'transform:translateX(-50%);' : '') + 'font-size:8.5px;letter-spacing:.08em;color:' + c + ';white-space:nowrap';

    // A · constellation — sessions gather around a shared core belief
    const aC1 = [118, 200], aC2 = [272, 92];
    const aAng1 = [-90, -30, 30, 90, 150, 210], aAng2 = [-150, -20, 110];
    const aDots = []; let aL1 = '', aL2 = ''; let i1 = 0, i2 = 0;
    const sel = s.thSel || 1;
    SS.forEach(ss => {
      let x, y;
      if (ss.root === 1) { const a = aAng1[i1++] * Math.PI / 180; x = aC1[0] + 82 * Math.cos(a); y = aC1[1] + 82 * Math.sin(a); aL1 += 'M' + aC1[0] + ' ' + aC1[1] + 'L' + x.toFixed(0) + ' ' + y.toFixed(0); }
      else if (ss.root === 2) { const a = aAng2[i2++] * Math.PI / 180; x = aC2[0] + 64 * Math.cos(a); y = aC2[1] + 64 * Math.sin(a); aL2 += 'M' + aC2[0] + ' ' + aC2[1] + 'L' + x.toFixed(0) + ' ' + y.toFixed(0); }
      else { x = 322; y = 268; }
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

    return {
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
      toThreads: () => this.go('threads'),
      thBack: () => this.go('progress'),
      rootSession1: () => { this.setState({ screen: 'setup', situation: "The root: I'm only worth what I deliver", paywall: false }); this.showToast('Session aimed at the root.'); },
      rootSession2: () => { this.setState({ screen: 'setup', situation: 'The root: anger I learned to swallow', paywall: false }); this.showToast('Session aimed at the root.'); }
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
    const plus = s.plus || !!P.plusMember;
    const journal = P.journalEmpty ? [] : s.journal;

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
      ['08 Guide your copy', () => this.go('session', { stage: 4 })],
      ['09 The belief', () => this.go('session', { stage: 5 })],
      ['10 Coming back', () => this.go('session', { stage: 6 })],
      ['11 Session complete', () => this.go('summary')],
      ['head', 'APP'],
      ['12 Journal', () => this.go('journal')],
      ['13 Progress', () => this.go('progress')],
      ['17 Connections ★', () => this.go('threads')],
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
    const aura = auraColors[Math.min(s.chatStep, auraColors.length - 1)];
    const auraStyle = 'position:absolute;left:50%;top:34%;width:72px;height:44px;transform:translateX(-50%);border-radius:50%;filter:blur(15px);background:' + aura + ';transition:background 1.4s ease';
    const calmPct = Math.min(88, 14 + s.chatStep * 15);
    const calmRef = (el) => { if (el) el.style.width = calmPct + '%'; };
    const chatRef = (el) => { if (el) el.scrollTop = el.scrollHeight; };
    const quickSets = [
      ["What's hurting right now?", 'What are you afraid of?', 'What do you need from me?'],
      ["What's underneath that?", 'What are you afraid of?', 'What do you need from me?'],
      ["You're allowed to feel this", "I'm here — I'm not leaving", 'You did nothing wrong'],
      ['How are you feeling now?', "What's left in your body?"],
      ['What can you do next time?', 'What do you know about yourself now?', 'How should we hold this?']
    ];
    const quicks = (quickSets[s.chatStep] || []).map(t => ({ t, tap: () => this.send(t) }));

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

    // belief self-check (stage 5)
    const bl = (s.belief || '').toLowerCase();
    const aboutOthers = /(they|them|he |she |people|everyone|my boss|others)/.test(bl);
    const strong = /(i can|i know|i handle|i've|i am able|i will|i'm in charge|handle)/.test(bl);
    let beliefCheckText, beliefCheckColor;
    if (aboutOthers) { beliefCheckText = 'This leans on other people. Can it live inside you instead?'; beliefCheckColor = '#D9A96B'; }
    else if (strong) { beliefCheckText = 'Lives inside you — and it\'s strong. Keep it.'; beliefCheckColor = '#8FBFAF'; }
    else { beliefCheckText = 'True and calm. Could it be stronger — what do you know you can do?'; beliefCheckColor = '#A5A1C2'; }
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
      if (i === 0 && s.filter === 'All') jRows.push({
        ins: true, card: false, text: "You've calmed anxiety 4 times this month. It's getting faster — avg 3 min sooner.",
        tag: '', date: '', dur: '', belief: '', shift: '', barStyle: '', tagStyle: ''
      });
    });

    // ----- progress -----
    const beliefRows = [
      { old: 'I always ruin things', neu: 'I handle hard moments better than I think.' },
      { old: "If I get criticized, I'm worthless", neu: "Criticism stings, but it doesn't define my worth." },
      { old: 'I have to stay angry to be heard', neu: 'Anger is a signal, not a command.' }
    ];
    const emoData = [['Anxiety', 6, '#E8A188'], ['Anger', 4, '#D9A96B'], ['Sadness', 2, '#8E9BB8']];
    const emoSegs = emoData.map(d => ({
      label: d[0], count: d[1],
      style: 'flex:' + d[1] + ';border-radius:99px;background:' + d[2] + ';opacity:.85',
      labelStyle: 'flex:' + d[1] + ';font-size:10.5px;color:#A5A1C2;white-space:nowrap;overflow:hidden'
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
      restart: () => this.setState(this.freshState()),
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
      onbNext: () => { if (s.onb < 2) this.setState({ onb: s.onb + 1 }); else this.go('signin'); },
      toSignin: () => this.go('signin'),

      // sign in
      signIn: () => { this.go('home'); this.showToast('Signed in privately'); },

      // home
      toSettings: () => this.go('settings'),
      beginSession: () => this.go('setup'),
      seeAll: () => this.go('journal'),
      beliefCards: journal.map(j => ({ old: j.tag === 'Anxiety' ? 'I always ruin things' : (j.tag === 'Anger' ? 'I have to stay angry to be heard' : 'I should be over this by now'), neu: j.belief, meta: j.date.replace('Jul', 'Tue ·') === j.date ? j.date + ' · ' + j.tag : j.date + ' · ' + j.tag })),

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
      toggleVoice: () => this.setState({ voiceOn: !s.voiceOn }),
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

      // stage 4
      emoChip: s.emotion + ' · ' + s.intensity + '/10',
      auraStyle, calmRef, chatRef,
      chat: s.chat, typing: s.typing, quicks,
      chatInput: s.chatInput,
      onChatInput: (e) => this.setState({ chatInput: e.target.value }),
      onChatKey: (e) => { if (e.key === 'Enter') this.send(this.state.chatInput); },
      sendNow: () => this.send(this.state.chatInput),
      chatDone: s.chatStep >= 5 && !s.typing,
      toBelief: () => this.setState({ stage: 5 }),

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
      belief: s.belief,
      onBelief: (e) => this.setState({ belief: e.target.value }),
      regen: () => {
        const i = (s.draftI + 1) % this.DRAFTS.length;
        this.setState({ draftI: i, belief: this.DRAFTS[i] });
      },
      feelsTrue: () => this.setState({ stage: 6 }),

      // stage 6
      wasLabel: 'was ' + s.intensity,
      after: Math.round(s.after),
      afterThumb: thumb(s.after, 10),
      afterDown: this.mkSlider('after', 10, true),
      complete: () => this.go('summary'),

      // summary
      sumMeta: s.emotion + ' · 12 min session',
      shiftText: s.intensity + ' → ' + Math.round(s.after),
      barBefore, barAfter, remindChip,
      toggleRemind: () => this.setState({ remind: !s.remind }),
      save: () => {
        const entry = { tag: s.emotion, date: 'Jul 11', dur: '12 min', belief: s.belief, shift: s.intensity + ' → ' + Math.round(s.after) };
        this.setState({ journal: [entry].concat(s.journal), screen: 'journal', filter: 'All' });
        this.showToast('Saved — only on this phone.');
      },

      // journal
      filterLabel: s.filter === 'All' ? 'All emotions' : s.filter,
      cycleFilter: () => {
        const order = ['All', 'Anxiety', 'Anger', 'Sadness'];
        this.setState({ filter: order[(order.indexOf(s.filter) + 1) % order.length] });
      },
      jRows, jEmpty: filtered.length === 0, jHas: filtered.length > 0,
      beginNow: () => this.go('setup'),
      hasTopics: s.topics.length > 0,
      topicChips: s.topics.map(tp => ({
        t: tp.t,
        tap: () => { this.setState({ screen: 'setup', situation: tp.t, paywall: false }); this.showToast('New session from your note.'); }
      })),

      // connections (threads)
      ...TH,

      // progress
      beliefRows, emoSegs,

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
      accountTap: () => { if (!plus) this.setState({ paywall: true }); },
      voiceThumb, voiceDown: this.mkSlider('voiceSpeed', 1, false),
      hapTrack: track(s.haptics), hapKnob: knob(s.haptics),
      toggleHap: () => this.setState({ haptics: !s.haptics }),
      trTrack: track(s.transcripts), trKnob: knob(s.transcripts),
      toggleTr: () => {
        this.setState({ transcripts: !s.transcripts });
        if (!s.transcripts) this.showToast('Transcripts will sync securely.');
      },
      exportTap: () => this.showToast('Export prepared — check your email.'),
      deleteTap: () => this.showToast('This would start account deletion.'),
      methodTap: () => this.setState(Object.assign(this.freshState(), { screen: 'onb' })),
      crisisTap: () => this.go('crisis'),

      // crisis
      call988: () => this.showToast('Calling 988…'),
      text741: () => this.showToast('Opening Messages…'),
      findHelp: () => this.showToast('Opening international directory…'),
      breatheInstead: () => this.go('session', { stage: 1 }),
      endOkay: () => { this.go('home'); this.showToast("Session ended. You're in control."); }
    };
  }
}
