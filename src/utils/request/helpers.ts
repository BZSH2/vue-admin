import type { AxiosError } from 'axios'
import { getElectronRuntimeConfigPath, hasAbsoluteApiBaseUrl } from '@/config/runtime'
import { settingConfig } from '@/config'
import { DEFAULT_RETRY, HTTP_STATUS_MSG } from './constants'

const isFileProtocol = () => window.location.protocol === 'file:'

function getMissingApiBaseUrlMessage(runtimeConfigPath: string) {
  return `Electron 安装包缺少可用的 API 地址，请修改 ${runtimeConfigPath} 中的 apiBaseUrl 为 http://你的后端地址。`
}

function resolveFileProtocolNetworkMessage(runtimeConfigPath: string) {
  return hasAbsoluteApiBaseUrl()
    ? '无法连接到接口服务，请检查后端服务是否启动、接口地址是否可达。'
    : getMissingApiBaseUrlMessage(runtimeConfigPath)
}

function resolveNetworkErrorMessage(message: string, runtimeConfigPath: string) {
  if (message.includes('fetch failed') || message.includes('Failed to fetch')) {
    return isFileProtocol() ? resolveFileProtocolNetworkMessage(runtimeConfigPath) : '网络连接异常'
  }

  if (message.includes('Network Error')) {
    return isFileProtocol() && !hasAbsoluteApiBaseUrl()
      ? getMissingApiBaseUrlMessage(runtimeConfigPath)
      : '网络连接异常'
  }

  return ''
}

/**
 * 解析统一响应体，兼容直接数据与业务包装结构
 */
export function resolveResponse<T>(data: Request.ApiResponse<T> | T) {
  const hasCode = typeof (data as Request.ApiResponse<T>)?.code !== 'undefined'
  const hasSuccess = typeof (data as Request.ApiResponse<T>)?.success !== 'undefined'

  if (!hasCode && !hasSuccess) {
    return { ok: true, data }
  }

  const code = (data as Request.ApiResponse<T>).code
  const success = (data as Request.ApiResponse<T>).success
  const ok = success === true || code === 0 || code === 200

  return {
    ok,
    code: code as number | string | undefined,
    message: (data as Request.ApiResponse<T>).message,
    data: (data as Request.ApiResponse<T>).data ?? (data as T),
  }
}

/**
 * 是否展示错误提示
 */
export function shouldShowError(config?: Request.RequestConfig) {
  return config?.showError !== false
}

/**
 * 构造统一错误对象
 */
export function createRequestError(payload: Request.RequestError): Request.RequestError {
  return payload
}

/**
 * 解析错误信息（状态码 / 超时 / 网络）
 */
export function resolveErrorMessage(error: AxiosError<any>) {
  const { response, message } = error
  const runtimeConfigPath = getElectronRuntimeConfigPath() || 'runtime-config.json'

  if (response) {
    const status = response.status
    return response.data?.message || HTTP_STATUS_MSG[status] || `请求失败(${status})`
  }

  if (message?.includes('Electron 安装包缺少可用的 API 地址')) {
    return message
  }

  if (message?.includes('timeout')) {
    return isFileProtocol()
      ? `请求超时，请检查接口服务是否可达；如果还没有配置接口地址，请修改 ${runtimeConfigPath} 中的 apiBaseUrl。`
      : '请求超时，请检查网络连接'
  }

  if (message) {
    const networkMessage = resolveNetworkErrorMessage(message, runtimeConfigPath)
    if (networkMessage) {
      return networkMessage
    }
  }

  return '网络请求失败'
}

/**
 * 判断是否满足重试条件
 */
export function shouldRetry(error: AxiosError<any>, config?: Request.RequestConfig) {
  if (!config) {
    return false
  }

  if (config.retry === 0) {
    return false
  }

  const maxRetry = config.retry ?? DEFAULT_RETRY
  const retryOn = config.retryOn

  return (
    (config._retryCount || 0) < maxRetry &&
    (retryOn
      ? retryOn(error)
      : !error.response || (error.response.status >= 500 && error.response.status < 600))
  )
}

/**
 * 跳转登录页（支持记录原路由）
 */
export function redirectToLogin() {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const useHashHistory = settingConfig.isHashRouterMode || isFileProtocol()
  const current = useHashHistory
    ? window.location.hash.replace(/^#/, '') || '/'
    : (() => {
        const rawPath = window.location.pathname.startsWith(normalizedBase)
          ? window.location.pathname.slice(normalizedBase.length)
          : window.location.pathname
        const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
        return `${normalizedPath}${window.location.search}`
      })()

  if (current.startsWith('/login')) {
    return
  }

  const loginBase = isFileProtocol()
    ? '#/login'
    : useHashHistory
      ? `${normalizedBase || ''}/#/login`
      : `${normalizedBase || ''}/login`
  const target = settingConfig.recordRoute
    ? `${loginBase}?redirect=${encodeURIComponent(current)}`
    : loginBase

  if (window.location.href.includes(target)) {
    return
  }

  window.location.href = target
}
