import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

import { getRuntimeSentryConfig } from '@/config/runtime'

/**
 * Sentry 配置来源
 *
 * - 运行时：public/runtime-config.js（优先级更高）
 * - 构建时：.env.* / import.meta.env
 */

/**
 * 初始化前端 Sentry 监控
 *
 * 配置优先级：
 * - 运行时：public/runtime-config.js（可用于线上快速开关）
 * - 构建时：.env.* / import.meta.env
 *
 * 仅当 enable=true 且存在有效 DSN 时才会真正初始化。
 */
export function setupSentry(app: App<Element>) {
  const sentry = getRuntimeSentryConfig()
  if (!sentry.enable) {
    return
  }
  if (!sentry.dsn) {
    return
  }
  Sentry.init({
    app,
    dsn: sentry.dsn,
    environment: sentry.env,
    sendDefaultPii: true,
  })
}
