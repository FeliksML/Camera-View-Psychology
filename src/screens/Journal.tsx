// GENERATED from design/CameraView Prototype.dc.html — section "12 · JOURNAL".
// Hand-tuned after generation; the design file remains the source of truth.
import { Fragment } from 'react'
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Journal() {
  const v = useApp()
  return (
    <>
      {v.sJournal && (
        <div data-screen-label="12 Journal" style={sx("position:absolute;inset:0;animation:cvFadeUp .45s ease both")}>
          <div style={sx("position:absolute;inset:0;overflow-y:auto;padding:74px 20px 130px;box-sizing:border-box")} className="cvs">
            <div style={sx("display:flex;align-items:baseline;justify-content:space-between")}>
              <div style={sx("font-family:Lora,serif;font-size:30px")}>Journal</div>
              <div onClick={v.cycleFilter} style={sx("height:30px;padding:0 13px;border-radius:99px;border:1px solid #3A3752;display:flex;align-items:center;font-size:12.5px;color:#A5A1C2;cursor:pointer")} className={pseudo('hover', "border-color:#A5A1C2;color:#ECEAF7")}>
                {v.filterLabel}
                ▾
              </div>
            </div>
            {v.hasTopics && (
              <div>
                <div style={sx("font-size:12px;letter-spacing:.1em;color:#6B678C;margin:22px 0 10px")}>FOR LATER — NOTED MID-SESSION</div>
                <div style={sx("display:flex;flex-wrap:wrap;gap:8px")}>
                  {v.topicChips.map((tp: any, i: number) => (
                    <div key={i} onClick={tp.tap} style={sx("height:32px;padding:0 14px;border-radius:99px;border:1px dashed rgba(143,191,175,.5);display:flex;align-items:center;gap:7px;font-size:12.5px;color:#8FBFAF;cursor:pointer")} className={pseudo('hover', "background:rgba(143,191,175,.08)")}>
                      <div style={sx("width:5px;height:5px;border-radius:50%;background:#8FBFAF")} />
                      {tp.t}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {v.jEmpty && (
              <div style={sx("display:flex;flex-direction:column;align-items:center;padding-top:120px")}>
                <div style={sx("position:relative;width:110px;height:110px;display:flex;align-items:center;justify-content:center")}>
                  <div style={sx("position:absolute;inset:0;border:1px solid rgba(58,55,82,.8);border-radius:50%")} />
                  <div style={sx("position:absolute;inset:16px;border:1px solid rgba(165,161,194,.3);border-radius:50%")} />
                  <svg width="26" height="42" viewBox="0 0 60 96">
                    <path d="M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z" fill="#131120" stroke="rgba(236,234,247,.45)" strokeWidth="1.4" />
                  </svg>
                </div>
                <div style={sx("font-family:Lora,serif;font-size:20px;margin-top:22px")}>Your story starts with one session</div>
                <div onClick={v.beginNow} style={sx("margin-top:18px;height:46px;padding:0 28px;border-radius:99px;border:1px solid #A5A1C2;display:flex;align-items:center;font-size:14.5px;color:#ECEAF7;cursor:pointer")} className={pseudo('hover', "background:rgba(236,234,247,.05)")}>Begin now</div>
              </div>
            )}
            {v.jHas && (
              <>
                <div style={sx("font-size:12px;letter-spacing:.1em;color:#6B678C;margin:22px 0 12px")}>JULY</div>
                <div style={sx("display:flex;flex-direction:column;gap:12px")}>
                  {v.jRows.map((j: any, i: number) => (
                    <div key={i}>
                      {j.ins && (
                        <div style={sx("border-radius:20px;border:1px dashed rgba(143,191,175,.4);padding:14px 16px;display:flex;gap:12px;align-items:flex-start")}>
                          <svg width="20" height="20" viewBox="0 0 20 20" style={sx("flex:none;margin-top:1px")}>
                            <circle cx="10" cy="10" r="3.4" fill="none" stroke="#8FBFAF" strokeWidth="1.1" />
                            <path d="M10 2v2.6M10 15.4V18M2 10h2.6M15.4 10H18M4.3 4.3l1.9 1.9M13.8 13.8l1.9 1.9M15.7 4.3l-1.9 1.9M6.2 13.8l-1.9 1.9" stroke="#8FBFAF" strokeWidth="1.1" strokeLinecap="round" />
                          </svg>
                          <div style={sx("font-size:13px;line-height:1.5;color:#A5A1C2")}>{j.text}</div>
                        </div>
                      )}
                      {j.card && (
                        <div style={sx("position:relative;border-radius:20px;background:rgba(38,36,64,.8);box-shadow:inset 0 0 24px rgba(236,234,247,.03);padding:15px 18px 15px 22px;overflow:hidden")}>
                          <div style={sx(j.barStyle)} />
                          <div style={sx("display:flex;align-items:center;gap:9px")}>
                            <div style={sx(j.tagStyle)}>{j.tag}</div>
                            <div style={sx("font-size:12px;color:#6B678C")}>{j.date}</div>
                            <div style={sx("font-size:12px;color:#6B678C")}>
                              ·
                              {j.dur}
                            </div>
                          </div>
                          <div style={sx("font-family:Lora,serif;font-size:16px;line-height:1.45;color:#ECEAF7;margin-top:9px")}>{j.belief}</div>
                          <div style={sx("display:flex;align-items:center;gap:5px;margin-top:9px;font-size:12.5px;color:#8FBFAF")}>
                            {j.shift}
                            <svg width="9" height="10" viewBox="0 0 11 12">
                              <path d="M5.5 1v9M2 7l3.5 3.5L9 7" fill="none" stroke="#8FBFAF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      )}
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
