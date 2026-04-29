import { useClipboard } from '@vueuse/core'

export * from './system'
export * from './token'

export async function copy(text: string) {
  await useClipboard().copy(text)
}
