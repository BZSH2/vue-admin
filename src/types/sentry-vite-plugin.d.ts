declare module '@sentry/vite-plugin' {
  import type { Plugin } from 'vite'

  interface SentryVitePluginOptions {
    org?: string | undefined
    project?: string | undefined
    authToken?: string | undefined
    release?: string | undefined
    sourcemaps?: {
      assets?: string
      [key: string]: any
    }
    [key: string]: any
  }

  export function sentryVitePlugin(options: SentryVitePluginOptions): Plugin
}
