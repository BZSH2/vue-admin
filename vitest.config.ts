import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, configDefaults, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(async (configEnv) => {
  // 显式加载 vite.config.ts 的配置
  const userViteConfig = await (typeof viteConfig === 'function'
    ? viteConfig(configEnv)
    : viteConfig)

  return mergeConfig(
    userViteConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    })
  )
})
