export function isNativeApp() {
  return typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.() === true;
}

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => "ios" | "android" | "web";
    };
  }
}
