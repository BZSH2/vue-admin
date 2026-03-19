/** 多语言语言配置 */
import { languages } from '@/config'

declare global {
  namespace Lang {
    interface LangDist {
      /** 语言代码 */
      code: string
      /** 语言名称 */
      name: string
      /** 语言标志 */
      flag?: string
      /** 供 bing-translate-api 使用的独立代码（如果与 code 相同则可省略） */
      bingCode?: string
    }

    type LanguageType = (typeof languages)[number]
  }
}
