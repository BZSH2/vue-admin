import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { settingConfig } from '@/config'
import { getToken, clearToken } from '@/utils'
import { useUserStore } from '@/stores/user'

/**
 * 是否需要执行一次“鉴权后的 replace 刷新”。
 *
 * 说明：当前项目还没有真正的“拉权限/拉菜单”逻辑，
 * 这里保留这个开关位，避免未来接入动态路由时出现首次进入不刷新的问题。
 */
let isHasFetchAuth = true

export async function createPermissionGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // 进入登录页时，重置鉴权开关：
  // 这样“退出登录 -> 再登录”也能重新触发一次首屏拉取逻辑。
  if (to.name === 'Login' || to.path === '/login') {
    isHasFetchAuth = true
  }

  const isWhiteRoute = settingConfig.routesWhiteList.includes(to.path)
  if (isWhiteRoute) {
    return next()
  }

  const hasToken = Boolean(getToken())
  if (!hasToken) {
    // 没有 token 时，重置鉴权开关，避免用户重新登录后不触发 replace 刷新
    isHasFetchAuth = true
    clearToken()
    return next(
      settingConfig.recordRoute
        ? { name: 'Login', query: { redirect: to.fullPath } }
        : { name: 'Login' }
    )
  }

  // 首次进入（或刷新后）可在这里拉取用户信息/权限/菜单，再装配动态路由
  if (isHasFetchAuth) {
    isHasFetchAuth = false

    // 目前先做最小闭环：拉一次个人信息（失败也不阻断首屏）
    // 后续如果接入“后端下发菜单/权限点”，也可以在这里扩展。
    try {
      const userStore = useUserStore()
      await userStore.ensureProfile()
    } catch {
      // ignore
    }

    return next({ ...to, replace: true })
  }

  return next()
}
