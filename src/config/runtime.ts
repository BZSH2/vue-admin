/**
 * Runtime config
 *
 * 目标：支持“换环境不重新 build”。
 *
 * - 构建期配置：来自 `.env.*` / `import.meta.env`
 * - 运行期配置：来自 `public/runtime-config.js` 注入的 `window.__RUNTIME_CONFIG__`
 *
 * 约定：运行期配置优先级更高。
 */

export type RuntimeSentryConfig = {
  enable?: boolean
  dsn?: string
  env?: string
}

export type RuntimeConfig = {
  /** axios baseURL */
  apiBaseUrl?: string
  /** sentry config */
  sentry?: RuntimeSentryConfig
}

/** 获取运行时配置（浏览器端） */
export function getRuntimeConfig(): RuntimeConfig {
  if (typeof window === 'undefined') {
    return {}
  }
  return (window as any).__RUNTIME_CONFIG__ || {}
}

/**
 * 获取 API baseURL
 *
 * 优先级：runtime-config.js > VITE_API_BASE_URL > '/'
 */
export function getApiBaseUrl(): string {
  return getRuntimeConfig().apiBaseUrl || import.meta.env.VITE_API_BASE_URL || '/'
}

/**
 * 获取 Sentry 运行时配置
 *
 * enable 的优先级：runtime.sentry.enable > VITE_SENTRY_ENABLE
 */
export function getRuntimeSentryConfig() {
  const runtime = getRuntimeConfig().sentry || {}
  const enableFromEnv = import.meta.env.VITE_SENTRY_ENABLE === 'true'
  return {
    enable: runtime.enable ?? enableFromEnv,
    dsn: runtime.dsn ?? import.meta.env.VITE_SENTRY_DSN,
    env: runtime.env ?? import.meta.env.VITE_SENTRY_ENV,
  }
}
