import type { ThemeMode } from '@/types/theme'

export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system']

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && THEME_MODES.includes(value as ThemeMode)
}
