const modules = import.meta.glob('./lang/*.json')

export type LocaleMessages = Record<string, any>

export async function loadMessages(lang: string): Promise<LocaleMessages | null> {
  const moduleKey = `./lang/${lang}.json`
  const loader = modules[moduleKey]
  if (!loader) {
    console.warn(`多语言文件类型${lang}缺失，运行 "pnpm openI18n" 初始化`)
    return null
  }
  const mod = await loader()
  return (mod as { default?: LocaleMessages }).default || null
}
