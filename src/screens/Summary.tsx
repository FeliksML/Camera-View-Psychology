// GENERATED from design/CameraView Prototype.dc.html — section "11 · SUMMARY".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Summary() {
  const v = useApp()
  return (
    <>
      {v.sSummary && (
        <div data-screen-label="11 Session complete" style={sx("position:absolute;inset:0;animation:cvFadeUp .45s ease both")}>
          <div style={sx("position:absolute;inset:0;overflow-y:auto;padding:80px 24px 44px;box-sizing:border-box;display:flex;flex-direction:column")} className="cvs">
            <div style={sx("display:flex;flex-direction:column;align-items:center")}>
              <div style={sx("position:relative;width:130px;height:130px;display:flex;align-items:center;justify-content:center")}>
                <div style={sx("position:absolute;inset:0;border:1px solid rgba(232,161,136,.25);border-radius:50%;animation:cvRing 6s ease-out infinite")} />
                <div style={sx("position:absolute;inset:0;border:1px solid rgba(232,161,136,.18);border-radius:50%;animation:cvRing 6s ease-out 2s infinite")} />
                <div style={sx("position:absolute;inset:10px;border:1.4px solid #E8A188;border-radius:50%;box-shadow:0 0 26px rgba(232,161,136,.25)")} />
                <div style={sx("position:absolute;inset:22px;border-radius:50%;background:radial-gradient(circle,rgba(143,191,175,.28) 0%,rgba(143,191,175,.05) 70%)")} />
                <svg width="34" height="55" viewBox="0 0 60 96" style={sx("position:relative")}>
                  <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.55)" strokeWidth="1.2" />
                </svg>
              </div>
              <div style={sx("font-family:Lora,serif;font-size:28px;margin-top:16px")}>You stepped back.</div>
              <div style={sx("font-size:14px;color:#A5A1C2;margin-top:6px")}>{v.sumMeta}</div>
            </div>
            <div style={sx("margin-top:26px;background:rgba(38,36,64,.8);border-radius:24px;box-shadow:inset 0 0 24px rgba(236,234,247,.03)")}>
              <div style={sx("padding:18px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(58,55,82,.6)")}>
                <div>
                  <div style={sx("font-size:12.5px;color:#A5A1C2")}>Intensity</div>
                  <div style={sx("position:relative;width:130px;height:6px;border-radius:99px;background:#3A3752;margin-top:10px;overflow:hidden")}>
                    <div style={sx(v.barBefore)} />
                    <div style={sx(v.barAfter)} />
                  </div>
                </div>
                <div style={sx("font-family:Lora,serif;font-size:24px")}>{v.shiftText}</div>
              </div>
              <div style={sx("padding:16px 20px;border-bottom:1px solid rgba(58,55,82,.6)")}>
                <div style={sx("font-size:12.5px;color:#A5A1C2")}>Old belief</div>
                <div style={sx("font-size:13.5px;color:#6B678C;text-decoration:line-through;margin-top:6px")}>{v.oldBeliefText}</div>
              </div>
              <div style={sx("padding:16px 20px;display:flex;gap:12px;align-items:flex-start")}>
                <div style={sx("flex:1")}>
                  <div style={sx("font-size:12.5px;color:#A5A1C2")}>New belief</div>
                  <div style={sx("font-family:Lora,serif;font-size:18px;line-height:1.45;color:#ECEAF7;margin-top:6px")}>{v.belief}</div>
                </div>
                <svg width="13" height="17" viewBox="0 0 13 17" style={sx("margin-top:22px;flex:none")}>
                  <path d="M1.5 1.5h10v14L6.5 12l-5 3.5v-14z" fill="none" stroke="#E8A188" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div style={sx("margin-top:16px;background:rgba(38,36,64,.8);border-radius:24px;padding:18px 20px;box-shadow:inset 0 0 24px rgba(236,234,247,.03)")}>
              <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
                <div style={sx("font-size:12.5px;color:#A5A1C2")}>The path this session took</div>
                <svg width="15" height="11" viewBox="0 0 15 11">
                  <path d="M1 3.5 C3.5 3.5 3.5 8.5 6 8.5 S8.5 2 11 2 14 6 14 6" fill="none" stroke="#6B678C" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div style={sx("position:relative;height:150px;margin-top:10px")}>
                {v.sumRows.map((rw: any, i: number) => (
                  <div key={i}>
                    <div style={sx(rw.line)} />
                    <div style={sx(rw.lab)}>{rw.label}</div>
                  </div>
                ))}
                <svg width="314" height="150" viewBox="0 0 314 150" style={sx("position:absolute;left:0;top:0;overflow:visible")}>
                  <defs>
                    <linearGradient id="cvGradB" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#E26454" />
                      <stop offset=".55" stopColor="#E8A188" />
                      <stop offset="1" stopColor="#8FBFAF" />
                    </linearGradient>
                  </defs>
                  <path d={v.sumMapPath} fill="none" stroke="url(#cvGradB)" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {v.sumDots.map((dt: any, i: number) => (
                  <div key={i}>
                    <div style={sx(dt.style)} />
                    {dt.has && (
                      <div style={sx(dt.labStyle)}>{dt.label}</div>
                    )}
                  </div>
                ))}
                {v.sumBranches.map((br: any, i: number) => (
                  <div key={i}>
                    <div style={sx(br.stub)} />
                    <div style={sx(br.dot)} />
                    <div style={sx(br.lab)}>{br.t}</div>
                  </div>
                ))}
              </div>
              <div style={sx("display:flex;gap:14px;align-items:center;margin-top:2px;font-size:10px;color:#6B678C")}>
                <div style={sx("display:flex;align-items:center;gap:5px")}>
                  <div style={sx("width:7px;height:7px;border-radius:50%;border:1px solid #ECEAF7;box-sizing:border-box")} />
                  you asked
                </div>
                <div style={sx("display:flex;align-items:center;gap:5px")}>
                  <div style={sx("width:7px;height:7px;border-radius:50%;background:#C9A38C")} />
                  what surfaced
                </div>
                <div style={sx("display:flex;align-items:center;gap:5px")}>
                  <div style={sx("width:7px;height:7px;border-radius:50%;background:#8FBFAF;box-shadow:0 0 6px rgba(143,191,175,.6)")} />
                  the shift
                </div>
              </div>
              <div style={sx("position:relative;border-top:1px solid rgba(58,55,82,.6);margin-top:16px;padding-top:16px")}>
                <div style={sx("position:absolute;left:4px;top:22px;bottom:26px;width:1px;background:rgba(58,55,82,.9)")} />
                {v.beats.map((b: any, i: number) => (
                  <div key={i} style={sx("display:flex;gap:12px;padding-bottom:14px")}>
                    <div style={sx(b.dot)} />
                    <div style={sx("flex:1;min-width:0")}>
                      <div style={sx("font-size:9.5px;letter-spacing:.13em;color:#6B678C")}>{b.k}</div>
                      <div style={sx("font-size:13px;line-height:1.45;color:#D9D6EA;margin-top:3px;text-wrap:pretty")}>{b.t}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={sx("margin-top:16px;display:flex;align-items:center;justify-content:space-between;padding:0 4px")}>
              <div style={sx("font-size:14px;color:#A5A1C2")}>Revisit this belief tomorrow?</div>
              <div onClick={v.toggleRemind} style={sx(v.remindChip)} className={pseudo('hover', "border-color:#A5A1C2")}>
                <svg width="12" height="14" viewBox="0 0 12 14">
                  <path d="M6 1.2a4 4 0 0 1 4 4V8l1.2 2.2H.8L2 8V5.2a4 4 0 0 1 4-4zM4.7 12a1.4 1.4 0 0 0 2.6 0" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                </svg>
                {" Remind me "}
              </div>
            </div>
            <div style={sx("flex:1;min-height:24px")} />
            <div onClick={v.save} style={sx("height:56px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16.5px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>Save to journal</div>
            <div style={sx("display:flex;align-items:center;justify-content:center;gap:7px;margin-top:14px;font-size:12.5px;color:#6B678C")}>
              <svg width="11" height="13" viewBox="0 0 13 15">
                <rect x="1" y="6" width="11" height="8" rx="2" fill="none" stroke="#6B678C" strokeWidth="1.2" />
                <path d="M3.5 6V4.5a3 3 0 0 1 6 0V6" fill="none" stroke="#6B678C" strokeWidth="1.2" />
              </svg>
              {" Share nothing — this stays private "}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
