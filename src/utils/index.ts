import { useClipboard } from '@vueuse/core'

export * from './system'
export * from './token'

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 */
export async function copy(text: string) {
  await useClipboard().copy(text)
}
