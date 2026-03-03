import i18n from '@/i18n'
const { t, te } = i18n.global

export function getPageTitle(pageTitle: string | undefined) {
  const translatedPageTitle = t(`${pageTitle}`)
  return translatedPageTitle || pageTitle || ''
}
