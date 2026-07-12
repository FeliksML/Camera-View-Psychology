// GENERATED from design/CameraView Prototype.dc.html — section "14 · PAYWALL SHEET".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Paywall() {
  const v = useApp()
  return (
    <>
      {v.paywallOpen && (
        <div data-screen-label="14 Paywall" style={sx("position:absolute;inset:0;z-index:40")}>
          <div onClick={v.closePaywall} style={sx("position:absolute;inset:0;background:rgba(10,9,17,.6);animation:cvFade .3s ease both")} />
          <div style={sx("position:absolute;left:0;right:0;bottom:0;top:54px;border-radius:28px 28px 0 0;background:linear-gradient(180deg,#1E1B36 0%,#191631 100%);animation:cvSheet .45s cubic-bezier(.2,.8,.25,1) both;overflow:hidden;display:flex;flex-direction:column")}>
            <div style={sx("display:flex;justify-content:center;padding:10px 0 0")}>
              <div style={sx("width:38px;height:4.5px;border-radius:99px;background:rgba(165,161,194,.35)")} />
            </div>
            <div style={sx("flex:1;overflow-y:auto;padding:6px 24px calc(30px + env(safe-area-inset-bottom, 0px))")} className="cvs">
              <div style={sx("position:relative;height:210px;margin:8px -8px 0")}>
                <div style={sx("position:absolute;left:0;right:0;bottom:0;height:90px;background:radial-gradient(ellipse at 50% 100%,rgba(232,161,136,.22) 0%,transparent 70%)")} />
                <div style={sx("position:absolute;left:14%;top:12%;width:3px;height:3px;border-radius:50%;background:rgba(236,234,247,.5)")} />
                <div style={sx("position:absolute;left:78%;top:8%;width:2px;height:2px;border-radius:50%;background:rgba(236,234,247,.4)")} />
                <div style={sx("position:absolute;left:62%;top:22%;width:8px;height:8px;border-radius:50%;background:rgba(236,234,247,.12);filter:blur(2px)")} />
                <div style={sx("position:absolute;left:26%;top:30%;width:5px;height:5px;border-radius:50%;background:rgba(232,161,136,.3);filter:blur(1px)")} />
                <div style={sx("position:absolute;left:50%;bottom:2px;width:210px;height:210px;transform:translateX(-50%);border:1px solid rgba(236,234,247,.14);border-radius:50%")} />
                <div style={sx("position:absolute;left:50%;bottom:22px;width:150px;height:150px;transform:translateX(-50%);border:1px solid rgba(232,161,136,.55);border-radius:50%;box-shadow:0 0 24px rgba(232,161,136,.2)")} />
                <div style={sx("position:absolute;left:50%;bottom:42px;width:94px;height:94px;transform:translateX(-50%);border:1px solid rgba(236,234,247,.3);border-radius:50%")} />
                <div style={sx("position:absolute;left:50%;bottom:34px;transform:translateX(-50%)")}>
                  <svg width="30" height="48" viewBox="0 0 60 96">
                    <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.5)" strokeWidth="1.2" />
                  </svg>
                </div>
              </div>
              <div style={sx("font-family:Lora,serif;font-size:28px;line-height:1.2;text-align:center;margin-top:4px")}>Go deeper with a live guide.</div>
              <div style={sx("display:flex;flex-direction:column;gap:11px;margin-top:22px")}>
                <div style={sx("display:flex;align-items:center;gap:11px;font-size:14px;color:#D9D6EA")}>
                  <div style={sx("width:19px;height:19px;flex:none;border:1.2px solid #8FBFAF;border-radius:50%;display:flex;align-items:center;justify-content:center")}>
                    <svg width="9" height="7" viewBox="0 0 9 7">
                      <path d="M1 3.5 3.4 6 8 1" fill="none" stroke="#8FBFAF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  Adaptive AI guide that listens and responds
                </div>
                <div style={sx("display:flex;align-items:center;gap:11px;font-size:14px;color:#D9D6EA")}>
                  <div style={sx("width:19px;height:19px;flex:none;border:1.2px solid #8FBFAF;border-radius:50%;display:flex;align-items:center;justify-content:center")}>
                    <svg width="9" height="7" viewBox="0 0 9 7">
                      <path d="M1 3.5 3.4 6 8 1" fill="none" stroke="#8FBFAF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  Natural voice for every session
                </div>
                <div style={sx("display:flex;align-items:center;gap:11px;font-size:14px;color:#D9D6EA")}>
                  <div style={sx("width:19px;height:19px;flex:none;border:1.2px solid #8FBFAF;border-radius:50%;display:flex;align-items:center;justify-content:center")}>
                    <svg width="9" height="7" viewBox="0 0 9 7">
                      <path d="M1 3.5 3.4 6 8 1" fill="none" stroke="#8FBFAF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {"Unlimited sessions & full belief journal"}
                </div>
                <div style={sx("display:flex;align-items:center;gap:11px;font-size:14px;color:#D9D6EA")}>
                  <div style={sx("width:19px;height:19px;flex:none;border:1.2px solid #8FBFAF;border-radius:50%;display:flex;align-items:center;justify-content:center")}>
                    <svg width="9" height="7" viewBox="0 0 9 7">
                      <path d="M1 3.5 3.4 6 8 1" fill="none" stroke="#8FBFAF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  New scenes and methods first
                </div>
              </div>
              <div style={sx("display:flex;gap:11px;margin-top:24px")}>
                <div onClick={v.pickYear} style={sx(v.yearCard)}>
                  <div style={sx("position:absolute;top:-9px;left:14px;height:18px;padding:0 8px;border-radius:99px;background:#E8A188;color:#1E1C33;font-size:9.5px;font-weight:600;letter-spacing:.06em;display:flex;align-items:center")}>SAVE 40%</div>
                  <div style={sx("font-size:13px;color:#A5A1C2")}>Yearly</div>
                  <div style={sx("font-size:19px;font-weight:600;margin-top:5px")}>
                    $59.99
                    <span style={sx("font-size:12.5px;font-weight:400;color:#A5A1C2")}>/yr</span>
                  </div>
                  <div style={sx("font-size:11.5px;color:#8FBFAF;margin-top:3px")}>just $5/mo</div>
                </div>
                <div onClick={v.pickMonth} style={sx(v.monthCard)}>
                  <div style={sx("font-size:13px;color:#A5A1C2")}>Monthly</div>
                  <div style={sx("font-size:19px;font-weight:600;margin-top:5px")}>
                    $9.99
                    <span style={sx("font-size:12.5px;font-weight:400;color:#A5A1C2")}>/mo</span>
                  </div>
                  <div style={sx("font-size:11.5px;color:#6B678C;margin-top:3px")}>flexible</div>
                </div>
              </div>
              <div style={sx("text-align:center;font-size:13px;color:#A5A1C2;margin-top:12px")}>7-day free trial, cancel anytime</div>
              <div onClick={v.trial} style={sx("margin-top:14px;height:56px;border-radius:99px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16.5px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>Start free trial</div>
              <div style={sx("display:flex;justify-content:center;gap:16px;margin-top:14px;font-size:12px;color:#6B678C")}>
                <span style={sx("cursor:pointer")}>Restore purchases</span>
                <span>·</span>
                <span style={sx("cursor:pointer")}>Terms</span>
                <span>·</span>
                <span style={sx("cursor:pointer")}>Privacy</span>
              </div>
              <div style={sx("text-align:center;font-size:13px;color:#8FBFAF;margin-top:18px")}>3 guided sessions every month stay free — forever.</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
