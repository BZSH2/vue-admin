import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { settingConfig } from '@/config'
import { getToken, clearToken } from '@/utils'

/** 是否有token */
const hasToken = Boolean(getToken())
/** 是否执行鉴权 */
let isHasFetchAuth = true

export async function createPermissionGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const router = useRouter()
  const isWhiteRoute = settingConfig.routesWhiteList.includes(to.path)

  const routeSwitches: Common.StrategicPattern[] = [
    // 在访问白名单
    {
      condition: isWhiteRoute,
      callback: () => next(),
    },
    // 如果没有权限
    {
      condition: !hasToken,
      callback: () => handleToLogin(),
    },
    // 刷新或者登录需要鉴权
    {
      condition: isHasFetchAuth,
      callback: async () => {
        isHasFetchAuth = false
        next({ ...to, replace: true })
      },
    },
    // 无需鉴权直接跳转
    {
      condition: !isHasFetchAuth,
      callback: () => next(),
    },
  ]
  routeSwitches.some(({ condition, callback }) => {
    if (condition) {callback()}
    return condition
  })

  /** 跳转登录 */
  function handleToLogin() {
    clearToken()
    router.push({
      name: 'Login',
    })
  }
}
