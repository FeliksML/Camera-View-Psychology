// GENERATED from design/CameraView Prototype.dc.html — section "1 · ONBOARDING".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Onboarding() {
  const v = useApp()
  return (
    <>
      {v.sOnb && (
        <div data-screen-label="01 Onboarding" style={sx("position:absolute;inset:0;display:flex;flex-direction:column;animation:cvFadeUp .45s ease both")}>
          <div style={sx("height:55%;position:relative;overflow:hidden")}>
            {v.onb0 && (
              <div style={sx("position:absolute;inset:0;animation:cvFade .6s ease both")}>
                <div style={sx("position:absolute;left:-20%;right:-20%;bottom:18%;height:34%;background:linear-gradient(180deg,#232040,#1B1930);border-radius:50% 50% 0 0;opacity:.9")} />
                <div style={sx("position:absolute;left:-30%;right:10%;bottom:8%;height:30%;background:linear-gradient(180deg,#2A2748,#201D38);border-radius:50% 50% 0 0;opacity:.8")} />
                <div style={sx("position:absolute;left:8%;right:-30%;bottom:0;height:26%;background:linear-gradient(180deg,#302C52,#252242);border-radius:50% 50% 0 0")} />
                <div style={sx("position:absolute;left:50%;bottom:16%;width:170px;height:170px;transform:translateX(-50%)")}>
                  <div style={sx("position:absolute;inset:0;border:1px solid rgba(236,234,247,.4);border-radius:50%;animation:cvRing 5s ease-out infinite")} />
                  <div style={sx("position:absolute;inset:0;border:1px solid rgba(236,234,247,.35);border-radius:50%;animation:cvRing 5s ease-out 1.6s infinite")} />
                  <div style={sx("position:absolute;inset:0;border:1px solid rgba(236,234,247,.3);border-radius:50%;animation:cvRing 5s ease-out 3.2s infinite")} />
                </div>
                <div style={sx("position:absolute;left:50%;bottom:14%;transform:translateX(-50%)")}>
                  <svg width="44" height="70" viewBox="0 0 60 96">
                    <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.45)" strokeWidth="1" />
                  </svg>
                </div>
                <div style={sx("position:absolute;left:18%;top:16%;width:10px;height:10px;border-radius:50%;background:rgba(232,161,136,.35);filter:blur(2px);animation:cvDrift 9s ease-in-out infinite")} />
                <div style={sx("position:absolute;left:70%;top:10%;width:16px;height:16px;border-radius:50%;background:rgba(236,234,247,.14);filter:blur(4px);animation:cvDrift 12s ease-in-out 1s infinite")} />
                <div style={sx("position:absolute;left:44%;top:24%;width:7px;height:7px;border-radius:50%;background:rgba(143,191,175,.3);filter:blur(2px);animation:cvDrift 10s ease-in-out 2s infinite")} />
              </div>
            )}
            {v.onb1 && (
              <div style={sx("position:absolute;inset:0;animation:cvFade .6s ease both")}>
                <div style={sx("position:absolute;left:50%;top:52%;width:200px;height:200px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(236,234,247,.1) 0%,transparent 65%);border-radius:50%")} />
                <div style={sx("position:absolute;left:50%;top:52%;width:130px;height:130px;transform:translate(-50%,-50%);border:1px solid rgba(236,234,247,.28);border-radius:50%")} />
                <div style={sx("position:absolute;left:50%;top:44%;transform:translateX(-50%)")}>
                  <svg width="30" height="48" viewBox="0 0 60 96">
                    <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.5)" strokeWidth="1.4" />
                  </svg>
                </div>
                <div style={sx("position:absolute;left:6%;bottom:-14%;opacity:.92")}>
                  <svg width="150" height="240" viewBox="0 0 60 96">
                    <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#100E1B" stroke="rgba(236,234,247,.3)" strokeWidth=".7" />
                  </svg>
                </div>
                <div style={sx("position:absolute;left:66%;top:14%;width:12px;height:12px;border-radius:50%;background:rgba(232,161,136,.3);filter:blur(3px);animation:cvDrift 11s ease-in-out infinite")} />
              </div>
            )}
            {v.onb2 && (
              <div style={sx("position:absolute;inset:0;animation:cvFade .6s ease both")}>
                <div style={sx("position:absolute;left:50%;top:24%;transform:translateX(-50%);width:120px;height:80px")}>
                  <svg width="120" height="80" viewBox="0 0 120 80">
                    <path d="M18 46 C10 34 22 20 36 26 C40 12 62 10 68 22 C82 12 100 24 92 38 C102 44 96 58 84 56 C80 66 60 68 54 58 C42 68 24 60 28 50 Z" fill="none" stroke="rgba(165,161,194,.5)" strokeWidth="1" strokeDasharray="3 4" opacity=".8" />
                    <circle cx="60" cy="62" r="13" fill="rgba(232,161,136,.22)" />
                    <circle cx="60" cy="62" r="7" fill="rgba(232,161,136,.55)" style={sx("filter:blur(1px)")} />
                  </svg>
                </div>
                <div style={sx("position:absolute;left:50%;top:30%;width:150px;height:150px;transform:translateX(-50%);background:radial-gradient(circle,rgba(232,161,136,.12) 0%,transparent 60%)")} />
                <div style={sx("position:absolute;left:50%;bottom:12%;transform:translateX(-50%)")}>
                  <svg width="52" height="84" viewBox="0 0 60 96">
                    <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.5)" strokeWidth="1" />
                  </svg>
                </div>
                <div style={sx("position:absolute;left:50%;bottom:10%;width:120px;height:26px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(143,191,175,.18) 0%,transparent 70%)")} />
              </div>
            )}
            <div style={sx("position:absolute;inset:0;box-shadow:inset 0 0 90px 30px rgba(13,12,22,.55);pointer-events:none")} />
          </div>
          <div style={sx("flex:1;display:flex;flex-direction:column;padding:26px 28px 30px;box-sizing:border-box")}>
            <div style={sx("font-family:Lora,serif;font-size:32px;line-height:1.15;font-weight:500")}>{v.onbTitle}</div>
            <div style={sx("font-size:16px;line-height:1.55;color:#A5A1C2;margin-top:12px;text-wrap:pretty")}>{v.onbBody}</div>
            <div style={sx("flex:1")} />
            <div style={sx("display:flex;justify-content:center;gap:8px;align-items:center;margin-bottom:20px")}>
              <div style={sx(v.dot0)} />
              <div style={sx(v.dot1)} />
              <div style={sx(v.dot2)} />
            </div>
            <div onClick={v.onbNext} style={sx("height:56px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16.5px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>{v.onbBtn}</div>
            <div onClick={v.toSignin} style={sx("text-align:center;margin-top:14px;font-size:14px;color:#A5A1C2;cursor:pointer")} className={pseudo('hover', "color:#ECEAF7")}>Skip</div>
          </div>
        </div>
      )}
    </>
  )
}
