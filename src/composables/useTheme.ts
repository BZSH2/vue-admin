import { settingConfig } from '@/config'
import { getStorage, setStorage } from '@/utils/storage'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'
export type BrandThemeKey = 'custom'

export interface BrandTheme {
  key: BrandThemeKey
  name: string
  primary: string
  success: string
  warning: string
  danger: string
  info: string
  mapAccent: string
  chartPalette: readonly string[]
}

export interface ThemeSemanticTokens {
  pageBg: string
  cardBg: string
  elevatedBg: string
  textPrimary: string
  textSecondary: string
  borderSoft: string
  onPrimary: string
  onSuccess: string
  onWarning: string
  onDanger: string
  onInfo: string
  borderOnPrimary: string
  borderOnSuccess: string
  borderOnWarning: string
  borderOnDanger: string
  borderOnInfo: string
  thirdPartyBg: string
  thirdPartySurface: string
  thirdPartyText: string
  thirdPartyBorder: string
}

/**
 * 主题广播事件名。
 * 任何需要“跟随主题”的第三方区域（图表/地图/微前端）都可以监听该事件。
 */
export const THEME_CHANGE_EVENT = 'va-theme-change'

type EventThemePalette = Pick<BrandTheme, 'primary' | 'success' | 'warning' | 'danger' | 'info'>
type ElementColorType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface ThemeBridgePayload {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  brand: BrandThemeKey
  palette: EventThemePalette
  chartPalette: readonly string[]
  mapAccent: string
  semantic: ThemeSemanticTokens
}

interface ThemeSnapshot {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  brand: BrandThemeKey
  colorScheme: 'light' | 'dark'
  isDark: boolean
  vars: Record<string, string>
}

/**
 * 本地存储键：
 * - themeMode/themePrimaryColor: 用户偏好输入
 * - themeSnapshot: 主题引擎的“可回放结果”，用于首屏快速恢复
 */
const modeStorageKey = 'themeMode' as const
const primaryColorStorageKey = 'themePrimaryColor' as const
const snapshotStorageKey = 'themeSnapshot' as const
const defaultThemeMode: ThemeMode = settingConfig.showDark ? 'dark' : 'light'
const defaultPrimaryColor = settingConfig.primaryColor
const presetThemeColors = [
  '#409eff',
  '#1684fc',
  '#13ce66',
  '#e6a23c',
  '#f56c6c',
  '#7a5af8',
  '#00bcd4',
  '#ff6b9a',
]

const themeMode = ref<ThemeMode>(defaultThemeMode)
const primaryColor = ref(defaultPrimaryColor)
const themeBrand = ref<BrandThemeKey>('custom')
const semanticTokens = ref<ThemeSemanticTokens>({
  pageBg: '#f5f7fb',
  cardBg: '#ffffff',
  elevatedBg: '#ffffff',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  borderSoft: '#d9e2ef',
  onPrimary: '#ffffff',
  onSuccess: '#ffffff',
  onWarning: '#111827',
  onDanger: '#ffffff',
  onInfo: '#ffffff',
  borderOnPrimary: '#ffffff',
  borderOnSuccess: '#ffffff',
  borderOnWarning: '#000000',
  borderOnDanger: '#ffffff',
  borderOnInfo: '#ffffff',
  thirdPartyBg: '#f8fafc',
  thirdPartySurface: '#ffffff',
  thirdPartyText: '#0f172a',
  thirdPartyBorder: '#d9e2ef',
})
const prefersDark = ref(false)
const isDark = computed(() =>
  themeMode.value === 'system' ? prefersDark.value : themeMode.value === 'dark'
)
const resolvedTheme = computed<ResolvedTheme>(() => (isDark.value ? 'dark' : 'light'))
const activeBrand = computed<BrandTheme>(() => getBrandTheme(primaryColor.value))

let initialized = false
let mediaQuery: MediaQueryList | null = null
let mediaListener: ((event: MediaQueryListEvent) => void) | null = null
let transitionTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 模式值解析：
 * 外部输入与存储值都可能不可信，这里统一做白名单约束。
 */
function parseThemeMode(value: unknown): ThemeMode | null {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value
  }
  return null
}

/**
 * 规范化 HEX 颜色：
 * - 仅接受 #RGB / #RRGGBB
 * - 输出统一为小写 #rrggbb
 */
function normalizeHexColor(value: string): string | null {
  const color = value.trim()
  if (!/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(color)) {
    return null
  }
  if (color.length === 4) {
    const [r, g, b] = color.slice(1).split('')
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return color.toLowerCase()
}

/**
 * 规范化 rgb/rgba 颜色：
 * - 仅接受 0~255 的整型通道
 * - alpha 只用于语法兼容，最终统一转成不透明 HEX
 */
function normalizeRgbColor(value: string): string | null {
  const color = value.trim()
  const match = color.match(
    /^rgba?\(\s*([01]?\d?\d|2[0-4]\d|25[0-5])\s*,\s*([01]?\d?\d|2[0-4]\d|25[0-5])\s*,\s*([01]?\d?\d|2[0-4]\d|25[0-5])(?:\s*,\s*(0|0?\.\d+|1(?:\.0+)?))?\s*\)$/i
  )
  if (!match) {
    return null
  }
  const [, r, g, b] = match
  const toHexByte = (channel: string) => Number.parseInt(channel, 10).toString(16).padStart(2, '0')
  return `#${toHexByte(r!)}${toHexByte(g!)}${toHexByte(b!)}`
}

/**
 * 统一颜色入口：
 * 优先 HEX，其次 RGB(A)，便于上层逻辑只处理一种颜色格式。
 */
function normalizeColor(value: string): string | null {
  return normalizeHexColor(value) || normalizeRgbColor(value)
}

/**
 * HEX 转 RGB，供混色、对比度等算法复用。
 */
function toRgb(color: string) {
  const normalized = normalizeColor(color)
  if (!normalized) {
    return null
  }
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  }
}

/**
 * 单通道转两位 HEX。
 */
function toHex(value: number) {
  return value.toString(16).padStart(2, '0')
}

/**
 * 基于线性插值的混色函数：
 * ratio=0 为 baseColor，ratio=1 为 mixColor。
 */
function mixWithColor(baseColor: string, mixColor: string, mixRate: number) {
  const base = toRgb(baseColor)
  const mix = toRgb(mixColor)
  if (!base || !mix) {
    return baseColor
  }
  const ratio = Math.min(Math.max(mixRate, 0), 1)
  const r = Math.round(base.r * (1 - ratio) + mix.r * ratio)
  const g = Math.round(base.g * (1 - ratio) + mix.g * ratio)
  const b = Math.round(base.b * (1 - ratio) + mix.b * ratio)
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * sRGB 通道转相对亮度通道（WCAG 标准）。
 */
function rgbToLuminanceChannel(value: number) {
  const channel = value / 255
  if (channel <= 0.03928) {
    return channel / 12.92
  }
  return ((channel + 0.055) / 1.055) ** 2.4
}

/**
 * 计算颜色相对亮度，用于可读性评估。
 */
function luminanceOf(color: string) {
  const rgb = toRgb(color)
  if (!rgb) {
    return 0
  }
  return (
    0.2126 * rgbToLuminanceChannel(rgb.r) +
    0.7152 * rgbToLuminanceChannel(rgb.g) +
    0.0722 * rgbToLuminanceChannel(rgb.b)
  )
}

/**
 * 对比度比值（WCAG）：
 * 返回值越大，前景与背景可读性越高。
 */
function contrastRatio(background: string, foreground: string) {
  const bg = luminanceOf(background)
  const fg = luminanceOf(foreground)
  const lighter = Math.max(bg, fg)
  const darker = Math.min(bg, fg)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * 自动挑选前景文本色：
 * 在白色与深色文本中选对比度更高的一项。
 */
function pickContrastText(background: string) {
  const white = '#ffffff'
  const dark = '#111827'
  return contrastRatio(background, white) >= contrastRatio(background, dark) ? white : dark
}

/**
 * 生成叠加在彩色背景上的边框色：
 * 在亮文本场景偏向提亮，在暗文本场景偏向压暗。
 */
function pickBorderOnColor(background: string, text: string) {
  return text === '#ffffff'
    ? mixWithColor(background, '#ffffff', 0.35)
    : mixWithColor(background, '#000000', 0.28)
}

/**
 * 根据主色动态推导业务色板。
 * 当前已移除预设品牌池，此函数即“单一来源”的配色生成器。
 */
function buildDerivedBusiness(primary: string) {
  const normalized = normalizeColor(primary) || defaultPrimaryColor
  return {
    success: mixWithColor(normalized, '#22c55e', 0.58),
    warning: mixWithColor(normalized, '#f59e0b', 0.62),
    danger: mixWithColor(normalized, '#ef4444', 0.62),
    info: mixWithColor(normalized, '#64748b', 0.55),
    mapAccent: mixWithColor(normalized, '#0ea5e9', 0.42),
    chartPalette: [
      normalized,
      mixWithColor(normalized, '#22c55e', 0.58),
      mixWithColor(normalized, '#f59e0b', 0.62),
      mixWithColor(normalized, '#a855f7', 0.5),
      mixWithColor(normalized, '#f43f5e', 0.52),
    ],
  }
}

/**
 * 生成当前活动主题对象（固定 custom 品牌）。
 */
function getBrandTheme(currentPrimary: string): BrandTheme {
  const normalized = normalizeColor(currentPrimary) || defaultPrimaryColor
  const derived = buildDerivedBusiness(normalized)
  return {
    key: 'custom',
    name: '自定义',
    primary: normalized,
    success: derived.success,
    warning: derived.warning,
    danger: derived.danger,
    info: derived.info,
    mapAccent: derived.mapAccent,
    chartPalette: derived.chartPalette,
  }
}

/**
 * 生成 Element Plus 色阶变量映射。
 */
function buildElementColorScaleVars(type: ElementColorType, color: string) {
  const normalized = normalizeColor(color)
  if (!normalized) {
    return {} as Record<string, string>
  }
  return {
    [`--el-color-${type}`]: normalized,
    [`--el-color-${type}-light-3`]: mixWithColor(normalized, '#ffffff', 0.3),
    [`--el-color-${type}-light-5`]: mixWithColor(normalized, '#ffffff', 0.5),
    [`--el-color-${type}-light-7`]: mixWithColor(normalized, '#ffffff', 0.7),
    [`--el-color-${type}-light-8`]: mixWithColor(normalized, '#ffffff', 0.8),
    [`--el-color-${type}-light-9`]: mixWithColor(normalized, '#ffffff', 0.9),
    [`--el-color-${type}-dark-2`]: mixWithColor(normalized, '#000000', 0.2),
  }
}

/**
 * 构建语义 Token。
 * 这里把“颜色值”提升为“语义角色”（页面底色、卡片底色、对比文本等），
 * 让业务组件只关心语义，不关心具体色值来源。
 */
function buildSemanticTokens(brand: BrandTheme): ThemeSemanticTokens {
  const mode = resolvedTheme.value
  const pageBg =
    mode === 'dark'
      ? mixWithColor('#0b1020', brand.primary, 0.08)
      : mixWithColor('#f8fafc', brand.primary, 0.06)
  const cardBg =
    mode === 'dark'
      ? mixWithColor('#111827', brand.primary, 0.12)
      : mixWithColor('#ffffff', brand.primary, 0.03)
  const elevatedBg =
    mode === 'dark'
      ? mixWithColor('#1f2937', brand.primary, 0.18)
      : mixWithColor('#ffffff', brand.primary, 0.12)
  const textPrimary = mode === 'dark' ? '#e5e7eb' : '#0f172a'
  const textSecondary = mode === 'dark' ? '#9ca3af' : '#64748b'
  const borderSoft =
    mode === 'dark'
      ? mixWithColor('#334155', brand.primary, 0.25)
      : mixWithColor('#cbd5e1', brand.primary, 0.2)
  const onPrimary = pickContrastText(brand.primary)
  const onSuccess = pickContrastText(brand.success)
  const onWarning = pickContrastText(brand.warning)
  const onDanger = pickContrastText(brand.danger)
  const onInfo = pickContrastText(brand.info)

  return {
    pageBg,
    cardBg,
    elevatedBg,
    textPrimary,
    textSecondary,
    borderSoft,
    onPrimary,
    onSuccess,
    onWarning,
    onDanger,
    onInfo,
    borderOnPrimary: pickBorderOnColor(brand.primary, onPrimary),
    borderOnSuccess: pickBorderOnColor(brand.success, onSuccess),
    borderOnWarning: pickBorderOnColor(brand.warning, onWarning),
    borderOnDanger: pickBorderOnColor(brand.danger, onDanger),
    borderOnInfo: pickBorderOnColor(brand.info, onInfo),
    thirdPartyBg: pageBg,
    thirdPartySurface: cardBg,
    thirdPartyText: textPrimary,
    thirdPartyBorder: borderSoft,
  }
}

/**
 * 输出完整 CSS 变量表：
 * 1) Element Plus 基础色阶（primary/success/warning/danger/info）
 * 2) 业务语义变量（va-*）
 * 3) 第三方桥接变量（chart/map/thirdparty）
 */
function buildThemeCssVarMap(brand: BrandTheme, tokens: ThemeSemanticTokens) {
  const scaleVars = {
    ...buildElementColorScaleVars('primary', brand.primary),
    ...buildElementColorScaleVars('success', brand.success),
    ...buildElementColorScaleVars('warning', brand.warning),
    ...buildElementColorScaleVars('danger', brand.danger),
    ...buildElementColorScaleVars('info', brand.info),
  }
  const semanticVars: Record<string, string> = {
    '--va-color-primary': brand.primary,
    '--va-color-success': brand.success,
    '--va-color-warning': brand.warning,
    '--va-color-danger': brand.danger,
    '--va-color-info': brand.info,
    '--va-bg-page': tokens.pageBg,
    '--va-bg-card': tokens.cardBg,
    '--va-bg-elevated': tokens.elevatedBg,
    '--va-text-primary': tokens.textPrimary,
    '--va-text-secondary': tokens.textSecondary,
    '--va-border-soft': tokens.borderSoft,
    '--va-on-primary': tokens.onPrimary,
    '--va-on-success': tokens.onSuccess,
    '--va-on-warning': tokens.onWarning,
    '--va-on-danger': tokens.onDanger,
    '--va-on-info': tokens.onInfo,
    '--va-border-on-primary': tokens.borderOnPrimary,
    '--va-border-on-success': tokens.borderOnSuccess,
    '--va-border-on-warning': tokens.borderOnWarning,
    '--va-border-on-danger': tokens.borderOnDanger,
    '--va-border-on-info': tokens.borderOnInfo,
    '--va-thirdparty-bg': tokens.thirdPartyBg,
    '--va-thirdparty-surface': tokens.thirdPartySurface,
    '--va-thirdparty-text': tokens.thirdPartyText,
    '--va-thirdparty-border': tokens.thirdPartyBorder,
    '--va-thirdparty-accent': brand.primary,
    '--va-map-accent': brand.mapAccent,
  }
  brand.chartPalette.forEach((color, index) => {
    semanticVars[`--va-chart-${index + 1}`] = color
  })
  return { ...scaleVars, ...semanticVars }
}

function applyThemeCssVarMap(cssVars: Record<string, string>) {
  const rootStyle = document.documentElement.style
  Object.entries(cssVars).forEach(([name, value]) => {
    rootStyle.setProperty(name, value)
  })
}

/**
 * 持久化首屏快照。
 * 该快照由 theme-preload.ts 在应用启动前回放，减少首屏计算与闪烁。
 */
function persistThemeSnapshot(cssVars: Record<string, string>) {
  const snapshot: ThemeSnapshot = {
    mode: themeMode.value,
    resolvedTheme: resolvedTheme.value,
    brand: themeBrand.value,
    colorScheme: isDark.value ? 'dark' : 'light',
    isDark: isDark.value,
    vars: cssVars,
  }
  setStorage(snapshotStorageKey, snapshot)
}

function applyMetaThemeColor(color: string) {
  const normalized = normalizeColor(color)
  if (!normalized) {
    return
  }
  let meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', normalized)
}

/**
 * 仅负责模式态同步（dark class / data-* / color-scheme）。
 * 具体色值与变量同步由 applyThemeColorSystem 负责。
 */
function applyThemeMode() {
  const html = document.documentElement
  html.classList.toggle('dark', isDark.value)
  html.setAttribute('data-theme-mode', themeMode.value)
  html.setAttribute('data-theme', resolvedTheme.value)
  html.setAttribute('data-theme-brand', themeBrand.value)
  html.style.colorScheme = isDark.value ? 'dark' : 'light'
}

function getThemeBridgePayload(brand: BrandTheme, tokens: ThemeSemanticTokens): ThemeBridgePayload {
  return {
    mode: themeMode.value,
    resolvedTheme: resolvedTheme.value,
    brand: themeBrand.value,
    palette: {
      primary: brand.primary,
      success: brand.success,
      warning: brand.warning,
      danger: brand.danger,
      info: brand.info,
    },
    chartPalette: brand.chartPalette,
    mapAccent: brand.mapAccent,
    semantic: tokens,
  }
}

/**
 * 主题变更事件广播：
 * 用于通知图表、地图、微前端等订阅方执行重绘/换肤。
 */
function dispatchThemeChange(brand: BrandTheme, tokens: ThemeSemanticTokens) {
  window.dispatchEvent(
    new CustomEvent<ThemeBridgePayload>(THEME_CHANGE_EVENT, {
      detail: getThemeBridgePayload(brand, tokens),
    })
  )
}

/**
 * 主题核心执行管线：
 * 1) 解析品牌与语义 Token
 * 2) 批量写入 CSS 变量
 * 3) 同步浏览器 theme-color
 * 4) 写入首屏快照
 * 5) 广播给第三方桥接订阅方
 */
function applyThemeColorSystem() {
  const brand = activeBrand.value
  const tokens = buildSemanticTokens(brand)
  semanticTokens.value = tokens
  primaryColor.value = brand.primary
  const cssVars = buildThemeCssVarMap(brand, tokens)
  applyThemeCssVarMap(cssVars)
  applyMetaThemeColor(brand.primary)
  persistThemeSnapshot(cssVars)
  dispatchThemeChange(brand, tokens)
}

function runThemeSwitchTransition() {
  const html = document.documentElement
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return
  }
  html.classList.add('theme-switching')
  if (transitionTimer) {
    clearTimeout(transitionTimer)
  }
  transitionTimer = setTimeout(() => {
    html.classList.remove('theme-switching')
    transitionTimer = null
  }, 260)
}

/**
 * 监听系统深浅色变化：
 * 仅在模式为 system 时响应，避免覆盖用户显式选择。
 */
function setupSystemThemeListener() {
  if (!window.matchMedia) {
    return
  }
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  prefersDark.value = mediaQuery.matches
  mediaListener = (event: MediaQueryListEvent) => {
    prefersDark.value = event.matches
    if (themeMode.value === 'system') {
      applyThemeMode()
      applyThemeColorSystem()
    }
  }
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', mediaListener)
    return
  }
  mediaQuery.addListener(mediaListener)
}

/**
 * 从本地存储恢复用户偏好：
 * 快照恢复在 theme-preload.ts 做，这里恢复“配置输入”即可。
 */
function loadThemeFromStorage() {
  const savedMode = parseThemeMode(getStorage(modeStorageKey))
  const savedPrimaryColor = normalizeColor(getStorage(primaryColorStorageKey) || '')
  themeMode.value = savedMode || defaultThemeMode
  primaryColor.value = savedPrimaryColor || defaultPrimaryColor
  themeBrand.value = 'custom'
}

/**
 * 解绑系统主题监听器，避免重复注册与内存泄漏。
 */
function removeSystemThemeListener() {
  if (!mediaQuery || !mediaListener) {
    return
  }
  if (mediaQuery.removeEventListener) {
    mediaQuery.removeEventListener('change', mediaListener)
  } else {
    mediaQuery.removeListener(mediaListener)
  }
  mediaQuery = null
  mediaListener = null
}

/**
 * 初始化主题运行时：
 * 恢复配置 -> 绑定系统监听 -> 同步模式态 -> 写入完整变量。
 */
export function initTheme() {
  if (initialized) {
    return
  }
  initialized = true
  loadThemeFromStorage()
  setupSystemThemeListener()
  applyThemeMode()
  applyThemeColorSystem()
}

/**
 * 主题生命周期清理。
 * 微前端场景下在 unmount 调用，避免重复挂载导致监听器残留。
 */
export function destroyTheme() {
  removeSystemThemeListener()
  if (transitionTimer) {
    clearTimeout(transitionTimer)
    transitionTimer = null
  }
  initialized = false
}

/**
 * 提供给第三方组件的主题桥接订阅。
 * 调用后可实时收到主题变化，适合触发图表重绘或地图样式切换。
 */
export function useThemeBridge(handler: (payload: ThemeBridgePayload) => void) {
  initTheme()
  const onThemeChanged = (event: Event) => {
    const customEvent = event as CustomEvent<ThemeBridgePayload>
    handler(customEvent.detail)
  }
  onMounted(() => {
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChanged as EventListener)
    handler(getThemeBridgePayload(activeBrand.value, semanticTokens.value))
  })
  onBeforeUnmount(() => {
    window.removeEventListener(THEME_CHANGE_EVENT, onThemeChanged as EventListener)
  })
}

/**
 * 应用层主题 API：
 * - setThemeMode: 切换模式
 * - setPrimaryColor: 自定义主色
 */
export function useTheme() {
  initTheme()

  const setThemeMode = (mode: ThemeMode) => {
    const normalizedMode = parseThemeMode(mode)
    if (!normalizedMode || themeMode.value === normalizedMode) {
      return
    }
    runThemeSwitchTransition()
    themeMode.value = normalizedMode
    setStorage(modeStorageKey, normalizedMode)
    applyThemeMode()
    applyThemeColorSystem()
  }

  const setPrimaryColor = (color: string) => {
    const normalized = normalizeColor(color)
    if (!normalized || primaryColor.value === normalized) {
      return
    }
    primaryColor.value = normalized
    setStorage(primaryColorStorageKey, normalized)
    applyThemeMode()
    applyThemeColorSystem()
  }

  const toggleTheme = () => {
    setThemeMode(isDark.value ? 'light' : 'dark')
  }

  const resetTheme = () => {
    setThemeMode(defaultThemeMode)
    setPrimaryColor(defaultPrimaryColor)
  }

  return {
    themeMode: readonly(themeMode),
    resolvedTheme: readonly(resolvedTheme),
    isDark: readonly(isDark),
    themeBrand: readonly(themeBrand),
    activeBrand: readonly(activeBrand),
    primaryColor: readonly(primaryColor),
    semanticTokens: readonly(semanticTokens),
    presetThemeColors,
    setThemeMode,
    setPrimaryColor,
    toggleTheme,
    resetTheme,
  }
}
