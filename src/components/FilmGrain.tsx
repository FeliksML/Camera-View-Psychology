// GENERATED from design/CameraView Prototype.dc.html — section "film grain".
// Hand-tuned after generation; the design file remains the source of truth.
import { sx } from '../lib/sx'

export function FilmGrain() {
  return (
    <div style={sx("position:absolute;inset:0;z-index:70;pointer-events:none;opacity:.035;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22140%22 height=%22140%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')")} />
  )
}
