import type { AxiosError } from 'axios'
import { settingConfig } from '@/config'
import { DEFAULT_RETRY, HTTP_STATUS_MSG } from './constants'

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
 * 解析错误信息（状态码/超时/网络）
 */
export function resolveErrorMessage(error: AxiosError<any>) {
  const { response, message } = error
  if (response) {
    const status = response.status
    return response.data?.message || HTTP_STATUS_MSG[status] || `请求失败(${status})`
  }
  if (message?.includes('timeout')) {
    return '请求超时，请检查网络'
  }
  if (message?.includes('Network Error')) {
    return '网络连接异常'
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
  const current = window.location.hash.replace(/^#/, '') || '/'
  if (current.startsWith('/login')) {
    return
  }
  const loginBase = '/#/login'
  const target = settingConfig.recordRoute
    ? `${loginBase}?redirect=${encodeURIComponent(current)}`
    : loginBase
  if (window.location.href.includes(target)) {
    return
  }
  window.location.href = target
}
