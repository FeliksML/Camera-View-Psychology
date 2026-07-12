// GENERATED from design/CameraView Prototype.dc.html — section "16 · CRISIS".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Crisis() {
  const v = useApp()
  return (
    <>
      {v.sCrisis && (
        <div data-screen-label="16 Crisis support" style={sx("position:absolute;inset:0;display:flex;flex-direction:column;padding:0 26px;box-sizing:border-box;background:linear-gradient(180deg,#141021 0%,#1A1428 52%,#33231E 84%,#4E3423 100%);animation:cvFade .6s ease both")}>
          <div style={sx("position:absolute;left:0;right:0;bottom:0;height:220px;background:radial-gradient(ellipse at 50% 100%,rgba(232,170,120,.28) 0%,transparent 70%)")} />
          <div style={sx("flex:.9")} />
          <div style={sx("position:relative;display:flex;flex-direction:column;align-items:center")}>
            <div style={sx("position:relative;width:86px;height:56px")}>
              <div style={sx("position:absolute;left:0;top:0;width:56px;height:56px;border:1px solid rgba(240,214,180,.65);border-radius:50%")} />
              <div style={sx("position:absolute;right:0;top:0;width:56px;height:56px;border:1px solid rgba(240,214,180,.65);border-radius:50%")} />
            </div>
            <div style={sx("font-family:Lora,serif;font-size:26px;margin-top:22px;text-align:center")}>Let's pause the session.</div>
            <div style={sx("font-size:16px;line-height:1.55;color:#C9BFC2;text-align:center;margin-top:12px;max-width:300px;text-wrap:pretty")}>
              What you're feeling sounds heavy. You deserve real support right now — a person, not an app.
            </div>
          </div>
          <div style={sx("flex:.7")} />
          <div style={sx("position:relative;display:flex;flex-direction:column;gap:11px")}>
            <div onClick={v.call988} style={sx("height:60px;border-radius:99px;background:#E8A188;color:#241812;display:flex;align-items:center;justify-content:center;gap:10px;font-size:15.5px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>
              <svg width="15" height="15" viewBox="0 0 16 16">
                <path d="M3.6 1.5c.5-.5 1.3-.4 1.7.1l1.5 2c.3.5.3 1.1-.1 1.5l-.9.9c.6 1.3 1.7 2.4 3 3l.9-.9c.4-.4 1-.4 1.5-.1l2 1.5c.6.4.6 1.2.1 1.7l-1 1c-.5.5-1.2.7-1.9.5C7 11.6 4.4 9 3.1 5.4c-.2-.7 0-1.4.5-1.9l0 0z" fill="#241812" />
              </svg>
              {" Call 988 — Suicide & Crisis Lifeline "}
            </div>
            <div onClick={v.text741} style={sx("height:56px;border-radius:99px;border:1px solid rgba(240,214,180,.55);color:#F0DCC6;display:flex;align-items:center;justify-content:center;gap:10px;font-size:15px;cursor:pointer")} className={pseudo('hover', "background:rgba(240,214,180,.07)")}>
              <svg width="16" height="15" viewBox="0 0 16 15">
                <path d="M8 1C4.1 1 1 3.6 1 6.8c0 1.8 1 3.4 2.5 4.5L3 14l3.2-1.6c.6.1 1.2.2 1.8.2 3.9 0 7-2.6 7-5.8S11.9 1 8 1z" fill="none" stroke="#F0DCC6" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              {" Text HOME to 741741 "}
            </div>
            <div onClick={v.findHelp} style={sx("height:56px;border-radius:99px;border:1px solid rgba(240,214,180,.55);color:#F0DCC6;display:flex;align-items:center;justify-content:center;gap:10px;font-size:15px;cursor:pointer")} className={pseudo('hover', "background:rgba(240,214,180,.07)")}>
              <svg width="15" height="15" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6.8" fill="none" stroke="#F0DCC6" strokeWidth="1.1" />
                <ellipse cx="8" cy="8" rx="3" ry="6.8" fill="none" stroke="#F0DCC6" strokeWidth="1.1" />
                <path d="M1.6 8h12.8M2.3 4.8h11.4M2.3 11.2h11.4" stroke="#F0DCC6" strokeWidth="1.1" />
              </svg>
              {" Find help outside the US "}
            </div>
          </div>
          <div style={sx("flex:.5")} />
          <div style={sx("position:relative;display:flex;flex-direction:column;align-items:center;padding-bottom:calc(36px + env(safe-area-inset-bottom, 0px))")}>
            <div onClick={v.breatheInstead} style={sx("display:flex;align-items:center;gap:9px;font-size:14.5px;color:#F0DCC6;cursor:pointer")} className={pseudo('hover', "color:#ECEAF7")}>
              <div style={sx("width:20px;height:20px;border-radius:50%;border:1px solid rgba(240,214,180,.7);display:flex;align-items:center;justify-content:center")}>
                <div style={sx("width:9px;height:9px;border-radius:50%;background:rgba(240,214,180,.4);animation:cvBreathe 4s ease-in-out infinite")} />
              </div>
              {" Breathe with me instead "}
            </div>
            <div onClick={v.endOkay} style={sx("margin-top:18px;font-size:13.5px;color:#A5A1C2;cursor:pointer;text-decoration:underline;text-underline-offset:3px")} className={pseudo('hover', "color:#ECEAF7")}>I'm okay — end the session</div>
            <div style={sx("font-size:11.5px;color:#6B678C;margin-top:12px")}>CameraView is a self-help tool, not medical care.</div>
          </div>
        </div>
      )}
    </>
  )
}
