import type { App } from 'vue'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { createRouterGuard } from './guard'
import { appRoutes } from './routes'

const { BASE_URL } = import.meta.env
const historyBase = (window as any).__POWERED_BY_QIANKUN__ ? '/micro/vue-admin' : BASE_URL

export const router = createRouter({
  history: createWebHashHistory(historyBase),
  routes: appRoutes as RouteRecordRaw[],
})

export function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
}

export default router
