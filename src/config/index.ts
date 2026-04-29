import { config } from './config'
import { langDict, languages, defaultLang } from './lang'
import { settingConfig } from './setting.config'
import { scrollConfig } from './scroll.config'

export { config, defaultLang, langDict, languages, settingConfig, scrollConfig }

export default {
  ...settingConfig,
  ...config,
  languages,
  langDict,
  defaultLang,
}
