import type { ThemeFontSizeLevel } from '@/shared/theme/font-size.js'

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

export interface ThemeBridgePalette {
  primary: string
  success: string
  warning: string
  danger: string
  info: string
}

export interface ThemeBridgePayload {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  brand: BrandThemeKey
  fontSizeLevel: ThemeFontSizeLevel
  palette: ThemeBridgePalette
  chartPalette: readonly string[]
  mapAccent: string
  semantic: ThemeSemanticTokens
}

export interface ThemeSnapshot {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  brand: BrandThemeKey
  colorScheme: ResolvedTheme
  isDark: boolean
  vars: Record<string, string>
}
