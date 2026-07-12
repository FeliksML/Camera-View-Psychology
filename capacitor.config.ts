import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.feliks.cameraview',
  appName: 'CameraView',
  webDir: 'dist',
  ios: {
    // The app handles safe areas itself via env(safe-area-inset-*)
    contentInset: 'never',
  },
  plugins: {
    Keyboard: {
      resize: 'native',
    },
    SplashScreen: {
      backgroundColor: '#0D0C16',
      launchShowDuration: 0,
      showSpinner: false,
    },
  },
}

export default config
