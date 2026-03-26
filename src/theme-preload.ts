import {
  getThemeFontSizeCssVarMap,
  isThemeFontSizeLevel,
  type ThemeFontSizeLevel,
} from '@/shared/theme/font-size.js'
import { isThemeMode } from '@/shared/theme/mode'
import type { ThemeMode, ThemeSnapshot } from '@/types/theme'

/**
 * 首屏主题预加载脚本（在应用主包执行前运行）
 *
 * 目标：
 * 1) 尽早恢复主题状态，避免首屏闪烁（FOUC）；
 * 2) 优先复用运行时写入的主题快照（themeSnapshot），减少首屏计算开销；
 * 3) 快照失效时回退到最小可用逻辑（仅根据 themeMode 恢复 dark/light）。
 */
const modeKey = 'themeMode'
const fontSizeKey = 'themeFontSizeLevel'
const snapshotKey = 'themeSnapshot'

/**
 * 安全 JSON 解析：
 * 本脚本处于首屏关键路径，解析失败不抛错，直接返回 null，
 * 让后续走兜底逻辑，避免阻断页面初始化。
 */
function safeParse(raw: string | null): unknown {
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const html = document.documentElement

/**
 * 统一回退策略：
 * 当快照不可用时，仅恢复 dark/light 的基础状态，
 * 以保证至少主题模式正确，复杂变量由运行时引擎接管。
 */
function applyFallbackByMode() {
  const modeValue = safeParse(localStorage.getItem(modeKey))
  const fallbackMode: ThemeMode = isThemeMode(modeValue) ? modeValue : 'light'
  const fontSizeValue = safeParse(localStorage.getItem(fontSizeKey))
  const fallbackFontSizeLevel: ThemeFontSizeLevel = isThemeFontSizeLevel(fontSizeValue)
    ? fontSizeValue
    : 'default'
  const fallbackDark =
    fallbackMode === 'system'
      ? Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches)
      : fallbackMode === 'dark'
  html.classList.toggle('dark', fallbackDark)
  html.setAttribute('data-theme-mode', fallbackMode)
  html.style.colorScheme = fallbackDark ? 'dark' : 'light'
  const fontSizeVars = getThemeFontSizeCssVarMap(fallbackFontSizeLevel)
  for (const name in fontSizeVars) {
    html.style.setProperty(name, fontSizeVars[name as keyof typeof fontSizeVars])
  }
}

/**
 * 优先读取主题快照：
 * 快照由运行时主题引擎生成并持久化，包含完整 CSS 变量映射，
 * 命中后可直接回放，避免首屏重复计算配色。
 */
const snapshotRaw = safeParse(localStorage.getItem(snapshotKey))
if (snapshotRaw && typeof snapshotRaw === 'object') {
  const snapshot = snapshotRaw as Partial<ThemeSnapshot> & Record<string, unknown>
  const mode = snapshot.mode
  const resolvedTheme = snapshot.resolvedTheme
  const brand = snapshot.brand
  const colorScheme = snapshot.colorScheme
  const vars = snapshot.vars
  /**
   * 快照字段完整性校验：
   * 仅保留必要且低成本的检查，确保安全与性能平衡。
   */
  if (
    isThemeMode(mode) &&
    (resolvedTheme === 'light' || resolvedTheme === 'dark') &&
    /**
     * 当前已移除预设品牌池，快照品牌应固定为 custom。
     * 若未来恢复多品牌，这里可同步放宽校验白名单。
     */
    brand === 'custom' &&
    (colorScheme === 'light' || colorScheme === 'dark') &&
    vars &&
    typeof vars === 'object' &&
    !Array.isArray(vars)
  ) {
    /**
     * 回放快照：
     * 1) 先恢复主题标记（class/data-attributes/colorScheme）
     * 2) 再批量写入 CSS 变量
     */
    html.classList.toggle('dark', Boolean(snapshot.isDark))
    html.setAttribute('data-theme-mode', mode)
    html.setAttribute('data-theme', resolvedTheme)
    html.setAttribute('data-theme-brand', brand)
    html.style.colorScheme = colorScheme
    /**
     * vars 为 key-value 的 CSS 变量集合（如 --el-color-primary）。
     * 仅写入字符串值，避免异常值污染 style。
     */
    for (const name in vars as Record<string, unknown>) {
      const value = (vars as Record<string, unknown>)[name]
      if (typeof value === 'string') {
        html.style.setProperty(name, value)
      }
    }
  } else {
    applyFallbackByMode()
  }
} else {
  applyFallbackByMode()
}
