import { config } from './config'
import { langDict, languages, defaultLang } from './lang'
import { settingConfig } from './setting.config'

export { config, defaultLang, langDict, languages, settingConfig }

export default {
  ...settingConfig,
  ...config,
  languages,
  langDict,
  defaultLang,
}
