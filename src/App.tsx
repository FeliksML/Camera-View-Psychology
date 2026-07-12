import { AppProvider } from './store/AppContext'
import { Rail } from './components/Rail'
import { IOSDevice } from './ios/IOSFrame'
import { PhoneApp } from './PhoneApp'
import { sx } from './lib/sx'

/**
 * Demo shell from the design: navigator rail on the left, the app inside an
 * iOS device frame centered on a radial-gradient stage. index.css collapses
 * the rail (<1000px) and the bezel (≤450px) for smaller viewports.
 */
export default function App({ appProps }: { appProps?: { journalEmpty?: boolean; plusMember?: boolean } }) {
  return (
    <AppProvider appProps={appProps}>
      <div style={sx('min-height:100vh;display:flex;box-sizing:border-box')}>
        <Rail />
        <div
          className="cv-stage"
          style={sx(
            'flex:1;margin-left:212px;display:flex;align-items:center;justify-content:center;padding:36px 24px;background:radial-gradient(80% 60% at 50% 30%,#14131F 0%,#0D0C16 100%)',
          )}
        >
          <IOSDevice dark>
            <PhoneApp />
          </IOSDevice>
        </div>
      </div>
    </AppProvider>
  )
}
