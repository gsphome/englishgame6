declare const __BUILD_TIME__: string;
declare const __APP_VERSION__: string;

declare global {
  interface Window {
    __BUILD_TIME__: string;
    __APP_VERSION__: string;
  }
}

export {};
