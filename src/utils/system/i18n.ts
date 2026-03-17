import i18n from '@/i18n'
import { settingConfig } from '@/config'

const { t } = i18n.global

export function getPageTitle(pageTitle: string | undefined) {
  const { title, titleSeparator } = settingConfig
  if (pageTitle) {
    const msg = t(`${pageTitle}`)
    return `${msg}${titleSeparator}${title}`
  }
  return title
}
