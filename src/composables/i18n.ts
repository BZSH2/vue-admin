import i18n from '@/i18n'

const { t, te } = i18n.global

function translateTitle(title: string, ...args: any[]) {
  // @ts-ignore
  if (te(title)) {return t(title, args)}
  return title
}

export { translateTitle as $t }
