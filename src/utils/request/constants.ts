/** 默认重试次数 */
export const DEFAULT_RETRY = 1
/** 默认重试延迟（毫秒） */
export const DEFAULT_RETRY_DELAY = 300

/** HTTP 状态码文案映射 */
export const HTTP_STATUS_MSG: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '拒绝访问',
  404: '请求资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
}
