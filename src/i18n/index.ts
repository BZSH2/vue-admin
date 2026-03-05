// src/i18n/index.js
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { loadMessages } from './merge'
import { defaultLang, languages, type LanguageType } from '../config'

// 获取用户浏览器首选语言
function getBrowserLocale() {
  return navigator.language
}

// 保存语言设置
export function saveLocale(locale: LanguageType) {
  try {
    localStorage.setItem('locale', locale)
    document.documentElement.setAttribute('lang', locale)
  } catch (e) {
    console.error('Failed to save locale:', e)
  }
}

// 加载语言设置
export function loadLocale() {
  try {
    return localStorage.getItem('locale') || getBrowserLocale() || defaultLang
  } catch (e) {
    console.error('Failed to load locale:', e)
    return defaultLang
  }
}

const loadedLocales = new Set<LanguageType>()

async function ensureLocaleMessages(lang: LanguageType) {
  if (loadedLocales.has(lang)) {
    return true
  }
  const messages = await loadMessages(lang)
  if (!messages) {
    return false
  }
  i18n.global.setLocaleMessage(lang, messages)
  loadedLocales.add(lang)
  return true
}

// 导出切换语言的方法
export async function setLang(lang: LanguageType) {
  const loaded = await ensureLocaleMessages(lang)
  if (loaded) {
    i18n.global.locale.value = lang
    saveLocale(lang)
    return true
  }
  console.warn(`Lang "${lang}" is not available`)
  return false
}

// 获取当前语言
export function getCurrentLang() {
  return i18n.global.locale.value
}

// 获取可用语言列表
export function getAvailableLocales() {
  return languages
}

// 监听语言变化
export function onLangChange(callback: (lang: LanguageType) => void) {
  const watchStop = watch(
    () => i18n.global.locale.value,
    (newLang) => {
      callback(newLang as LanguageType)
    }
  )
  return watchStop
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: loadLocale(), // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages: {},
  globalInjection: true, // 全局注入 $t 等方法
})

export async function setupI18n(app: App) {
  const locale = loadLocale() as LanguageType
  await ensureLocaleMessages(locale)
  i18n.global.locale.value = locale
  app.use(i18n)
}

export default i18n
