import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { $baseMessage } from '@/composables/useMessage'
import { getToken, clearToken, setToken } from '@/utils/token'
import { DEFAULT_RETRY_DELAY } from './constants'
import {
  createRequestError,
  redirectToLogin,
  resolveErrorMessage,
  resolveResponse,
  shouldRetry,
  shouldShowError,
} from './helpers'
import { getRefreshPromise, getRefreshTokenHandler, setRefreshPromise } from './state'

/**
 * Axios 实例配置
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

/**
 * 重试请求（根据配置与策略）
 */
async function retryRequest(error: AxiosError<any>) {
  const config = error.config as Request.RequestConfig | undefined
  if (!config) {
    return Promise.reject(error)
  }
  if (!shouldRetry(error, config)) {
    return Promise.reject(error)
  }
  config._retryCount = (config._retryCount || 0) + 1
  const delay = config.retryDelay ?? DEFAULT_RETRY_DELAY
  if (delay > 0) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay)
    })
  }
  return service.request(config)
}

/**
 * 统一错误提示与拒绝
 */
function rejectWithMessage(error: Request.RequestError, config?: Request.RequestConfig) {
  if (shouldShowError(config)) {
    $baseMessage(error.message, 'error')
  }
  return Promise.reject(error)
}

/**
 * 构造并返回业务/网络错误
 * @param data 原始响应数据
 * @param status HTTP 状态码
 * @param config 原始请求配置
 * @param type 错误类型
 * @param message 覆盖的错误消息
 * @param code 业务错误码
 */
function handleResponseError(
  data: any,
  status: number | undefined,
  config: Request.RequestConfig | undefined,
  type: Request.RequestErrorType,
  message?: string,
  code?: number | string
) {
  const error = createRequestError({
    type,
    message: message || data?.message || (type === 'business' ? '业务处理失败' : '请求失败'),
    status,
    code: code ?? data?.code,
    data,
    config,
  })
  return rejectWithMessage(error, config)
}

/**
 * 处理 401：刷新 token 并重放请求
 */
async function handleUnauthorized(
  status: number | undefined,
  config: Request.RequestConfig | undefined
) {
  if (status !== 401 || !config || config._retry) {
    return null
  }
  const refreshHandler = getRefreshTokenHandler()
  if (refreshHandler) {
    try {
      config._retry = true
      let currentPromise = getRefreshPromise()
      if (!currentPromise) {
        currentPromise = refreshHandler().finally(() => {
          setRefreshPromise(null)
        })
        setRefreshPromise(currentPromise)
      }
      const newToken = await currentPromise
      if (newToken) {
        setToken(newToken)
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${newToken}`,
        }
        return service.request(config)
      }
    } catch {}
  }
  clearToken()
  redirectToLogin()
  return null
}

/**
 * 请求拦截器：注入 token
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器：统一业务/网络错误处理
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, status, config } = response
    const requestConfig = config as Request.RequestConfig
    if (status >= 200 && status < 300) {
      const resolved = resolveResponse(data)
      if (resolved.ok) {
        return resolved.data
      }
      return handleResponseError(
        data,
        status,
        requestConfig,
        'business',
        resolved.message,
        resolved.code
      )
    }
    return handleResponseError(data, status, requestConfig, 'network')
  },
  async (error: AxiosError<any>) => {
    const config = error.config as Request.RequestConfig | undefined
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }
    const status = error.response?.status
    const refreshed = await handleUnauthorized(status, config)
    if (refreshed) {
      return refreshed
    }
    try {
      return await retryRequest(error)
    } catch {
      const errorMessage = resolveErrorMessage(error)
      const mappedError = createRequestError({
        type:
          status === 401 || status === 403 ? 'permission' : error.response ? 'network' : 'unknown',
        message: errorMessage,
        status,
        data: error.response?.data,
        config,
      })
      return rejectWithMessage(mappedError, config)
    }
  }
)

/**
 * 对外请求入口
 */
export function request<T = any>(config: Request.RequestConfig): Promise<T> {
  return service.request<any, T>(config)
}
