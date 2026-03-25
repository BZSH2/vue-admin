import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { settingConfig } from '@/config'
import { getToken, clearToken } from '@/utils'
import { useUserStore } from '@/stores/user'

/**
 * 是否需要执行一次“登录后的首屏初始化”。
 *
 * 说明：当前项目还没有真正的“拉权限/拉菜单”逻辑，
 * 这里只在首次放行前预拉一次用户信息。
 *
 * 之所以不再做 `next({ ...to, replace: true })` 的二次跳转，
 * 是因为 Electron 安装包运行在 `file:// + hash` 场景时，
 * 首次登录后的“同地址再次 replace”更容易触发重复导航或停留在登录页。
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
    // 没有 token 时，重置鉴权开关，确保用户重新登录后还能重新执行一次首屏初始化。
    isHasFetchAuth = true
    clearToken()
    return next(
      settingConfig.recordRoute
        ? { name: 'Login', query: { redirect: to.fullPath } }
        : { name: 'Login' }
    )
  }

  // 首次进入（或刷新后）可在这里拉取用户信息/权限/菜单。
  // 当前项目没有动态路由装配需求，因此初始化完成后直接放行即可。
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
  }

  return next()
}
