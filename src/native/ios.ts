// Native iOS glue (no-ops in the browser): status bar, splash screen, and
// breathing haptics that follow the grounding stage's 8s inhale/exhale cycle.
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

interface StoreLike {
  state: { screen?: string; stage?: number; haptics?: boolean }
  subscribe: (l: () => void) => () => void
}

export function initNative(storeRef: { current: StoreLike | null }): void {
  if (!Capacitor.isNativePlatform()) return

  StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
  StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {})
  SplashScreen.hide().catch(() => {})

  let breath: number | undefined
  let exhale: number | undefined
  const pulse = () => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
    exhale = window.setTimeout(() => {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
    }, 3200) // exhale begins at 40% of the 8s cvBreathe cycle
  }
  const sync = () => {
    const s = storeRef.current?.state
    const active = !!s && s.screen === 'session' && s.stage === 1 && s.haptics !== false
    if (active && breath === undefined) {
      pulse()
      breath = window.setInterval(pulse, 8000)
    } else if (!active && breath !== undefined) {
      clearInterval(breath)
      clearTimeout(exhale)
      breath = undefined
    }
  }
  storeRef.current?.subscribe(sync)
  sync()
}
