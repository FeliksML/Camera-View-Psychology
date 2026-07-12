// GENERATED from design/CameraView Prototype.dc.html — section "4 · SETUP".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Setup() {
  const v = useApp()
  return (
    <>
      {v.sSetup && (
        <div data-screen-label="04 Session setup" style={sx("position:absolute;inset:0;animation:cvFadeUp .45s ease both")}>
          <div style={sx("position:absolute;inset:0;overflow-y:auto;padding:66px 24px 40px;box-sizing:border-box;display:flex;flex-direction:column")} className="cvs">
            <div style={sx("display:flex;align-items:center;justify-content:space-between;height:36px")}>
              <div onClick={v.backHome} style={sx("width:32px;height:32px;margin-left:-8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#A5A1C2")} className={pseudo('hover', "color:#ECEAF7")}>
                <svg width="9" height="16" viewBox="0 0 9 16">
                  <path d="M8 1 1 8l7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={sx("font-size:12px;color:#6B678C;letter-spacing:.06em")}>1 of 2</div>
            </div>
            <div style={sx("font-family:Lora,serif;font-size:24px;margin-top:8px")}>What happened?</div>
            <div style={sx("font-size:13.5px;color:#A5A1C2;margin-top:4px")}>One sentence is enough.</div>
            <div style={sx("position:relative;margin-top:12px")}>
              <textarea value={v.situation} onChange={v.onSituation} placeholder="e.g. My boss criticized me in front of the team" style={sx("width:100%;min-height:96px;box-sizing:border-box;background:rgba(38,36,64,.8);border:1px solid #3A3752;border-radius:18px;padding:14px 40px 14px 16px;color:#ECEAF7;font-family:Inter,sans-serif;font-size:16px;line-height:1.5;resize:none;outline:none")} className={pseudo('focus', "border-color:rgba(232,161,136,.6)")} />
              <svg width="15" height="20" viewBox="0 0 15 20" style={sx("position:absolute;right:14px;bottom:14px;opacity:.6")}>
                <rect x="4.5" y="1" width="6" height="11" rx="3" fill="none" stroke="#A5A1C2" strokeWidth="1.2" />
                <path d="M1.5 9.5a6 6 0 0 0 12 0M7.5 15.5V19" fill="none" stroke="#A5A1C2" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={sx("font-size:12px;color:#6B678C;margin-top:8px")}>
              It can be a memory — or something ahead: a talk, a date, a hard meeting.
            </div>
            <div style={sx("font-family:Lora,serif;font-size:24px;margin-top:28px")}>What are you feeling?</div>
            <div style={sx("display:flex;flex-wrap:wrap;gap:9px;margin-top:14px")}>
              {v.emotions.map((e: any, i: number) => (
                <div key={i} onClick={e.pick} style={sx(e.style)} className={pseudo('hover', "border-color:#A5A1C2")}>{e.name}</div>
              ))}
            </div>
            <div style={sx("font-family:Lora,serif;font-size:24px;margin-top:30px")}>How strong is it right now?</div>
            <div onPointerDown={v.intDown} style={sx("position:relative;height:44px;margin-top:16px;cursor:pointer;touch-action:none")}>
              <div style={sx("position:absolute;left:0;right:0;top:19px;height:6px;border-radius:99px;background:linear-gradient(90deg,#8FBFAF 0%,#C9A38C 55%,#D9755A 100%)")} />
              <div style={sx(v.intThumb)}>{v.intensity}</div>
            </div>
            <div style={sx("display:flex;justify-content:space-between;font-size:12px;color:#6B678C;margin-top:2px")}>
              <span>barely there</span>
              <span>overwhelming</span>
            </div>
            <div style={sx("flex:1;min-height:26px")} />
            <div onClick={v.startSession} style={sx("height:56px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16.5px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>Start the session</div>
            <div style={sx("display:flex;align-items:center;justify-content:center;gap:7px;font-size:12px;color:#6B678C;margin-top:12px")}>
              <svg width="12" height="14" viewBox="0 0 12 14">
                <path d="M6 1 1 3v4c0 3.2 2.1 5.3 5 6 2.9-.7 5-2.8 5-6V3L6 1z" fill="none" stroke="#6B678C" strokeWidth="1.1" strokeLinejoin="round" />
              </svg>
              {" You can stop at any moment. Nothing is shared. "}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
