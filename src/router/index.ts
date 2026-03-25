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
const isFileProtocol = window.location.protocol === 'file:'
const useHashHistory = config.isHashRouterMode || isFileProtocol
const historyBase = (window as any).__POWERED_BY_QIANKUN__
  ? '/micro/vue-admin'
  : isFileProtocol
    ? ''
    : BASE_URL

export const router = createRouter({
  // Electron 安装包通过 file:// 启动，强制切到 hash 路由以兼容本地文件路径。
  history: useHashHistory ? createWebHashHistory(historyBase) : createWebHistory(historyBase),
  routes: appRoutes as RouteRecordRaw[],
})

export function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
}

export default router
