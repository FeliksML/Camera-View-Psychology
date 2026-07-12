// GENERATED from design/CameraView Prototype.dc.html — phone content wrapper.
import { sx } from './lib/sx'
import { Onboarding } from './screens/Onboarding'
import { Signin } from './screens/Signin'
import { Home } from './screens/Home'
import { Setup } from './screens/Setup'
import { Session } from './screens/Session'
import { Summary } from './screens/Summary'
import { Journal } from './screens/Journal'
import { Progress } from './screens/Progress'
import { Threads } from './screens/Threads'
import { Settings } from './screens/Settings'
import { Crisis } from './screens/Crisis'
import { TabDock } from './components/TabDock'
import { Paywall } from './components/Paywall'
import { Toast } from './components/Toast'
import { FilmGrain } from './components/FilmGrain'

export function PhoneApp() {
  return (
    <div style={sx("width:100%;height:100%;position:relative;overflow:hidden;background:linear-gradient(180deg,#151422 0%,#1E1C33 100%);font-family:Inter,sans-serif;color:#ECEAF7")}>
      <Onboarding />
      <Signin />
      <Home />
      <Setup />
      <Session />
      <Summary />
      <Journal />
      <Progress />
      <Threads />
      <Settings />
      <Crisis />
      <TabDock />
      <Paywall />
      <Toast />
      <FilmGrain />
    </div>
  )
}
