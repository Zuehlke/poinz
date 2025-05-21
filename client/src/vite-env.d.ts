/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_POSTHOG_KEY: string
  readonly VITE_PUBLIC_POSTHOG_HOST: string
  // more env variables can be declared here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}