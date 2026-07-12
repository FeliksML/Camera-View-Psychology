// GENERATED from design/CameraView Prototype.dc.html — section "15 · SETTINGS".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { useApp } from '../store/AppContext'

export function Settings() {
  const v = useApp()
  return (
    <>
      {v.sSettings && (
        <div data-screen-label="15 Settings" style={sx("position:absolute;inset:0;animation:cvFadeUp .45s ease both")}>
          <div style={sx("position:absolute;inset:0;overflow-y:auto;padding:74px 20px 130px;box-sizing:border-box")} className="cvs">
            <div style={sx("font-family:Lora,serif;font-size:30px")}>Settings</div>
            <div onClick={v.accountTap} style={sx("margin-top:16px;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer")}>
              <div style={sx("width:44px;height:44px;border-radius:50%;border:1px solid rgba(165,161,194,.5);display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#2C2950,#1E1C33);font-family:Lora,serif;font-size:18px;color:#A5A1C2")}>{v.avatarLetter}</div>
              <div style={sx("flex:1")}>
                <div style={sx("display:flex;align-items:center;gap:8px")}>
                  <div style={sx("font-size:15.5px;font-weight:500")}>{v.profileName}</div>
                  {v.plus && (
                    <div style={sx("height:18px;padding:0 8px;border-radius:99px;border:1px solid rgba(232,161,136,.6);display:flex;align-items:center;font-size:10px;letter-spacing:.08em;color:#E8A188")}>PLUS</div>
                  )}
                </div>
                <div style={sx("font-size:12.5px;color:#6B678C;margin-top:2px")}>{v.profileEmail}</div>
              </div>
              <svg width="7" height="12" viewBox="0 0 8 14">
                <path d="M1 1l6 6-6 6" fill="none" stroke="#6B678C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={sx("font-size:11px;letter-spacing:.14em;color:#6B678C;margin:22px 0 8px;padding-left:6px")}>SESSION</div>
            <div style={sx("border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03)")}>
              <div style={sx("display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5)")}>
                <div style={sx("font-size:14.5px")}>Guide voice</div>
                <div style={sx("font-size:13.5px;color:#A5A1C2")}>Warm · female ▾</div>
              </div>
              <div style={sx("display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5)")}>
                <div style={sx("font-size:14.5px;flex:none")}>Voice speed</div>
                <div onPointerDown={v.voiceDown} style={sx("position:relative;flex:1;max-width:130px;height:28px;cursor:pointer;touch-action:none")}>
                  <div style={sx("position:absolute;left:0;right:0;top:12.5px;height:3px;border-radius:99px;background:#3A3752")} />
                  <div style={sx(v.voiceThumb)} />
                </div>
              </div>
              <div style={sx("display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5)")}>
                <div style={sx("font-size:14.5px")}>Haptics during breathing</div>
                <div onClick={v.toggleHap} style={sx(v.hapTrack)}>
                  <div style={sx(v.hapKnob)} />
                </div>
              </div>
              <div style={sx("display:flex;align-items:center;justify-content:space-between;padding:14px 18px")}>
                <div style={sx("font-size:14.5px")}>Session reminders</div>
                <div style={sx("font-size:13.5px;color:#A5A1C2")}>Evenings · 9:00 PM</div>
              </div>
            </div>
            <div style={sx("font-size:11px;letter-spacing:.14em;color:#6B678C;margin:22px 0 8px;padding-left:6px")}>PRIVACY</div>
            <div style={sx("border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03)")}>
              <div style={sx("padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5)")}>
                <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
                  <div style={sx("font-size:14.5px")}>Store session transcripts</div>
                  <div onClick={v.toggleTr} style={sx(v.trTrack)}>
                    <div style={sx(v.trKnob)} />
                  </div>
                </div>
                <div style={sx("font-size:12px;color:#6B678C;margin-top:5px;max-width:250px")}>When off, conversations never leave this phone</div>
              </div>
              <div onClick={v.exportTap} style={sx("display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5);cursor:pointer")}>
                <div style={sx("font-size:14.5px")}>Export my data</div>
                <svg width="14" height="15" viewBox="0 0 14 15">
                  <path d="M7 1v8M3.5 6 7 9.5 10.5 6M1.5 12h11" fill="none" stroke="#A5A1C2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div onClick={v.deleteTap} style={sx("padding:14px 18px;font-size:14.5px;color:#C97E6B;cursor:pointer")}>{"Delete account & data"}</div>
            </div>
            <div style={sx("font-size:11px;letter-spacing:.14em;color:#6B678C;margin:22px 0 8px;padding-left:6px")}>ABOUT</div>
            <div style={sx("border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03)")}>
              <div onClick={v.methodTap} style={sx("display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5);cursor:pointer")}>
                <svg width="15" height="14" viewBox="0 0 16 15">
                  <path d="M8 2.5C6.5 1 4 .7 1.5 1.4v11.2C4 12 6.5 12.3 8 13.8c1.5-1.5 4-1.8 6.5-1.2V1.4C12 .7 9.5 1 8 2.5zM8 2.5v11.3" fill="none" stroke="#A5A1C2" strokeWidth="1.1" strokeLinejoin="round" />
                </svg>
                <div style={sx("flex:1;font-size:14.5px")}>The CameraView method</div>
                <svg width="7" height="12" viewBox="0 0 8 14">
                  <path d="M1 1l6 6-6 6" fill="none" stroke="#6B678C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div onClick={v.crisisTap} style={sx("display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5);cursor:pointer")}>
                <svg width="15" height="15" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6.6" fill="none" stroke="#A5A1C2" strokeWidth="1.1" />
                  <circle cx="8" cy="8" r="2.8" fill="none" stroke="#A5A1C2" strokeWidth="1.1" />
                  <path d="M8 1.4v3.8M8 10.8v3.8M1.4 8h3.8M10.8 8h3.8" stroke="#A5A1C2" strokeWidth="1.1" />
                </svg>
                <div style={sx("flex:1;font-size:14.5px")}>Crisis resources</div>
                <svg width="7" height="12" viewBox="0 0 8 14">
                  <path d="M1 1l6 6-6 6" fill="none" stroke="#6B678C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={sx("padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5);font-size:14.5px;cursor:pointer")}>Terms</div>
              <div style={sx("padding:14px 18px;border-bottom:1px solid rgba(58,55,82,.5);font-size:14.5px;cursor:pointer")}>Privacy policy</div>
              <div onClick={v.signOut} style={sx("padding:14px 18px;font-size:14.5px;color:#A5A1C2;cursor:pointer")}>Sign out</div>
            </div>
            <div style={sx("text-align:center;font-size:12px;color:#4E4A6E;margin-top:22px")}>CameraView 1.0.0</div>
          </div>
        </div>
      )}
    </>
  )
}
