import Cookies from 'js-cookie'

const ADMIN_TOKEN = 'admin_token'

const isBrowserRuntime = () => typeof window !== 'undefined'

// Electron 安装包运行在 file:// 下时，Cookie 持久化并不稳定。
// 这里统一切到 localStorage，避免登录成功后又被路由守卫判定为未登录。
const isElectronFileRuntime = () => isBrowserRuntime() && window.location.protocol === 'file:'

function getLocalStorage() {
  if (!isBrowserRuntime()) {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

/** 设置 token */
export function setToken(token: string) {
  const normalizedToken = String(token)

  if (isElectronFileRuntime()) {
    getLocalStorage()?.setItem(ADMIN_TOKEN, normalizedToken)
    return normalizedToken
  }

  return Cookies.set(ADMIN_TOKEN, normalizedToken)
}

/** 获取 token */
export function getToken() {
  if (isElectronFileRuntime()) {
    return getLocalStorage()?.getItem(ADMIN_TOKEN) || Cookies.get(ADMIN_TOKEN)
  }

  return Cookies.get(ADMIN_TOKEN)
}

/** 移除 token */
export function clearToken() {
  getLocalStorage()?.removeItem(ADMIN_TOKEN)
  return Cookies.remove(ADMIN_TOKEN)
}
