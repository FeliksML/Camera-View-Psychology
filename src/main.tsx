import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Design-time props from the prototype (data-props): toggle via URL —
//   ?empty=1 → journalEmpty (empty journal state)
//   ?plus=1  → plusMember  (Plus subscription active)
const q = new URLSearchParams(location.search)

createRoot(document.getElementById('root')!).render(
  <App appProps={{ journalEmpty: q.has('empty'), plusMember: q.has('plus') }} />,
)
