import 'element-plus/theme-chalk/dark/css-vars.css'
import { destroyTheme, initTheme } from '@/composables/useTheme'

/**
 * 主题插件初始化入口。
 * - 提前注入 Element Plus 暗色变量能力
 * - 恢复用户主题配置并应用完整 CSS 变量
 * - 建立系统主题监听与主题桥接广播
 */
export function setupTheme() {
  initTheme()
}

/**
 * 主题插件卸载入口。
 * - 清理 matchMedia 监听器
 * - 清理过渡定时器，避免微前端重复挂载残留副作用
 */
export function teardownTheme() {
  destroyTheme()
}
