import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

/**
 * Sentry 运行时配置
 * 通过 Vite 环境变量控制开关、环境与 DSN
 */
const { VITE_SENTRY_DSN, VITE_SENTRY_ENV, VITE_SENTRY_ENABLE } = import.meta.env

/**
 * 初始化前端 Sentry 监控
 * - 仅当 VITE_SENTRY_ENABLE 为 'true' 且存在有效 DSN 时才会真正初始化
 * - 在本地开发、测试或线上环境通过不同 env 文件控制
 */
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
