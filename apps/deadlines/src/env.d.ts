/// <reference types="vite/client" />
declare global {
  const __BUILD__: string;
}

declare module "preact" {
  namespace JSX {
    interface CSSProperties { [key: `--${string}`]: string | number }
  }
}
export {};
