/** 刷新 token 的处理函数 */
let refreshTokenHandler: (() => Promise<string | null>) | null = null
/** 刷新 token 的共享 Promise */
let refreshPromise: Promise<string | null> | null = null

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
