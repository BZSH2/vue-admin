import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

const { VITE_SENTRY_DSN, VITE_SENTRY_ENV, VITE_SENTRY_ENABLE } = import.meta.env

console.log('Sentry 初始化', import.meta.env)

export function setupSentry(app: App<Element>) {
  if (VITE_SENTRY_ENABLE !== 'true') {
    return
  }
  if (!VITE_SENTRY_DSN) {
    return
  }
  Sentry.init({
    app,
    dsn: VITE_SENTRY_DSN,
    environment: VITE_SENTRY_ENV,
    sendDefaultPii: true,
  })
}
