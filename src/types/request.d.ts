import type { AxiosError, AxiosRequestConfig } from 'axios'

declare global {
  namespace Request {
    /**
     * 请求级别配置扩展
     * 用于控制错误提示与重试等行为
     */
    export interface RequestConfig extends AxiosRequestConfig {
      /** 是否展示错误提示 */
      showError?: boolean
      /** 最大重试次数 */
      retry?: number
      /** 重试延迟（毫秒） */
      retryDelay?: number
      /** 自定义重试判断 */
      retryOn?: (error: AxiosError<any>) => boolean
      /** 内部标记：是否已做过 401 重试 */
      _retry?: boolean
      /** 内部标记：当前重试次数 */
      _retryCount?: number
    }

    /**
     * 统一错误类型（网络/业务/权限/未知）
     */
    export type RequestErrorType = 'network' | 'business' | 'permission' | 'unknown'

    /**
     * 统一错误对象结构
     */
    export interface RequestError {
      /** 错误类型 */
      type: RequestErrorType
      /** 错误信息 */
      message: string
      /** HTTP 状态码 */
      status?: number
      /** 业务错误码 */
      code?: number | string
      /** 原始返回数据 */
      data?: any
      /** 原始请求配置 */
      config?: AxiosRequestConfig
    }

    /**
     * 通用业务响应体
     */
    export interface ApiResponse<T = any> {
      /** 业务状态码 */
      code?: number | string
      /** 响应数据 */
      data?: T
      /** 提示信息 */
      message?: string
      /** 业务是否成功 */
      success?: boolean
    }
  }
}
