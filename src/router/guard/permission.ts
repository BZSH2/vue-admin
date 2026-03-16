import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { settingConfig } from '@/config'
import { getToken, clearToken } from '@/utils'

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

  // 预留：首次进入（或刷新后）可在这里拉取权限/菜单，再装配动态路由
  if (isHasFetchAuth) {
    isHasFetchAuth = false
    return next({ ...to, replace: true })
  }

  return next()
}
