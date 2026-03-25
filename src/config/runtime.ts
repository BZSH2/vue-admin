/**
 * Runtime config
 *
 * - Web 端运行时配置来自 `public/runtime-config.js`
 * - Electron 安装包运行时配置来自 `window.electronAPI.runtimeConfig`
 * - 运行时配置优先级高于 `.env.*` / `import.meta.env`
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

const isBrowserRuntime = () => typeof window !== 'undefined'
const electronDefaultApiBaseUrl = import.meta.env.VITE_ELECTRON_API_BASE_URL || ''

function isFileProtocolRuntime() {
  return isBrowserRuntime() && window.location.protocol === 'file:'
}

export function isSafeHttpUrl(rawUrl?: string) {
  if (!rawUrl) {
    return false
  }

  try {
    const parsed = new URL(rawUrl)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isElectronRuntime() {
  return isBrowserRuntime() && !!window.electronAPI
}

export function isElectronFileRuntime() {
  return isElectronRuntime() && isFileProtocolRuntime()
}

// Electron 安装包优先使用主进程已经解析好的最终地址，
// 避免渲染进程拿到空字符串时过早判定“缺少 API 地址”。
function getElectronResolvedApiBaseUrl() {
  if (!isFileProtocolRuntime()) {
    return ''
  }

  return (
    window.electronAPI?.resolvedApiBaseUrl ||
    window.electronAPI?.runtimeConfig?.apiBaseUrl ||
    electronDefaultApiBaseUrl ||
    import.meta.env.VITE_API_BASE_URL ||
    ''
  )
}

function mergeRuntimeConfig(
  browserConfig: RuntimeConfig,
  electronConfig: RuntimeConfig
): RuntimeConfig {
  return {
    ...browserConfig,
    ...electronConfig,
    sentry: {
      ...(browserConfig.sentry || {}),
      ...(electronConfig.sentry || {}),
    },
  }
}

/** 获取运行时配置 */
export function getRuntimeConfig(): RuntimeConfig {
  if (!isBrowserRuntime()) {
    return {}
  }

  const browserConfig = window.__RUNTIME_CONFIG__ || {}
  const electronConfig = window.electronAPI?.runtimeConfig || {}
  const normalizedElectronConfig =
    isElectronFileRuntime() && !electronConfig.apiBaseUrl
      ? {
          ...electronConfig,
          apiBaseUrl: getElectronResolvedApiBaseUrl(),
        }
      : electronConfig

  return mergeRuntimeConfig(browserConfig, normalizedElectronConfig)
}

/**
 * 获取 API baseURL
 *
 * 优先级：Electron 外部配置 / runtime-config.js > VITE_API_BASE_URL > '/'
 */
export function getApiBaseUrl(): string {
  if (isFileProtocolRuntime()) {
    return getElectronResolvedApiBaseUrl() || '/'
  }

  return getRuntimeConfig().apiBaseUrl || import.meta.env.VITE_API_BASE_URL || '/'
}

export function hasAbsoluteApiBaseUrl() {
  return isSafeHttpUrl(getApiBaseUrl())
}

export function getElectronRuntimeConfigPath() {
  return isBrowserRuntime() ? window.electronAPI?.runtimeConfigPath || '' : ''
}

/**
 * 获取 Sentry 运行时配置
 *
 * 优先级：runtime.sentry.enable > VITE_SENTRY_ENABLE
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
