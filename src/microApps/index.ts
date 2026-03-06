import { registerMicroApps, start } from 'qiankun'
import { microApps } from './config'

/**
 * 初始化 qiankun 微前端
 * - 如 microApps 为空则不做任何处理，保持应用为普通单体应用
 * - 如配置了子应用，则注册并启动 qiankun 运行时
 */
export function setupQiankun() {
  if (!microApps.length) {
    return
  }
  registerMicroApps(microApps)
  start()
}
