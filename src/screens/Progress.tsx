// GENERATED from design/CameraView Prototype.dc.html — section "13 · PROGRESS".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Progress() {
  const v = useApp()
  return (
    <>
      {v.sProgress && (
        <div data-screen-label="13 Progress" style={sx("position:absolute;inset:0;animation:cvFadeUp .45s ease both")}>
          <div style={sx("position:absolute;inset:0;overflow-y:auto;padding:74px 20px 130px;box-sizing:border-box")} className="cvs">
            <div style={sx("font-family:Lora,serif;font-size:30px")}>Progress</div>
            <div style={sx("font-size:13px;color:#6B678C;margin-top:4px")}>Last 30 days</div>
            <div style={sx("margin-top:18px;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:18px 16px 12px")}>
              <div style={sx("font-size:13px;color:#A5A1C2;padding-left:4px")}>Intensity journey</div>
              <svg width="100%" height="150" viewBox="0 0 330 150" style={sx("margin-top:8px")}>
                <defs>
                  <linearGradient id="cvGap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(143,191,175,.28)" />
                    <stop offset="100%" stopColor="rgba(143,191,175,.04)" />
                  </linearGradient>
                </defs>
                <path d="M10 46 C24 46 24 52 38 52 C52 52 52 40 66 40 C80 40 80 58 94 58 C108 58 108 52 122 52 C136 52 136 46 150 46 C164 46 164 64 178 64 C192 64 192 58 206 58 C220 58 220 52 234 52 C248 52 248 64 262 64 C276 64 276 58 290 58 C304 58 304 46 318 46 L318 94 C304 94 304 100 290 100 C276 100 276 106 262 106 C248 106 248 100 234 100 C220 100 220 94 206 94 C192 94 192 100 178 100 C164 100 164 94 150 94 C136 94 136 88 122 88 C108 88 108 94 94 94 C80 94 80 88 66 88 C52 88 52 82 38 82 C24 82 24 82 10 82 Z" fill="url(#cvGap)" />
                <path d="M10 46 C24 46 24 52 38 52 C52 52 52 40 66 40 C80 40 80 58 94 58 C108 58 108 52 122 52 C136 52 136 46 150 46 C164 46 164 64 178 64 C192 64 192 58 206 58 C220 58 220 52 234 52 C248 52 248 64 262 64 C276 64 276 58 290 58 C304 58 304 46 318 46" fill="none" stroke="rgba(165,161,194,.55)" strokeWidth="1.4" />
                <path d="M10 82 C24 82 24 82 38 82 C52 82 52 88 66 88 C80 88 80 94 94 94 C108 94 108 88 122 88 C136 88 136 94 150 94 C164 94 164 100 178 100 C192 100 192 94 206 94 C220 94 220 100 234 100 C248 100 248 106 262 106 C276 106 276 100 290 100 C304 100 304 94 318 94" fill="none" stroke="#8FBFAF" strokeWidth="1.6" />
                <text x="166" y="80" textAnchor="middle" fontSize="10.5" fill="#8FBFAF" fontFamily="Inter,sans-serif" letterSpacing=".06em">your calm gap</text>
                <text x="10" y="146" fontSize="11" fill="#6B678C" fontFamily="Inter,sans-serif">Jun 12</text>
                <text x="318" y="146" textAnchor="end" fontSize="11" fill="#6B678C" fontFamily="Inter,sans-serif">Jul 11</text>
                <text x="10" y="40" fontSize="10" fill="rgba(165,161,194,.6)" fontFamily="Inter,sans-serif">before</text>
                <text x="10" y="76" fontSize="10" fill="#8FBFAF" fontFamily="Inter,sans-serif">after</text>
              </svg>
            </div>
            <div style={sx("display:flex;gap:12px;margin-top:12px")}>
              <div style={sx("flex:1;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:16px 18px")}>
                <div style={sx("font-size:12px;color:#A5A1C2")}>Sessions</div>
                <div style={sx("font-family:Lora,serif;font-size:30px;margin-top:6px")}>12</div>
              </div>
              <div style={sx("flex:1;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:16px 18px")}>
                <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
                  <div style={sx("font-size:12px;color:#A5A1C2")}>Avg. drop</div>
                  <svg width="18" height="12" viewBox="0 0 20 12">
                    <path d="M1 4c2.5 0 2.5 4 5 4s2.5-5 5-5 2.5 6 5 6 2-3 3-3" fill="none" stroke="#8FBFAF" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={sx("font-family:Lora,serif;font-size:30px;margin-top:6px")}>−3.4</div>
              </div>
            </div>
            <div style={sx("margin-top:12px;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:6px 0")}>
              <div style={sx("display:flex;align-items:center;justify-content:space-between;padding:12px 18px 6px")}>
                <div style={sx("font-size:13px;color:#A5A1C2")}>Beliefs replaced</div>
                <div style={sx("min-width:22px;height:22px;border-radius:99px;background:rgba(232,161,136,.15);border:1px solid rgba(232,161,136,.4);display:flex;align-items:center;justify-content:center;font-size:11.5px;color:#E8A188")}>8</div>
              </div>
              {v.beliefRows.map((br: any, i: number) => (
                <div key={i} style={sx("display:flex;align-items:center;gap:10px;padding:11px 18px;border-top:1px solid rgba(58,55,82,.5)")}>
                  <div style={sx("flex:1")}>
                    <div style={sx("font-size:11.5px;color:#6B678C;text-decoration:line-through")}>{br.old}</div>
                    <div style={sx("font-family:Lora,serif;font-size:14.5px;color:#EFC5B2;margin-top:3px")}>{br.neu}</div>
                  </div>
                  <svg width="7" height="12" viewBox="0 0 8 14" style={sx("flex:none")}>
                    <path d="M1 1l6 6-6 6" fill="none" stroke="#6B678C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ))}
            </div>
            <div style={sx("margin-top:12px;border-radius:24px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:16px 18px")}>
              <div style={sx("font-size:13px;color:#A5A1C2")}>Emotions you worked with</div>
              <div style={sx("display:flex;gap:4px;margin-top:14px;height:12px")}>
                {v.emoSegs.map((s: any, i: number) => (
                  <div key={i} style={sx(s.style)} />
                ))}
              </div>
              <div style={sx("display:flex;gap:4px;margin-top:8px")}>
                {v.emoSegs.map((s: any, i: number) => (
                  <div key={i} style={sx(s.labelStyle)}>
                    {s.label}
                    <span style={sx("color:#6B678C")}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div onClick={v.toThreads} style={sx("margin-top:12px;border-radius:24px;padding:16px 18px;cursor:pointer;border:1px solid rgba(232,161,136,.4);background:linear-gradient(135deg,rgba(232,161,136,.1) 0%,rgba(38,36,64,.8) 55%);box-shadow:0 0 24px rgba(232,161,136,.08)")} className={pseudo('hover', "border-color:rgba(232,161,136,.7)")}>
              <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
                <div style={sx("font-size:10px;letter-spacing:.13em;color:#E8A188")}>ACROSS YOUR SESSIONS</div>
                <svg width="15" height="11" viewBox="0 0 15 11">
                  <path d="M1 3.5 C3.5 3.5 3.5 8.5 6 8.5 S8.5 2 11 2 14 6 14 6" fill="none" stroke="#E8A188" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div style={sx("font-family:Lora,serif;font-size:17px;line-height:1.45;color:#ECEAF7;margin-top:8px")}>Two of your themes look like one thread</div>
              <div style={sx("font-size:12.5px;line-height:1.5;color:#A5A1C2;margin-top:5px")}>
                Work and friends keep landing on the same belief — and the same years.
              </div>
              <div style={sx("display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12.5px;color:#E8A188")}>
                {"See the connections "}
                <svg width="7" height="11" viewBox="0 0 8 14">
                  <path d="M1 1l6 6-6 6" fill="none" stroke="#E8A188" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
