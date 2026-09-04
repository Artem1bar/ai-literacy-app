/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend base URL. Unset → localhost:8000 in dev, same-origin in production builds. */
  readonly VITE_API_URL?: string
}
