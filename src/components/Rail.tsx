// GENERATED from design/CameraView Prototype.dc.html — section "navigator rail".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { pseudo } from '../lib/pseudo'
import { useApp } from '../store/AppContext'

export function Rail() {
  const v = useApp()
  return (
    <div style={sx("position:fixed;left:0;top:0;bottom:0;width:212px;box-sizing:border-box;padding:20px 14px;border-right:1px solid rgba(58,55,82,.45);overflow-y:auto;z-index:5;background:#0D0C16")} className="cvs cv-rail">
      <div style={sx("font-family:Lora,serif;font-size:17px;color:#ECEAF7;padding:0 10px")}>CameraView</div>
      <div style={sx("font-size:10.5px;color:#6B678C;padding:3px 10px 14px;letter-spacing:.04em")}>INTERACTIVE PROTOTYPE</div>
      {v.railItems.map((r: any, i: number) => (
        <div key={i}>
          {r.head && (
            <div style={sx("font-size:9.5px;letter-spacing:.12em;color:#6B678C;padding:14px 10px 5px")}>{r.label}</div>
          )}
          {r.item && (
            <div onClick={r.go} style={sx(r.style)} className={pseudo('hover', "color:#ECEAF7")}>{r.label}</div>
          )}
        </div>
      ))}
      <div onClick={v.restart} style={sx("margin:18px 10px 0;padding:8px 0;text-align:center;font-size:11.5px;color:#A5A1C2;border:1px solid #3A3752;border-radius:99px;cursor:pointer")} className={pseudo('hover', "color:#ECEAF7;border-color:#A5A1C2")}>Restart flow</div>
    </div>
  )
}
