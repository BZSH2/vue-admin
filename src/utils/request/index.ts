import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, clearToken } from '@/utils/token'

/**
 * 扩展请求配置接口
 * @description 允许在请求级别配置是否显示错误信息等自定义选项
 */
interface RequestConfig extends AxiosRequestConfig {
  /** 是否需要显示错误信息，默认为 true */
  showError?: boolean
}

/**
 * HTTP 状态码错误信息映射
 */
const HTTP_STATUS_MSG: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '拒绝访问',
  404: '请求资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/', // 使用 Vite 的环境变量
  timeout: 10000, // 请求超时时间
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

/**
 * 请求拦截器
 * @description 在发送请求之前做些什么，例如添加 Token
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加 token
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
 * 响应拦截器
 * @description 对响应数据做点什么，例如处理错误码
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, status } = response

    // HTTP 状态码判断，2xx 视为成功
    if (status >= 200 && status < 300) {
      // TODO: 这里可以结合后端业务 Code 进行判断
      // 例如: if (data.code !== 200) return Promise.reject(new Error(data.message))
      return data
    }

    // 非 2xx 状态码的处理
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message || 'Error'))
  },
  (error: AxiosError<any>) => {
    handleError(error)
    return Promise.reject(error)
  }
)

/**
 * 统一错误处理函数
 * @param error Axios 错误对象
 */
function handleError(error: AxiosError<any>) {
  const { response, message } = error
  let errorMsg = '网络请求失败'

  if (response) {
    const { status, data } = response
    // 优先使用后端返回的 message，否则使用默认映射
    errorMsg = data?.message || HTTP_STATUS_MSG[status] || `请求失败(${status})`

    // 特殊状态码处理
    if (status === 401) {
      clearToken()
      // 避免重复跳转
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
  } else if (message.includes('timeout')) {
    errorMsg = '请求超时，请检查网络'
  } else if (message.includes('Network Error')) {
    errorMsg = '网络连接异常'
  }

  // 使用 Element Plus 显示错误消息
  // 可以通过配置过滤某些不需要显示的错误
  ElMessage.error({
    message: errorMsg,
    duration: 5 * 1000,
  })
}

/**
 * 封装后的请求方法
 * @description 提供了泛型支持，使返回值类型推断更加准确
 * @template T 响应数据的类型
 * @param config 请求配置
 * @returns Promise<T>
 */
function request<T = any>(config: RequestConfig): Promise<T> {
  return service.request<any, T>(config)
}

export default request
