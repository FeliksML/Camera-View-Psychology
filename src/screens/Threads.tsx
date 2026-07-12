// GENERATED from design/CameraView Prototype.dc.html — section "17 · CONNECTIONS".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Threads() {
  const v = useApp()
  return (
    <>
      {v.sThreads && (
        <div data-screen-label="17 Connections" style={sx("position:absolute;inset:0;animation:cvFadeUp .45s ease both")}>
          <div style={sx("position:absolute;inset:0;overflow-y:auto;padding:66px 20px 60px;box-sizing:border-box")} className="cvs">
            <div style={sx("display:flex;align-items:center;gap:10px")}>
              <div onClick={v.thBack} style={sx("width:32px;height:32px;border-radius:50%;border:1px solid #3A3752;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none")} className={pseudo('hover', "border-color:#A5A1C2")}>
                <svg width="8" height="14" viewBox="0 0 8 14">
                  <path d="M7 1 1 7l6 6" fill="none" stroke="#A5A1C2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={sx("font-family:Lora,serif;font-size:26px")}>Connections</div>
            </div>
            <div style={sx("font-size:13px;color:#6B678C;margin-top:6px")}>{v.thCountLine}</div>
            {v.thEmpty && (
              <div style={sx("margin-top:80px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 24px;animation:cvFade .5s ease both")}>
                <div style={sx("position:relative;width:120px;height:120px")}>
                  <div style={sx("position:absolute;inset:0;border:1px dashed rgba(58,55,82,.9);border-radius:50%;animation:cvGlow 4s ease-in-out infinite")} />
                  <div style={sx("position:absolute;left:50%;top:50%;width:8px;height:8px;border-radius:50%;background:#E8A188;transform:translate(-50%,-50%);box-shadow:0 0 12px rgba(232,161,136,.6)")} />
                  <div style={sx("position:absolute;left:22%;top:30%;width:5px;height:5px;border-radius:50%;background:#8E9BB8;opacity:.7")} />
                  <div style={sx("position:absolute;left:70%;top:62%;width:5px;height:5px;border-radius:50%;background:#D9A96B;opacity:.7")} />
                </div>
                <div style={sx("font-family:Lora,serif;font-size:19px;margin-top:20px")}>The threads take a few sessions</div>
                <div style={sx("font-size:13.5px;line-height:1.55;color:#A5A1C2;margin-top:8px;max-width:280px")}>{v.thEmptyText}</div>
                <div onClick={v.beginSession} style={sx("margin-top:18px;height:44px;border-radius:99px;border:1px solid rgba(232,161,136,.55);display:inline-flex;align-items:center;padding:0 22px;font-size:13.5px;color:#E8A188;cursor:pointer")} className={pseudo('hover', "background:rgba(232,161,136,.1)")}>Begin a session</div>
              </div>
            )}
            {v.thHasRoots && (
              <>
                <div style={sx("position:relative;height:330px;margin-top:14px;animation:cvFade .5s ease both")}>
                  <svg width="362" height="330" viewBox="0 0 362 330" style={sx("position:absolute;left:0;top:0;overflow:visible")}>
                    <path d={v.thaLines1} fill="none" stroke={v.thaStroke1} strokeWidth="1.1" style={sx(v.thaDraw1)} />
                    <path d={v.thaLines2} fill="none" stroke={v.thaStroke2} strokeWidth="1.1" style={sx(v.thaDraw2)} />
                  </svg>
                  {v.thaDots.map((dt: any, i: number) => (
                    <div key={i}>
                      <div onClick={dt.tap} style={sx(dt.style)} />
                      {dt.has && (
                        <div style={sx(dt.labStyle)}>{dt.label}</div>
                      )}
                    </div>
                  ))}
                  <div onClick={v.selRoot1} style={sx(v.thaRoot1)} />
                  <div style={sx(v.thaCore1)} />
                  <div style={sx(v.thaRoot1Lab)}>{v.thAge1}</div>
                  {v.thHasRoot2 && (
                    <>
                      <div onClick={v.selRoot2} style={sx(v.thaRoot2)} />
                      <div style={sx(v.thaCore2)} />
                      <div style={sx(v.thaRoot2Lab)}>{v.thAge2}</div>
                    </>
                  )}
                  {v.thHasLoners && (
                    <div style={sx(v.thaLoneLab)}>no thread yet</div>
                  )}
                </div>
                <div style={sx("font-size:11px;line-height:1.5;color:#6B678C;margin-top:2px")}>
                  Each dot is a session, colored by its emotion; size — how deep it went. Sessions gather around the belief they share. Tap a root — or a session — to follow its thread.
                </div>
                <div onClick={v.selRoot1} style={sx(v.rootCard1)}>
                  <div style={sx("display:flex;align-items:center;gap:8px")}>
                    <div style={sx("width:8px;height:8px;border-radius:50%;background:#E8A188;box-shadow:0 0 8px rgba(232,161,136,.6);flex:none")} />
                    <div style={sx("font-size:10px;letter-spacing:.13em;color:#6B678C")}>{v.thPair1}</div>
                  </div>
                  <div style={sx("font-family:Lora,serif;font-size:16.5px;line-height:1.5;color:#ECEAF7;margin-top:8px")}>{v.thBelief1}</div>
                  <div style={sx("font-size:12.5px;line-height:1.55;color:#A5A1C2;margin-top:6px")}>{v.thNarr1}</div>
                  <div style={sx("display:flex;flex-wrap:wrap;gap:6px;margin-top:11px")}>
                    {v.thMems1.map((mc: any, i: number) => (
                      <div key={i} style={sx(mc.style)}>
                        <div style={sx(mc.dot)} />
                        {mc.t}
                      </div>
                    ))}
                  </div>
                  <div onClick={v.rootSession1} style={sx("margin-top:12px;height:36px;border-radius:99px;border:1px solid rgba(232,161,136,.55);display:inline-flex;align-items:center;padding:0 16px;font-size:12.5px;color:#E8A188;cursor:pointer")} className={pseudo('hover', "background:rgba(232,161,136,.1)")}>Work the root itself →</div>
                </div>
                {v.thHasRoot2 && (
                  <div onClick={v.selRoot2} style={sx(v.rootCard2)}>
                    <div style={sx("display:flex;align-items:center;gap:8px")}>
                      <div style={sx("width:8px;height:8px;border-radius:50%;background:#D9A96B;box-shadow:0 0 8px rgba(217,169,107,.6);flex:none")} />
                      <div style={sx("font-size:10px;letter-spacing:.13em;color:#6B678C")}>{v.thPair2}</div>
                    </div>
                    <div style={sx("font-family:Lora,serif;font-size:16.5px;line-height:1.5;color:#ECEAF7;margin-top:8px")}>{v.thBelief2}</div>
                    <div style={sx("font-size:12.5px;line-height:1.55;color:#A5A1C2;margin-top:6px")}>{v.thNarr2}</div>
                    <div style={sx("display:flex;flex-wrap:wrap;gap:6px;margin-top:11px")}>
                      {v.thMems2.map((mc: any, i: number) => (
                        <div key={i} style={sx(mc.style)}>
                          <div style={sx(mc.dot)} />
                          {mc.t}
                        </div>
                      ))}
                    </div>
                    <div onClick={v.rootSession2} style={sx("margin-top:12px;height:36px;border-radius:99px;border:1px solid rgba(217,169,107,.55);display:inline-flex;align-items:center;padding:0 16px;font-size:12.5px;color:#D9A96B;cursor:pointer")} className={pseudo('hover', "background:rgba(217,169,107,.1)")}>Work the root itself →</div>
                  </div>
                )}
                <div style={sx("display:flex;align-items:center;gap:7px;margin-top:14px;font-size:11.5px;color:#6B678C")}>
                  <svg width="11" height="13" viewBox="0 0 13 15">
                    <rect x="1" y="6" width="11" height="8" rx="2" fill="none" stroke="#6B678C" strokeWidth="1.2" />
                    <path d="M3.5 6V4.5a3 3 0 0 1 6 0V6" fill="none" stroke="#6B678C" strokeWidth="1.2" />
                  </svg>
                  {" Linked privately from your own sessions. "}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
