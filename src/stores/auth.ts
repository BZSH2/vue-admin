import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  authControllerLogin,
  authControllerLogout,
  authControllerRefreshTokens,
} from '@/api/LoginModule/Auth'
import {
  clearToken as clearPersistedToken,
  getToken as getPersistedToken,
  setToken as setPersistedToken,
} from '@/utils/token'

/**
 * 从接口返回里尽可能稳妥地取出 token。
 *
 * 注意：request 拦截器会把后端的 { code, data } 解包成 data，所以这里要同时兼容：
 * - { accessToken }
 * - { token }
 * - { data: { accessToken } }
 */
function pickToken(payload: any): string | null {
  const direct = payload?.accessToken || payload?.token
  const nested = payload?.data?.accessToken || payload?.data?.token
  const token = direct || nested
  return token ? String(token) : null
}

export const useAuthStore = defineStore('auth', () => {
  /**
   * token 的“响应式缓存”。
   *
   * 真正的持久化来源统一由 `utils/token` 负责：
   * - Web 端走 Cookie
   * - Electron 安装包走 localStorage
   */
  const token = ref<string>(getPersistedToken() || '')

  const isLoggedIn = computed(() => Boolean(token.value))

  /** 同步持久化 token -> store（例如页面刷新后） */
  function syncTokenFromStorage() {
    token.value = getPersistedToken() || ''
  }

  /** 写入 token（同时写入持久化存储） */
  function setToken(newToken: string) {
    token.value = String(newToken)
    setPersistedToken(String(newToken))
  }

  /** 清理 token（同时清理持久化存储） */
  function clearToken() {
    token.value = ''
    clearPersistedToken()
  }

  /** 登录（可选：页面也可以继续自己调用 API） */
  async function login(payload: { phoneNumber: string; password: string }) {
    const res = await authControllerLogin(payload)
    const newToken = pickToken(res)
    if (newToken) {
      setToken(newToken)
    }
    return res
  }

  /** 登出：无论接口是否成功，都清理本地 token */
  async function logout() {
    try {
      await authControllerLogout({ showError: false, retry: 0 })
    } catch {
      // ignore
    } finally {
      clearToken()
    }
  }

  /**
   * 刷新 token（给 request 层 401 自动重试用）
   *
   * 返回：
   * - string：刷新成功的新 token
   * - null：刷新失败
   */
  async function refreshToken(): Promise<string | null> {
    try {
      // 注意：refresh 本身如果返回 401，不应该再次触发“自动刷新”逻辑，否则会递归。
      // 这里通过 `_retry: true` 告诉 request 层跳过 401 自动刷新。
      const res = await authControllerRefreshTokens({ showError: false, retry: 0, _retry: true })
      const newToken = pickToken(res)
      if (newToken) {
        setToken(newToken)
        return newToken
      }
    } catch {
      // ignore
    }
    return null
  }

  return {
    token,
    isLoggedIn,
    syncTokenFromStorage,
    setToken,
    clearToken,
    login,
    logout,
    refreshToken,
  }
})
