import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { appStoreRef } from './store/AppContext'
import { initNative } from './native/ios'

// Design-time props from the prototype (data-props): toggle via URL —
//   ?empty=1 → journalEmpty (empty journal state)
//   ?plus=1  → plusMember  (Plus subscription active)
const q = new URLSearchParams(location.search)

createRoot(document.getElementById('root')!).render(
  <App appProps={{ journalEmpty: q.has('empty'), plusMember: q.has('plus') }} />,
)

// Native glue (status bar / splash / breathing haptics) — no-op in the browser.
initNative(appStoreRef)

// Dev-only console handle for state debugging
if (import.meta.env.DEV) {
  ;(window as unknown as { __store: typeof appStoreRef }).__store = appStoreRef
}
