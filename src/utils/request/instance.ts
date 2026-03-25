import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { getApiBaseUrl } from '@/config/runtime'
import { getToken, clearToken, setToken } from '@/utils/token'
import { DEFAULT_RETRY_DELAY } from './constants'
import { electronAdapter, shouldUseElectronHttpBridge } from './electron-adapter'
import {
  createRequestError,
  redirectToLogin,
  resolveErrorMessage,
  resolveResponse,
  shouldRetry,
  shouldShowError,
} from './helpers'
import {
  getRefreshPromise,
  getRefreshTokenHandler,
  getRequestErrorHandler,
  setRefreshPromise,
} from './state'

/**
 * Axios 实例配置。
 * Electron 安装包会额外读取用户目录下的 runtime-config.json。
 */
const service: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  adapter: shouldUseElectronHttpBridge() ? electronAdapter : undefined,
})

/**
 * 按配置执行请求重试。
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
 * 统一向上抛出结构化错误。
 */
function rejectWithMessage(error: Request.RequestError, config?: Request.RequestConfig) {
  if (shouldShowError(config)) {
    const handler = getRequestErrorHandler()
    handler?.(error)
  }

  return Promise.reject(error)
}

/**
 * 构造并返回业务 / 网络错误。
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
 * 处理 401：刷新 token 并重放请求。
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
 * 请求拦截器：注入 token。
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 每次请求前都重新读取一次运行时地址与 Electron 请求桥，
    // 避免模块初始化过早时把旧的 baseURL / adapter 固化下来。
    if (!config.baseURL || config.baseURL === service.defaults.baseURL) {
      config.baseURL = getApiBaseUrl()
    }

    if (!config.adapter) {
      config.adapter = shouldUseElectronHttpBridge() ? electronAdapter : undefined
    }

    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: any) => {
    console.error('请求拦截器错误', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器：统一处理业务错误和网络错误。
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
 * 对外请求入口。
 */
export function request<T = any>(config: Request.RequestConfig): Promise<T> {
  return service.request<any, T>(config)
}
