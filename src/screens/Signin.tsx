// GENERATED from design/CameraView Prototype.dc.html — section "2 · SIGN IN".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'
import signinBg from '../../assets/recraft/illustrations/signin-bg-1.png'

export function Signin() {
  const v = useApp()
  return (
    <>
      {v.sSignin && (
        <div data-screen-label="02 Sign in" style={sx("position:absolute;inset:0;animation:cvFadeUp .45s ease both")}>
          {/* Recraft atmospheric backdrop — aperture motif over near-empty dark space for the buttons */}
          <div style={sx(`position:absolute;inset:0;z-index:0;background-image:url(${signinBg});background-size:cover;background-position:center top;opacity:.7;pointer-events:none`)} />
          <div style={sx("position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,transparent 0%,transparent 44%,rgba(16,14,27,.55) 78%,rgba(16,14,27,.85) 100%);pointer-events:none")} />
          <div style={sx("position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;padding:0 28px;box-sizing:border-box")}>
          <div style={sx("flex:1.1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end")}>
            <div style={sx("position:relative;width:120px;height:120px;display:flex;align-items:center;justify-content:center")}>
              <div style={sx("position:absolute;inset:0;border:1px solid rgba(58,55,82,.7);border-radius:50%")} />
              <div style={sx("position:absolute;inset:16px;border:1px solid rgba(58,55,82,.9);border-radius:50%")} />
              <div style={sx("width:44px;height:44px;border:1.2px solid #A5A1C2;border-radius:50%;display:flex;align-items:center;justify-content:center")}>
                <div style={sx("width:8px;height:8px;border-radius:50%;background:#E8A188")} />
              </div>
            </div>
            <div style={sx("font-family:Lora,serif;font-size:24px;margin-top:10px;letter-spacing:.01em")}>CameraView</div>
          </div>
          <div style={sx("flex:.7;display:flex;flex-direction:column;align-items:center;justify-content:center")}>
            <div style={sx("font-family:Lora,serif;font-size:28px;font-weight:500")}>Welcome back</div>
            <div style={sx("font-size:15px;color:#A5A1C2;margin-top:8px")}>Your sessions stay private.</div>
          </div>
          <div style={sx("flex:1.3;display:flex;flex-direction:column;justify-content:flex-start;width:100%;gap:12px;padding-top:10px")}>
            {v.authButtons && (
              <>
                <div onClick={v.signIn} style={sx("height:56px;border-radius:28px;background:#ECEAF7;color:#15141F;display:flex;align-items:center;justify-content:center;gap:9px;font-size:16px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>
                  <svg width="16" height="19" viewBox="0 0 16 19">
                    <path d="M13.1 10.1c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8C3.2 4.6 1.7 5.5.9 7c-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM10.6 2.8c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z" fill="#15141F" />
                  </svg>
                  {" Continue with Apple "}
                </div>
                <div onClick={v.signInGoogle} style={sx("height:56px;border-radius:28px;border:1px solid #A5A1C2;color:#ECEAF7;display:flex;align-items:center;justify-content:center;gap:10px;font-size:16px;font-weight:500;cursor:pointer")} className={pseudo('hover', "background:rgba(236,234,247,.05)")}>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#8FA8E8" />
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#8FBFAF" />
                    <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#E8CE88" />
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#E8A188" />
                  </svg>
                  {" Continue with Google "}
                </div>
                <div onClick={v.signInEmail} style={sx("height:56px;border-radius:28px;border:1px solid #A5A1C2;color:#ECEAF7;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:500;cursor:pointer")} className={pseudo('hover', "background:rgba(236,234,247,.05)")}>Continue with email</div>
              </>
            )}
            {v.authEmailMode && (
              <>
                <input
                  value={v.authEmail}
                  onChange={v.onAuthEmail}
                  onKeyDown={v.authEmailKey}
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  placeholder="you@example.com"
                  style={sx("height:56px;border-radius:28px;border:1px solid #3A3752;background:rgba(38,36,64,.6);color:#ECEAF7;padding:0 22px;font-size:16px;outline:none;font-family:Inter,sans-serif;box-sizing:border-box;width:100%")}
                />
                <div onClick={v.authSend} style={sx("height:56px;border-radius:28px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>{v.authSendLabel}</div>
                <div onClick={v.authBack} style={sx("text-align:center;font-size:14px;color:#A5A1C2;cursor:pointer;padding:4px")} className={pseudo('hover', "color:#ECEAF7")}>Back</div>
              </>
            )}
            {v.authCodeMode && (
              <>
                <div style={sx("text-align:center;font-size:13.5px;color:#A5A1C2")}>{"We sent a 6-digit code to "}{v.authEmail}</div>
                <input
                  value={v.authCode}
                  onChange={v.onAuthCode}
                  onKeyDown={v.authCodeKey}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  style={sx("height:56px;border-radius:28px;border:1px solid #3A3752;background:rgba(38,36,64,.6);color:#ECEAF7;padding:0 22px;font-size:22px;letter-spacing:.5em;text-align:center;outline:none;font-family:Inter,sans-serif;box-sizing:border-box;width:100%")}
                />
                <div onClick={v.authVerify} style={sx("height:56px;border-radius:28px;background:#E8A188;color:#1E1C33;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;cursor:pointer")} className={pseudo('active', "transform:scale(.98)")}>{v.authVerifyLabel}</div>
                <div onClick={v.authBack} style={sx("text-align:center;font-size:14px;color:#A5A1C2;cursor:pointer;padding:4px")} className={pseudo('hover', "color:#ECEAF7")}>Use a different email</div>
              </>
            )}
            {v.hasAuthErr && (
              <div style={sx("text-align:center;font-size:13px;color:#C97E6B")}>{v.authErr}</div>
            )}
            <div style={sx("text-align:center;font-size:12px;color:#6B678C;margin-top:4px")}>
              {"By continuing you agree to "}
              <span style={sx("text-decoration:underline")}>Terms</span>
              {" & "}
              <span style={sx("text-decoration:underline")}>Privacy</span>
            </div>
          </div>
          <div style={sx("padding-bottom:44px;display:flex;align-items:center;gap:7px;font-size:13px;color:#8FBFAF")}>
            <svg width="13" height="15" viewBox="0 0 13 15">
              <rect x="1" y="6" width="11" height="8" rx="2" fill="none" stroke="#8FBFAF" strokeWidth="1.2" />
              <path d="M3.5 6V4.5a3 3 0 0 1 6 0V6" fill="none" stroke="#8FBFAF" strokeWidth="1.2" />
            </svg>
            {" End-to-end account privacy. Delete your data anytime. "}
          </div>
          </div>
        </div>
      )}
    </>
  )
}
