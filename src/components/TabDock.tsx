// GENERATED from design/CameraView Prototype.dc.html — section "TAB DOCK".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function TabDock() {
  const v = useApp()
  return (
    <>
      {v.hasTabs && (
        <div style={sx("position:absolute;left:50%;bottom:calc(26px + env(safe-area-inset-bottom, 0px));transform:translateX(-50%);z-index:30;display:flex;gap:8px;padding:9px 14px;border-radius:99px;background:rgba(30,28,48,.72);border:1px solid rgba(58,55,82,.8);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)")}>
          {v.tabs.map((t: any, i: number) => (
            <div key={i} onClick={t.go} style={sx("width:56px;height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;border-radius:14px")} className={pseudo('hover', "background:rgba(236,234,247,.05)")}>
              <svg width="21" height="21" viewBox="0 0 24 24">
                <path d={t.d} fill="none" stroke={t.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={sx(t.dot)} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
