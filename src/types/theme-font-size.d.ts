declare module '@/shared/theme/font-size.js' {
  export type ThemeFontSizeLevel = 'small' | 'default' | 'large'

  export interface ThemeFontSizeOption {
    value: ThemeFontSizeLevel
    label: string
    description: string
  }

  export const THEME_FONT_SIZE_LEVELS: readonly ThemeFontSizeLevel[]
  export const THEME_FONT_SIZE_OPTIONS: readonly ThemeFontSizeOption[]
  export const THEME_FONT_SIZE_CSS_VAR_MAPS: Record<ThemeFontSizeLevel, Record<string, string>>
  export const THEME_FONT_SIZE_TOKEN_BY_PX: Record<string, string>

  export function isThemeFontSizeLevel(value: unknown): value is ThemeFontSizeLevel
  export function getThemeFontSizeCssVarMap(
    level: ThemeFontSizeLevel | string
  ): Record<string, string>
  export function getThemeFontSizeTokenByPx(value: unknown): string | null
}
