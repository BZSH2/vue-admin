import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { getApiBaseUrl, getElectronRuntimeConfigPath, isSafeHttpUrl } from '@/config/runtime'

const isFileProtocol = () => typeof window !== 'undefined' && window.location.protocol === 'file:'

export const shouldUseElectronHttpBridge = () => isFileProtocol() && !!window.electronAPI?.request

// Axios 传给自定义 adapter 的 baseURL 在不同场景下不一定稳定，
// 这里统一回退到运行时已经解析好的 Electron API 地址。
function resolveElectronRequestBaseUrl(config: InternalAxiosRequestConfig) {
  if (typeof config.baseURL === 'string' && isSafeHttpUrl(config.baseURL)) {
    return config.baseURL
  }

  const runtimeApiBaseUrl = getApiBaseUrl()
  return isSafeHttpUrl(runtimeApiBaseUrl) ? runtimeApiBaseUrl : undefined
}

function normalizeHeaders(headers: InternalAxiosRequestConfig['headers']) {
  const rawHeaders =
    headers && typeof (headers as { toJSON?: () => Record<string, unknown> }).toJSON === 'function'
      ? (headers as { toJSON: () => Record<string, unknown> }).toJSON()
      : (headers ?? {})

  return Object.fromEntries(
    Object.entries(rawHeaders).flatMap(([key, value]) => {
      if (value === null || typeof value === 'undefined') {
        return []
      }

      return [[key, Array.isArray(value) ? value.join(', ') : String(value)]]
    })
  )
}

function createMissingApiBaseUrlError(config: InternalAxiosRequestConfig) {
  const runtimeConfigPath = getElectronRuntimeConfigPath() || 'runtime-config.json'

  return new AxiosError(
    `Electron 安装包缺少可用的 API 地址，请修改 ${runtimeConfigPath} 中的 apiBaseUrl 为 http://你的后端地址`,
    'ERR_NETWORK',
    config
  )
}

export const electronAdapter: AxiosAdapter = async (config) => {
  const electronRequest = window.electronAPI?.request

  if (!electronRequest) {
    throw new AxiosError('Electron 请求桥不可用', 'ERR_NETWORK', config)
  }

  const hasAbsoluteRequestUrl = typeof config.url === 'string' && /^https?:\/\//i.test(config.url)
  const resolvedBaseURL = resolveElectronRequestBaseUrl(config)

  if (!hasAbsoluteRequestUrl && !resolvedBaseURL) {
    throw createMissingApiBaseUrlError(config)
  }

  try {
    const response = await electronRequest({
      url: config.url,
      method: config.method,
      baseURL: resolvedBaseURL,
      headers: normalizeHeaders(config.headers),
      params:
        config.params && typeof config.params === 'object'
          ? (config.params as Record<string, unknown>)
          : undefined,
      data: config.data,
      timeout: config.timeout,
    })

    const axiosResponse: AxiosResponse = {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config,
      request: null,
    }

    if (!config.validateStatus || config.validateStatus(response.status)) {
      return axiosResponse
    }

    throw new AxiosError(
      `Request failed with status code ${response.status}`,
      response.status >= 500 ? 'ERR_BAD_RESPONSE' : 'ERR_BAD_REQUEST',
      config,
      null,
      axiosResponse
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error
    }

    throw new AxiosError(
      error instanceof Error ? error.message : 'Electron 请求失败',
      'ERR_NETWORK',
      config
    )
  }
}
