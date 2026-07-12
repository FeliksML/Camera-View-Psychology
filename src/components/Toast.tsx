// GENERATED from design/CameraView Prototype.dc.html — section "toast".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'
import { useApp } from '../store/AppContext'

export function Toast() {
  const v = useApp()
  return (
    <>
      {v.hasToast && (
        <div style={sx("position:absolute;left:50%;bottom:96px;transform:translateX(-50%);z-index:60;max-width:80%;padding:10px 18px;border-radius:99px;background:rgba(38,36,64,.95);border:1px solid #3A3752;font-size:13px;color:#ECEAF7;white-space:nowrap;animation:cvFadeUp .35s ease both;box-shadow:0 8px 24px rgba(0,0,0,.4)")}>{v.toastMsg}</div>
      )}
    </>
  )
}
