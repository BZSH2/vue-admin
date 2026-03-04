import { settingConfig } from './setting.config'

export const langDict: Lang.LangDist[] = [
  { code: 'zh-CN', name: '中文(简体)', flag: 'cn' },
  { code: 'zh-TW', name: '中文(繁體)', flag: 'tw' },
  { code: 'en', name: 'English', flag: 'us' },
  { code: 'ja', name: '日本語', flag: 'jp' },
  { code: 'ko', name: '한국어', flag: 'kr' },
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'ru', name: 'Русский', flag: 'ru' },
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: 'br' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: 'pt' },
  { code: 'it', name: 'Italiano', flag: 'it' },
  { code: 'nl', name: 'Nederlands', flag: 'nl' },
  { code: 'tr', name: 'Türkçe', flag: 'tr' },
  { code: 'ar', name: 'العربية', flag: 'sa' },
  { code: 'he', name: 'עברית', flag: 'il' },
  { code: 'hi', name: 'हिन्दी', flag: 'in' },
  { code: 'id', name: 'Bahasa Indonesia', flag: 'id' },
  { code: 'ms', name: 'Bahasa Melayu', flag: 'my' },
  { code: 'th', name: 'ไทย', flag: 'th' },
  { code: 'vi', name: 'Tiếng Việt', flag: 'vn' },
  { code: 'pl', name: 'Polski', flag: 'pl' },
  { code: 'uk', name: 'Українська', flag: 'ua' },
  { code: 'cs', name: 'Čeština', flag: 'cz' },
]

export const languages = langDict.map((item) => item.code) // 支持的语言列表

export const defaultLang = settingConfig.i18n // 默认语言

export type LanguageType = (typeof languages)[number]
