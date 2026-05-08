import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const config: CapacitorConfig = {
  appId: "com.nutrivue.app",
  appName: "Nutrivue",
  webDir: ".next",
  server: appUrl
    ? {
        url: appUrl,
        cleartext: appUrl.startsWith("http://")
      }
    : undefined,
  ios: {
    contentInset: "automatic",
    scrollEnabled: true
  },
  android: {
    allowMixedContent: false,
    captureInput: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#fbfcf7",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#fbfcf7",
      overlaysWebView: false
    },
    Keyboard: {
      resize: KeyboardResize.Native
    }
  }
};

export default config;
