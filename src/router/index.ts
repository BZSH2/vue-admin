import type { App } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import { createRouterGuard } from './guard'
import { appRoutes } from './routes'
import config from '@/config'

const { BASE_URL } = import.meta.env
const historyBase = (window as any).__POWERED_BY_QIANKUN__ ? '/micro/vue-admin' : BASE_URL

export const router = createRouter({
  history: config.isHashRouterMode
    ? createWebHashHistory(historyBase)
    : createWebHistory(historyBase),
  routes: appRoutes as RouteRecordRaw[],
})

export function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
}

export default router
