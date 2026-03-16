/**
 * 刷新 token 的处理函数
 *
 * - 由业务在应用启动时注入（例如在 main.ts 里调用 setRefreshTokenHandler）
 * - request 层只负责在 401 时调用它并重放请求
 */
let refreshTokenHandler: (() => Promise<string | null>) | null = null

/**
 * 刷新 token 的共享 Promise
 *
 * 目的：当多个请求同时 401 时，只刷新一次 token，其他请求复用同一个 Promise。
 */
let refreshPromise: Promise<string | null> | null = null

/**
 * 请求错误处理函数（UI 层注入）
 *
 * 目的：让 request 层不直接依赖 ElementPlus/Message 组件，
 * 只在需要提示时把结构化错误对象抛给上层。
 */
let requestErrorHandler: ((error: Request.RequestError) => void) | null = null

/** 设置刷新 token 的处理函数 */
export function setRefreshTokenHandler(handler: () => Promise<string | null>) {
  refreshTokenHandler = handler
}

/** 获取刷新 token 的处理函数 */
export function getRefreshTokenHandler() {
  return refreshTokenHandler
}

/** 设置刷新 token 的共享 Promise */
export function setRefreshPromise(promise: Promise<string | null> | null) {
  refreshPromise = promise
}

/** 获取刷新 token 的共享 Promise */
export function getRefreshPromise() {
  return refreshPromise
}

/** 设置请求错误处理函数（例如 UI 弹窗提示） */
export function setRequestErrorHandler(handler: (error: Request.RequestError) => void) {
  requestErrorHandler = handler
}

/** 获取请求错误处理函数 */
export function getRequestErrorHandler() {
  return requestErrorHandler
}
