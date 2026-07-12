// GENERATED from design/CameraView Prototype.dc.html — section "3 · HOME".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Home() {
  const v = useApp()
  return (
    <>
      {v.sHome && (
        <div data-screen-label="03 Home" style={sx("position:absolute;inset:0;animation:cvFadeUp .45s ease both")}>
          <div style={sx("position:absolute;inset:0;overflow-y:auto;padding:74px 20px 130px;box-sizing:border-box")} className="cvs">
            <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
              <div style={sx("font-family:Lora,serif;font-size:21px")}>{v.greeting}</div>
              <div onClick={v.toSettings} style={sx("width:36px;height:36px;border-radius:50%;border:1px solid rgba(165,161,194,.5);display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#2C2950,#1E1C33);font-family:Lora,serif;font-size:15px;color:#A5A1C2;cursor:pointer")}>{v.avatarLetter}</div>
            </div>
            <div style={sx("font-size:14px;color:#A5A1C2;margin-top:5px")}>How are you arriving today?</div>
            <div style={sx("position:relative;margin-top:18px;height:308px;border-radius:24px;overflow:hidden;background:linear-gradient(180deg,#232045 0%,#2A2550 55%,#4A3550 82%,#7A5350 100%)")}>
              <div style={sx("position:absolute;left:-30%;right:-30%;bottom:-46%;height:80%;background:radial-gradient(ellipse at 50% 100%,rgba(232,161,136,.5) 0%,transparent 62%);animation:cvGlow 7s ease-in-out infinite")} />
              <div style={sx("position:absolute;left:50%;bottom:-70px;width:230px;height:230px;transform:translateX(-50%);border:1px solid rgba(236,234,247,.16);border-radius:50%")} />
              <div style={sx("position:absolute;left:50%;bottom:-110px;width:330px;height:330px;transform:translateX(-50%);border:1px solid rgba(236,234,247,.1);border-radius:50%")} />
              <div style={sx("position:absolute;left:50%;bottom:-150px;width:430px;height:430px;transform:translateX(-50%);border:1px solid rgba(236,234,247,.06);border-radius:50%")} />
              <div style={sx("position:relative;padding:22px 22px 0;font-size:12px;letter-spacing:.14em;color:rgba(236,234,247,.65)")}>TODAY'S SESSION</div>
              <div style={sx("position:relative;padding:46px 26px 0;font-family:Lora,serif;font-size:27px;line-height:1.25;text-align:center")}>
                Step outside
                <br />
                the moment
              </div>
              <div style={sx("position:absolute;left:22px;right:22px;bottom:20px;display:flex;align-items:center;gap:10px")}>
                <div onClick={v.beginSession} style={sx("flex:1;height:54px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>Begin session</div>
                <div style={sx("height:38px;padding:0 15px;border-radius:99px;border:1px solid rgba(236,234,247,.35);display:flex;align-items:center;font-size:12.5px;color:rgba(236,234,247,.8)")}>10–15 min</div>
              </div>
            </div>
            <div style={sx("display:flex;gap:12px;margin-top:12px")}>
              <div style={sx("flex:1;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:16px 18px")}>
                <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
                  <div style={sx("font-size:12px;color:#A5A1C2")}>Streak</div>
                  <svg width="18" height="18" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="7" fill="none" stroke="#E8A188" strokeWidth="1.1" opacity=".8" />
                    <path d="M10 1.5v3M18.5 10h-3M10 18.5v-3M1.5 10h3" stroke="#E8A188" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={sx("font-family:Lora,serif;font-size:30px;margin-top:6px")}>{v.streakNum}</div>
                <div style={sx("font-size:11.5px;color:#6B678C;margin-top:2px")}>{v.streakUnit}</div>
              </div>
              <div style={sx("flex:1;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:16px 18px")}>
                <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
                  <div style={sx("font-size:12px;color:#A5A1C2")}>Calm shift</div>
                  <svg width="18" height="12" viewBox="0 0 20 12">
                    <path d="M1 4c2.5 0 2.5 4 5 4s2.5-5 5-5 2.5 6 5 6 2-3 3-3" fill="none" stroke="#8FBFAF" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={sx("font-family:Lora,serif;font-size:30px;margin-top:6px")}>{v.calmNum}</div>
                <div style={sx("font-size:11.5px;color:#6B678C;margin-top:2px")}>avg. intensity drop</div>
              </div>
            </div>
            {v.hasBeliefCards && (
              <>
                <div style={sx("display:flex;align-items:baseline;justify-content:space-between;margin-top:26px")}>
                  <div style={sx("font-family:Lora,serif;font-size:18px")}>Your new beliefs</div>
                  <div onClick={v.seeAll} style={sx("font-size:13px;color:#E8A188;cursor:pointer")}>See all</div>
                </div>
                <div style={sx("display:flex;gap:12px;overflow-x:auto;margin:12px -20px 0;padding:0 20px 6px")} className="cvs">
                  {v.beliefCards.map((b: any, i: number) => (
                    <div key={i} style={sx("flex:none;width:270px;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:18px 20px;box-sizing:border-box")}>
                      <div style={sx("font-size:12.5px;color:#6B678C;text-decoration:line-through")}>{b.old}</div>
                      <svg width="11" height="12" viewBox="0 0 11 12" style={sx("margin:7px 0 5px")}>
                        <path d="M5.5 1v9M2 7l3.5 3.5L9 7" fill="none" stroke="#8FBFAF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div style={sx("font-family:Lora,serif;font-size:16.5px;line-height:1.4;color:#ECEAF7")}>{b.neu}</div>
                      <div style={sx("font-size:11.5px;color:#6B678C;margin-top:10px")}>{b.meta}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
