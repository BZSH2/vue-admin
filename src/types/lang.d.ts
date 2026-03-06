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
    }

    type LanguageType = (typeof languages)[number]
  }
}
