export const THEME_FONT_SIZE_LEVELS = ['small', 'default', 'large']

export const THEME_FONT_SIZE_OPTIONS = [
  {
    value: 'small',
    label: '紧凑',
    description: '13px 基础字号，适合高信息密度场景。',
  },
  {
    value: 'default',
    label: '默认',
    description: '14px 基础字号，保持当前阅读节奏。',
  },
  {
    value: 'large',
    label: '舒适',
    description: '16px 基础字号，适合更宽松的阅读体验。',
  },
]

export const THEME_FONT_SIZE_CSS_VAR_MAPS = {
  small: {
    '--va-font-size-body': '13px',
    '--va-font-size-xs': '11px',
    '--va-font-size-sm': '13px',
    '--va-font-size-md': '15px',
    '--va-font-size-lg': '17px',
    '--va-font-size-xl': '20px',
    '--el-font-size-extra-small': '11px',
    '--el-font-size-small': '12px',
    '--el-font-size-base': '13px',
    '--el-font-size-medium': '13px',
    '--el-font-size-large': '15px',
    '--el-font-size-extra-large': '18px',
  },
  default: {
    '--va-font-size-body': '14px',
    '--va-font-size-xs': '12px',
    '--va-font-size-sm': '14px',
    '--va-font-size-md': '16px',
    '--va-font-size-lg': '18px',
    '--va-font-size-xl': '22px',
    '--el-font-size-extra-small': '12px',
    '--el-font-size-small': '13px',
    '--el-font-size-base': '14px',
    '--el-font-size-medium': '14px',
    '--el-font-size-large': '16px',
    '--el-font-size-extra-large': '20px',
  },
  large: {
    '--va-font-size-body': '16px',
    '--va-font-size-xs': '13px',
    '--va-font-size-sm': '15px',
    '--va-font-size-md': '18px',
    '--va-font-size-lg': '20px',
    '--va-font-size-xl': '24px',
    '--el-font-size-extra-small': '13px',
    '--el-font-size-small': '14px',
    '--el-font-size-base': '16px',
    '--el-font-size-medium': '16px',
    '--el-font-size-large': '18px',
    '--el-font-size-extra-large': '22px',
  },
}

export const THEME_FONT_SIZE_TOKEN_BY_PX = {
  '12px': 'var(--va-font-size-xs)',
  '13px': 'var(--el-font-size-small)',
  '14px': 'var(--va-font-size-sm)',
  '16px': 'var(--va-font-size-md)',
  '18px': 'var(--va-font-size-lg)',
  '20px': 'var(--el-font-size-extra-large)',
  '22px': 'var(--va-font-size-xl)',
}

export function isThemeFontSizeLevel(value) {
  return THEME_FONT_SIZE_LEVELS.includes(value)
}

export function getThemeFontSizeCssVarMap(level) {
  return THEME_FONT_SIZE_CSS_VAR_MAPS[level] || THEME_FONT_SIZE_CSS_VAR_MAPS.default
}

export function getThemeFontSizeTokenByPx(value) {
  if (typeof value !== 'string') {
    return null
  }
  return THEME_FONT_SIZE_TOKEN_BY_PX[value.trim()] || null
}
