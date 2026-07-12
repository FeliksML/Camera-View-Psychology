// GENERATED from design/CameraView Prototype.dc.html — section "SESSION SHELL (5–10)".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Session() {
  const v = useApp()
  return (
    <>
      {v.sSession && (
        <div style={sx("position:absolute;inset:0")}>
          <div style={sx("position:absolute;inset:0;box-shadow:inset 0 0 110px 40px rgba(10,9,18,.6);pointer-events:none;z-index:2")} />
          <div style={sx("position:absolute;top:calc(64px + env(safe-area-inset-top, 0px));left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:3")}>
            {v.segs.map((g: any, i: number) => (
              <div key={i} style={sx(g.style)} />
            ))}
          </div>
          <div onClick={v.closeSession} style={sx("position:absolute;top:calc(52px + env(safe-area-inset-top, 0px));right:18px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:#6B678C;font-size:17px;cursor:pointer;z-index:3")} className={pseudo('hover', "color:#ECEAF7")}>✕</div>
          <div style={sx("position:absolute;top:calc(80px + env(safe-area-inset-top, 0px));left:0;right:0;text-align:center;font-size:10.5px;letter-spacing:.18em;color:#6B678C;z-index:3")}>{v.stageLabel}</div>
          {/* 5 · GROUNDING */}
          {v.st1 && (
            <div data-screen-label="05 Session - Grounding" style={sx("position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;animation:cvFade .6s ease both")}>
              <div style={sx("position:absolute;left:16%;top:20%;width:9px;height:9px;border-radius:50%;background:rgba(236,234,247,.12);filter:blur(2px);animation:cvDrift 11s ease-in-out infinite")} />
              <div style={sx("position:absolute;left:76%;top:30%;width:13px;height:13px;border-radius:50%;background:rgba(232,161,136,.16);filter:blur(3px);animation:cvDrift 13s ease-in-out 2s infinite")} />
              <div style={sx("position:absolute;left:30%;top:64%;width:7px;height:7px;border-radius:50%;background:rgba(143,191,175,.18);filter:blur(2px);animation:cvDrift 9s ease-in-out 1s infinite")} />
              <div style={sx("flex:1.15")} />
              <div style={sx("position:relative;width:300px;height:300px;display:flex;align-items:center;justify-content:center")}>
                <div style={sx("position:absolute;inset:14px;border:1px solid rgba(58,55,82,.9);border-radius:50%")} />
                <div style={sx("position:absolute;inset:40px;border:1px solid rgba(165,161,194,.25);border-radius:50%")} />
                <div style={sx("position:relative;width:220px;height:220px;animation:cvBreathe 10s ease-in-out infinite")}>
                  <div style={sx("position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(165,161,194,.28) 0%,rgba(165,161,194,.1) 55%,transparent 72%)")} />
                  <div style={sx("position:absolute;inset:26px;border-radius:50%;background:radial-gradient(circle,rgba(236,234,247,.16),rgba(165,161,194,.06) 70%);box-shadow:0 0 44px rgba(232,161,136,.35),inset 0 0 30px rgba(232,161,136,.15)")} />
                  <div style={sx("position:absolute;inset:0;display:flex;align-items:center;justify-content:center")}>
                    <span style={sx("position:absolute;font-family:Lora,serif;font-size:22px;animation:cvWordIn 10s ease-in-out infinite")}>Inhale</span>
                    <span style={sx("position:absolute;font-family:Lora,serif;font-size:22px;animation:cvWordOut 10s ease-in-out infinite")}>Exhale</span>
                  </div>
                </div>
              </div>
              <div style={sx("font-size:13px;color:#6B678C;margin-top:2px")}>4 in · 6 out</div>
              <div style={sx("flex:1")} />
              <div style={sx("width:100%;padding:0 26px 34px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center")}>
                <div style={sx("width:100%;box-sizing:border-box;background:rgba(38,36,64,.75);border-radius:20px;padding:16px 20px;font-family:Lora,serif;font-style:italic;font-size:16.5px;line-height:1.5;color:#D9D6EA;text-align:center")}>Let's arrive first. Three slow breaths — just follow the circle.</div>
                <div style={sx("display:flex;gap:10px;margin-top:14px")}>
                  <div onClick={v.toggleVoice} style={sx(v.voiceChip)} className={pseudo('hover', "border-color:#A5A1C2")}>
                    <svg width="14" height="10" viewBox="0 0 14 10">
                      <path d="M1 5h1.5M4 2v6M7 .8v8.4M10 2.5v5M12.5 4v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    {v.voiceLabel}
                  </div>
                  <div onClick={v.skipBreath} style={sx("height:38px;padding:0 16px;border-radius:99px;border:1px solid #3A3752;display:flex;align-items:center;font-size:13px;color:#A5A1C2;cursor:pointer")} className={pseudo('hover', "border-color:#A5A1C2;color:#ECEAF7")}>Skip breathing</div>
                </div>
                <div onClick={v.ground} style={sx("margin-top:16px;height:52px;width:100%;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>I'm here — continue</div>
              </div>
            </div>
          )}
          {/* 6 · SCENE */}
          {v.st2 && (
            <div data-screen-label="06 Session - The scene" style={sx("position:absolute;inset:0;display:flex;flex-direction:column;animation:cvFade .6s ease both;background:radial-gradient(120% 90% at 50% 0%,#100E1D 0%,#161426 60%,#1B1930 100%)")}>
              <div style={sx("height:42%;position:relative")}>
                <div style={sx("position:absolute;left:56%;top:52%;width:200px;height:240px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(232,180,140,.14) 0%,transparent 60%);filter:blur(10px)")} />
                <div style={sx("position:absolute;left:56%;top:52%;width:120px;height:164px;transform:translate(-50%,-50%) rotate(-4deg);border:1px solid rgba(232,190,150,.4);border-radius:4px;box-shadow:0 0 34px rgba(232,180,140,.22),inset 0 0 26px rgba(232,180,140,.12)")} />
                <div style={sx("position:absolute;left:56%;top:52%;width:120px;height:164px;transform:translate(-50%,-50%) rotate(-4deg);background:linear-gradient(200deg,rgba(232,190,150,.12),transparent 70%)")} />
                <div style={sx("position:absolute;inset:0;box-shadow:inset 0 -40px 60px rgba(13,12,22,.5)")} />
              </div>
              <div style={sx("padding:0 26px")}>
                <div style={sx("display:flex;align-items:center;gap:7px;font-size:11.5px;color:#6B678C;letter-spacing:.04em;margin-bottom:8px")}>
                  <div style={sx("width:16px;height:16px;border:1px solid #A5A1C2;border-radius:50%;display:flex;align-items:center;justify-content:center")}>
                    <div style={sx("width:4px;height:4px;border-radius:50%;background:#E8A188")} />
                  </div>
                  {" Your guide "}
                </div>
                <div style={sx("background:rgba(38,36,64,.75);border-radius:20px;padding:16px 20px;font-family:Lora,serif;font-size:16.5px;line-height:1.55;color:#D9D6EA")}>
                  Close your eyes if you like. Step into the moment you wrote about. Where are you? What do you hear?
                </div>
              </div>
              <div style={sx("flex:1")} />
              <div style={sx("padding:0 26px 34px")}>
                <div style={sx("background:rgba(38,36,64,.8);border-radius:20px;padding:14px 16px;display:flex;align-items:center;gap:14px")}>
                  <div onClick={v.togglePlay} style={sx("width:46px;height:46px;border-radius:50%;background:#E8A188;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none")} className={pseudo('active', "transform:scale(.94)")}>
                    {v.isPlaying && (
                      <svg width="12" height="14" viewBox="0 0 12 14">
                        <rect x="1" y="1" width="3.4" height="12" rx="1.2" fill="#1E1C33" />
                        <rect x="7.6" y="1" width="3.4" height="12" rx="1.2" fill="#1E1C33" />
                      </svg>
                    )}
                    {v.isPaused && (
                      <svg width="13" height="14" viewBox="0 0 13 14" style={sx("margin-left:2px")}>
                        <path d="M1.5 1.6v10.8c0 .9 1 1.5 1.8 1L12 8.3c.8-.5.8-1.7 0-2.2L3.3.7c-.8-.5-1.8 0-1.8 1z" fill="#1E1C33" />
                      </svg>
                    )}
                  </div>
                  <div style={sx("flex:1")}>
                    <div style={sx("font-size:13.5px;font-weight:500")}>Guided immersion</div>
                    <div style={sx("position:relative;height:3px;border-radius:99px;background:#3A3752;margin-top:9px")}>
                      <div style={sx(v.audioFill)} />
                    </div>
                    <div style={sx("font-size:11px;color:#6B678C;margin-top:6px")}>{v.audioTime}</div>
                  </div>
                </div>
                <div style={sx("display:flex;gap:10px;margin-top:14px")}>
                  <div onClick={v.ready3} style={sx("flex:1.1;height:46px;border-radius:99px;border:1px solid #E8A188;color:#E8A188;display:flex;align-items:center;justify-content:center;font-size:13.5px;font-weight:500;cursor:pointer")} className={pseudo('hover', "background:rgba(232,161,136,.1)")}>I'm ready — continue</div>
                  <div onClick={v.tooIntense} style={sx("flex:1;height:46px;border-radius:99px;border:1px solid #3A3752;color:#A5A1C2;display:flex;align-items:center;justify-content:center;font-size:13.5px;cursor:pointer")} className={pseudo('hover', "border-color:#A5A1C2;color:#ECEAF7")}>This is too intense</div>
                </div>
              </div>
            </div>
          )}
          {/* 7 · CAMERA PULL-OUT */}
          {v.st3 && (
            <div data-screen-label="07 Session - Step back" style={sx("position:absolute;inset:0;animation:cvFade .6s ease both")}>
              <div style={sx("position:absolute;top:118px;left:34px;right:34px;text-align:center;font-family:Lora,serif;font-size:20px;line-height:1.45;color:#ECEAF7;z-index:4;text-wrap:pretty")}>
                Now, gently dolly back. That person in the frame is you — and you're safe here, watching.
              </div>
              {/* film dolly */}
              <div style={sx("position:absolute;inset:0;display:flex;align-items:center;justify-content:center")}>
                {v.pull2 && (
                  <div style={sx("position:absolute;left:50%;top:55%;width:352px;height:482px;transform:translate(-50%,-50%) rotate(1.2deg);border:1px solid rgba(236,234,247,.08);border-radius:8px;animation:cvFade .8s ease both")}>
                    <div style={sx("position:absolute;right:12px;top:8px;font-size:8.5px;letter-spacing:.16em;color:rgba(165,161,194,.25)")}>TAKE 02</div>
                  </div>
                )}
                {v.pull1 && (
                  <div style={sx("position:absolute;left:50%;top:55%;width:322px;height:442px;transform:translate(-50%,-50%) rotate(-1.6deg);border:1px solid rgba(236,234,247,.13);border-radius:7px;animation:cvFade .8s ease both")}>
                    <div style={sx("position:absolute;right:12px;top:8px;font-size:8.5px;letter-spacing:.16em;color:rgba(165,161,194,.35)")}>TAKE 01</div>
                  </div>
                )}
                <div style={sx(v.dollyCard)}>
                  <div style={sx("position:absolute;left:8px;top:6px;bottom:6px;width:13px;background:repeating-linear-gradient(180deg,transparent 0 8px,rgba(236,234,247,.22) 8px 20px);border-radius:2px")} />
                  <div style={sx("position:absolute;right:8px;top:6px;bottom:6px;width:13px;background:repeating-linear-gradient(180deg,transparent 0 8px,rgba(236,234,247,.22) 8px 20px);border-radius:2px")} />
                  <div style={sx("position:absolute;left:30px;right:30px;top:6px;bottom:6px;border:1px solid rgba(236,234,247,.35);border-radius:3px;overflow:hidden")}>
                    <div style={sx(v.pullScene)}>
                      <div style={sx("position:absolute;left:50%;top:62%;width:150px;height:44px;transform:translate(-50%,-50%);background:radial-gradient(ellipse,rgba(236,234,247,.16) 0%,transparent 70%)")} />
                      <div style={sx("position:absolute;left:50%;top:55%;transform:translate(-50%,-50%)")}>
                        <svg width="42" height="68" viewBox="0 0 60 96">
                          <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.5)" strokeWidth="1" />
                        </svg>
                      </div>
                      <div style={sx("position:absolute;left:14%;top:20%;width:8px;height:8px;border-radius:50%;background:rgba(232,161,136,.2);filter:blur(2px);animation:cvDrift 10s ease-in-out infinite")} />
                      <div style={sx("position:absolute;left:74%;top:34%;width:11px;height:11px;border-radius:50%;background:rgba(236,234,247,.1);filter:blur(3px);animation:cvDrift 12s ease-in-out 1.5s infinite")} />
                    </div>
                  </div>
                  <div style={sx("position:absolute;left:34px;top:12px;width:8px;height:8px;border-radius:50%;background:#E8A188;animation:cvPulse 2.6s ease-in-out infinite")} />
                  <div style={sx("position:absolute;right:36px;top:10px;font-size:9px;letter-spacing:.16em;color:rgba(165,161,194,.6)")}>{v.takeLabel}</div>
                </div>
              </div>
              <div style={sx("position:absolute;left:26px;right:26px;bottom:30px;z-index:4")}>
                <div onClick={v.canSee} style={sx("height:56px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16.5px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>I can see myself</div>
                <div onClick={v.pullBack} style={sx("margin:12px auto 0;height:40px;width:200px;border-radius:99px;border:1px solid #3A3752;display:flex;align-items:center;justify-content:center;font-size:13px;color:#A5A1C2;cursor:pointer")} className={pseudo('hover', "border-color:#A5A1C2;color:#ECEAF7")}>Dolly back further</div>
                <div style={sx("text-align:center;font-size:11.5px;color:#6B678C;margin-top:12px")}>Take your time. Distance is the medicine.</div>
              </div>
            </div>
          )}
          {/* 8 · OBSERVE & GUIDE */}
          {v.st4 && (
            <div data-screen-label="08 Session - Guide your copy" style={sx("position:absolute;inset:0;display:flex;flex-direction:column;animation:cvFade .6s ease both")}>
              <div style={sx("height:35%;position:relative;flex:none")}>
                <div style={sx("position:absolute;right:20px;top:104px;height:24px;padding:0 11px;border-radius:99px;border:1px solid #3A3752;background:rgba(38,36,64,.6);display:flex;align-items:center;font-size:11px;color:#A5A1C2;z-index:3")}>{v.emoChip}</div>
                <div onClick={v.toggleMap} style={sx(v.mapChipStyle)} className={pseudo('hover', "border-color:#A5A1C2")}>
                  <svg width="15" height="11" viewBox="0 0 15 11">
                    <path d="M1 3.5 C3.5 3.5 3.5 8.5 6 8.5 S8.5 2 11 2 14 6 14 6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {v.mapChipLabel}
                </div>
                {v.figureShown && (
                  <div>
                    <div style={sx("position:absolute;left:50%;top:58%;width:170px;height:170px;transform:translate(-50%,-50%);border:1px solid rgba(236,234,247,.3);border-radius:50%")} />
                    <div style={sx("position:absolute;left:50%;top:70%;width:150px;height:40px;transform:translate(-50%,-50%);background:radial-gradient(ellipse,rgba(236,234,247,.14) 0%,transparent 70%)")} />
                    <div style={sx(v.auraStyle)} />
                    <div style={sx("position:absolute;left:50%;top:58%;transform:translate(-50%,-50%)")}>
                      <svg width="36" height="58" viewBox="0 0 60 96">
                        <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.5)" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>
                )}
                {v.mapOpen && (
                  <div style={sx("position:absolute;left:20px;right:20px;top:138px;height:148px;animation:cvFade .4s ease both")}>
                    {v.liveRows.map((rw: any, i: number) => (
                      <div key={i}>
                        <div style={sx(rw.line)} />
                        <div style={sx(rw.lab)}>{rw.label}</div>
                      </div>
                    ))}
                    <svg width="362" height="148" viewBox="0 0 362 148" style={sx("position:absolute;left:0;top:0;overflow:visible")}>
                      <defs>
                        <linearGradient id="cvGradA" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0" stopColor="#E26454" />
                          <stop offset=".55" stopColor="#E8A188" />
                          <stop offset="1" stopColor="#8FBFAF" />
                        </linearGradient>
                      </defs>
                      <path d={v.liveMapPath} fill="none" stroke="url(#cvGradA)" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    {v.liveDots.map((dt: any, i: number) => (
                      <div key={i}>
                        <div style={sx(dt.style)} />
                      </div>
                    ))}
                    {v.liveBranches.map((br: any, i: number) => (
                      <div key={i}>
                        <div style={sx(br.stub)} />
                        <div style={sx(br.dot)} />
                        <div style={sx(br.lab)}>{br.t}</div>
                      </div>
                    ))}
                    <div style={sx(v.liveHead)} />
                    {v.liveEmpty && (
                      <div style={sx("position:absolute;left:30px;top:12px;max-width:220px;font-size:11px;line-height:1.5;color:#6B678C")}>
                        The path draws itself as you two talk — questions, what surfaces, the shift.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={sx("flex:1;display:flex;flex-direction:column;min-height:0;border-top:1px solid rgba(58,55,82,.5);position:relative")}>
                <div style={sx("position:absolute;top:-1px;left:0;height:2px;border-radius:2px;background:#8FBFAF;box-shadow:0 0 8px rgba(143,191,175,.6);transition:width 1.2s ease;z-index:2;width:0")} ref={v.calmRef} />
                <div ref={v.chatRef} style={sx("flex:1;overflow-y:auto;padding:18px 22px 10px")} className="cvs">
                  {v.chat.map((m: any, i: number) => (
                    <div key={i}>
                      {m.g && (
                        <div style={sx("display:flex;gap:9px;margin-bottom:16px;animation:cvFadeUp .4s ease both")}>
                          <div style={sx("width:18px;height:18px;flex:none;margin-top:3px;border:1px solid #A5A1C2;border-radius:50%;display:flex;align-items:center;justify-content:center")}>
                            <div style={sx("width:4px;height:4px;border-radius:50%;background:#E8A188")} />
                          </div>
                          <div style={sx("font-family:Lora,serif;font-size:16px;line-height:1.55;color:#D9D6EA;max-width:86%")}>{m.t}</div>
                        </div>
                      )}
                      {m.u && (
                        <div style={sx("display:flex;justify-content:flex-end;margin-bottom:16px;animation:cvFadeUp .4s ease both")}>
                          <div style={sx("background:rgba(38,36,64,.85);border:1px solid rgba(58,55,82,.8);border-radius:16px 16px 4px 16px;padding:10px 14px;font-size:14.5px;line-height:1.45;color:#ECEAF7;max-width:78%")}>{m.t}</div>
                        </div>
                      )}
                      {m.c && (
                        <div style={sx("display:flex;gap:9px;margin-bottom:16px;animation:cvFadeUp .4s ease both")}>
                          <div style={sx("width:18px;height:18px;flex:none;margin-top:15px;border:1px solid rgba(165,161,194,.55);border-radius:50%;display:flex;align-items:flex-end;justify-content:center;overflow:hidden")}>
                            <svg width="9" height="13" viewBox="0 0 60 96" style={sx("display:block")}>
                              <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.6)" strokeWidth="2" />
                            </svg>
                          </div>
                          <div style={sx("max-width:80%")}>
                            <div style={sx("font-size:9.5px;letter-spacing:.14em;color:#6B678C;margin-bottom:4px")}>YOUR COPY</div>
                            <div style={sx("background:rgba(30,28,48,.55);border:1px solid rgba(165,161,194,.25);border-radius:4px 16px 16px 16px;padding:10px 14px;font-size:14px;font-style:italic;line-height:1.5;color:#C9C5DE")}>{m.t}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {v.typing && (
                    <div style={sx("display:flex;gap:9px;margin-bottom:16px")}>
                      <div style={sx("width:18px;height:18px;flex:none;margin-top:3px;border:1px solid #A5A1C2;border-radius:50%;display:flex;align-items:center;justify-content:center")}>
                        <div style={sx("width:4px;height:4px;border-radius:50%;background:#E8A188")} />
                      </div>
                      <div style={sx("display:flex;gap:4px;align-items:center;height:24px")}>
                        <div style={sx("width:5px;height:5px;border-radius:50%;background:#A5A1C2;animation:cvDot 1.2s infinite")} />
                        <div style={sx("width:5px;height:5px;border-radius:50%;background:#A5A1C2;animation:cvDot 1.2s .2s infinite")} />
                        <div style={sx("width:5px;height:5px;border-radius:50%;background:#A5A1C2;animation:cvDot 1.2s .4s infinite")} />
                      </div>
                    </div>
                  )}
                  {v.chatDone && (
                    <div onClick={v.toBelief} style={sx("margin:6px auto 12px;height:48px;max-width:280px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;cursor:pointer;animation:cvFadeUp .5s ease both")} className={pseudo('active', "transform:scale(.98)")}>Look at the belief beneath</div>
                  )}
                </div>
                <div style={sx("padding:0 22px 6px;display:flex;justify-content:flex-end")}>
                  {v.topicClosed && (
                    <div onClick={v.openTopic} style={sx("height:28px;padding:0 12px;border-radius:99px;border:1px dashed rgba(143,191,175,.45);display:flex;align-items:center;font-size:11.5px;color:#8FBFAF;cursor:pointer")} className={pseudo('hover', "border-color:#8FBFAF")}>+ Note a side topic</div>
                  )}
                  {v.topicOpen && (
                    <div style={sx("flex:1;display:flex;gap:8px;align-items:center")}>
                      <input value={v.topicText} onChange={v.onTopicText} onKeyDown={v.topicKey} placeholder="Name what flashed up — a few words" style={sx("flex:1;height:32px;border-radius:99px;background:rgba(38,36,64,.8);border:1px dashed rgba(143,191,175,.5);padding:0 14px;color:#ECEAF7;font-family:Inter,sans-serif;font-size:12.5px;outline:none")} />
                      <div onClick={v.saveTopic} style={sx("height:32px;padding:0 14px;border-radius:99px;background:rgba(143,191,175,.18);border:1px solid rgba(143,191,175,.5);display:flex;align-items:center;font-size:12px;color:#8FBFAF;cursor:pointer")}>Save</div>
                    </div>
                  )}
                </div>
                <div style={sx("padding:0 22px 8px;display:flex;gap:8px;flex-wrap:wrap")}>
                  {v.quicks.map((q: any, i: number) => (
                    <div key={i} onClick={q.tap} style={sx("height:32px;padding:0 13px;border-radius:99px;border:1px solid #3A3752;display:flex;align-items:center;font-size:12.5px;color:#A5A1C2;cursor:pointer")} className={pseudo('hover', "border-color:#A5A1C2;color:#ECEAF7")}>{q.t}</div>
                  ))}
                </div>
                <div style={sx("padding:6px 22px calc(30px + env(safe-area-inset-bottom, 0px));display:flex;align-items:center;gap:10px")}>
                  <div style={sx("flex:1;position:relative")}>
                    <input value={v.chatInput} onChange={v.onChatInput} onKeyDown={v.onChatKey} placeholder="Speak to your copy…" style={sx("width:100%;box-sizing:border-box;height:46px;border-radius:99px;background:rgba(38,36,64,.8);border:1px solid #3A3752;padding:0 44px 0 18px;color:#ECEAF7;font-family:Inter,sans-serif;font-size:14.5px;outline:none")} className={pseudo('focus', "border-color:rgba(232,161,136,.6)")} />
                    <svg width="13" height="18" viewBox="0 0 15 20" style={sx("position:absolute;right:17px;top:14px;opacity:.55")}>
                      <rect x="4.5" y="1" width="6" height="11" rx="3" fill="none" stroke="#A5A1C2" strokeWidth="1.2" />
                      <path d="M1.5 9.5a6 6 0 0 0 12 0M7.5 15.5V19" fill="none" stroke="#A5A1C2" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div onClick={v.sendNow} style={sx("width:46px;height:46px;border-radius:50%;background:#E8A188;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none")} className={pseudo('active', "transform:scale(.94)")}>
                    <svg width="15" height="15" viewBox="0 0 15 15">
                      <path d="M2 7.5h10M8 3l4.5 4.5L8 12" fill="none" stroke="#1E1C33" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* 9 · BELIEF WORK */}
          {v.st5 && (
            <div data-screen-label="09 Session - The belief" style={sx("position:absolute;inset:0;display:flex;flex-direction:column;padding:104px 24px 30px;box-sizing:border-box;animation:cvFade .6s ease both")}>
              <div style={sx("display:flex;align-items:center;gap:12px")}>
                <div style={sx("position:relative;width:54px;height:54px;flex:none")}>
                  <div style={sx("position:absolute;inset:0;border:1px solid rgba(236,234,247,.3);border-radius:50%")} />
                  <div style={sx("position:absolute;left:50%;top:26%;width:26px;height:14px;transform:translateX(-50%);border-radius:50%;filter:blur(6px);background:rgba(143,191,175,.4)")} />
                  <div style={sx("position:absolute;left:50%;top:52%;transform:translate(-50%,-46%)")}>
                    <svg width="17" height="27" viewBox="0 0 60 96">
                      <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.5)" strokeWidth="1.4" />
                    </svg>
                  </div>
                </div>
                <div style={sx("height:26px;padding:0 12px;border-radius:99px;border:1px solid rgba(143,191,175,.5);background:rgba(143,191,175,.08);display:flex;align-items:center;font-size:11.5px;color:#8FBFAF")}>Your copy feels calmer · 3/10</div>
              </div>
              <div style={sx("margin-top:20px;background:rgba(30,28,48,.7);border:1px solid rgba(58,55,82,.6);border-radius:20px;padding:16px 20px;opacity:.75")}>
                <div style={sx("display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.14em;color:#6B678C")}>
                  <svg width="13" height="13" viewBox="0 0 14 14">
                    <path d="M7 1 12.5 4v6L7 13 1.5 10V4L7 1z" fill="none" stroke="#6B678C" strokeWidth="1" />
                    <path d="M5 4.5 7 7l-1 2.5" fill="none" stroke="#6B678C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {" THE OLD BELIEF "}
                </div>
                <div style={sx("font-family:Lora,serif;font-size:19px;line-height:1.45;color:#A5A1C2;text-decoration:line-through;text-decoration-color:rgba(165,161,194,.5);margin-top:9px")}>If I get criticized, it means I'm worthless.</div>
              </div>
              <div style={sx("display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0")}>
                <svg width="12" height="7" viewBox="0 0 12 7" style={sx("opacity:.9")}>
                  <path d="M1 1l5 5 5-5" fill="none" stroke="#A5A1C2" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <svg width="12" height="7" viewBox="0 0 12 7" style={sx("opacity:.55")}>
                  <path d="M1 1l5 5 5-5" fill="none" stroke="#A5A1C2" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <svg width="12" height="7" viewBox="0 0 12 7" style={sx("opacity:.28")}>
                  <path d="M1 1l5 5 5-5" fill="none" stroke="#A5A1C2" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <div style={sx("position:relative;background:rgba(38,36,64,.85);border:1px solid rgba(232,161,136,.55);border-radius:22px;padding:18px 20px;box-shadow:0 0 30px rgba(232,161,136,.14),inset 0 0 24px rgba(232,161,136,.05)")}>
                <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
                  <div style={sx("font-size:11px;letter-spacing:.14em;color:#E8A188")}>A TRUER BELIEF</div>
                  <div style={sx("display:flex;gap:12px")}>
                    <svg onClick={v.regen} width="15" height="15" viewBox="0 0 16 16" style={sx("cursor:pointer;opacity:.7")}>
                      <path d="M13.5 6.5A6 6 0 0 0 3 4.5M2.5 9.5a6 6 0 0 0 10.5 2" fill="none" stroke="#A5A1C2" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M3 1.5v3h3M13 14.5v-3h-3" fill="none" stroke="#A5A1C2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <svg width="14" height="14" viewBox="0 0 14 14" style={sx("opacity:.7")}>
                      <path d="m1 13 .8-3.2L10 1.6a1.4 1.4 0 0 1 2 0l.4.4a1.4 1.4 0 0 1 0 2L4.2 12.2 1 13z" fill="none" stroke="#A5A1C2" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <textarea value={v.belief} onChange={v.onBelief} style={sx("width:100%;box-sizing:border-box;background:transparent;border:none;outline:none;resize:none;font-family:Lora,serif;font-size:22px;line-height:1.45;color:#ECEAF7;margin-top:10px;min-height:96px")} />
                <div style={sx(v.beliefCheckStyle)}>{v.beliefCheckText}</div>
              </div>
              <div style={sx("text-align:center;font-family:Lora,serif;font-style:italic;font-size:14.5px;color:#A5A1C2;margin-top:16px")}>
                Say it slowly. Is it honest? And is it about you — not about them, not about luck?
              </div>
              <div style={sx("flex:1")} />
              <div onClick={v.feelsTrue} style={sx("height:56px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16.5px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>This feels true</div>
              <div onClick={v.regen} style={sx("margin-top:11px;height:48px;border-radius:99px;border:1px solid #A5A1C2;color:#ECEAF7;display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer")} className={pseudo('hover', "background:rgba(236,234,247,.05)")}>Suggest another</div>
            </div>
          )}
          {/* 10 · COMING BACK */}
          {v.st6 && (
            <div data-screen-label="10 Session - Coming back" style={sx("position:absolute;inset:0;display:flex;flex-direction:column;animation:cvFade .6s ease both")}>
              <div style={sx("height:46%;position:relative")}>
                <div style={sx("position:absolute;left:50%;top:52%;width:250px;height:370px;transform:translate(-50%,-50%) rotate(1.4deg);border:1px solid rgba(236,234,247,.24);border-radius:5px;animation:cvFrameOut 1.4s ease .3s both")} />
                <div style={sx("position:absolute;left:50%;top:52%;width:190px;height:280px;transform:translate(-50%,-50%) rotate(-1.8deg);border:1px solid rgba(236,234,247,.32);border-radius:4px;animation:cvFrameOut 1.4s ease .9s both")} />
                <div style={sx("position:absolute;left:50%;top:52%;width:130px;height:190px;transform:translate(-50%,-50%);border:1px solid rgba(236,234,247,.4);border-radius:3px;animation:cvFrameOut 1.4s ease 1.5s both")} />
                <div style={sx("position:absolute;left:0;right:0;bottom:-30px;height:150px;background:radial-gradient(ellipse at 50% 100%,rgba(232,161,136,.22) 0%,transparent 65%);animation:cvFade 2.4s ease 1.4s both")} />
                <div style={sx("position:absolute;left:50%;bottom:16px;transform:translateX(-50%);animation:cvRise 2s ease 1.2s both")}>
                  <svg width="58" height="93" viewBox="0 0 60 96">
                    <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.55)" strokeWidth="1" />
                  </svg>
                </div>
                <div style={sx("position:absolute;left:34px;right:34px;top:96px;text-align:center;font-family:Lora,serif;font-size:19px;line-height:1.5;color:#ECEAF7;text-shadow:0 0 26px rgba(232,161,136,.5);animation:cvFade 2s ease 1.8s both")}>{v.belief}</div>
              </div>
              <div style={sx("padding:6px 28px 0;text-align:center;font-family:Lora,serif;font-style:italic;font-size:15.5px;line-height:1.55;color:#A5A1C2")}>
                Bring the new words back with you. Now — checking in: how strong is the feeling now?
              </div>
              <div style={sx("flex:1")} />
              <div style={sx("padding:0 28px 34px")}>
                <div style={sx("display:flex;justify-content:center;margin-bottom:8px")}>
                  <div style={sx("height:24px;padding:0 11px;border-radius:99px;border:1px solid #3A3752;display:flex;align-items:center;font-size:11.5px;color:#6B678C")}>{v.wasLabel}</div>
                </div>
                <div onPointerDown={v.afterDown} style={sx("position:relative;height:44px;cursor:pointer;touch-action:none")}>
                  <div style={sx("position:absolute;left:0;right:0;top:19px;height:6px;border-radius:99px;background:linear-gradient(90deg,#8FBFAF 0%,#C9A38C 55%,#D9755A 100%)")} />
                  <div style={sx(v.afterThumb)}>{v.after}</div>
                </div>
                <div style={sx("display:flex;justify-content:space-between;font-size:12px;color:#6B678C;margin-top:2px")}>
                  <span>barely there</span>
                  <span>overwhelming</span>
                </div>
                <div onClick={v.complete} style={sx("margin-top:24px;height:56px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16.5px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>Complete session</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
