import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from '@unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createViteProxy } from './build'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import config from './src/config'
import viteCompression from 'vite-plugin-compression'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
// 根据资源后缀推断 preload 的 as 类型
const getPreloadAs = (href: string) => {
  const lowerHref = href.toLowerCase()
  if (lowerHref.endsWith('.css')) {
    return 'style'
  }
  if (lowerHref.endsWith('.js')) {
    return 'script'
  }
  if (lowerHref.endsWith('.woff2')) {
    return 'font'
  }
  if (lowerHref.endsWith('.woff')) {
    return 'font'
  }
  if (lowerHref.endsWith('.ttf')) {
    return 'font'
  }
  if (lowerHref.endsWith('.svg')) {
    return 'image'
  }
  if (lowerHref.endsWith('.png')) {
    return 'image'
  }
  if (lowerHref.endsWith('.jpg') || lowerHref.endsWith('.jpeg')) {
    return 'image'
  }
  if (lowerHref.endsWith('.webp')) {
    return 'image'
  }
  if (lowerHref.endsWith('.ico')) {
    return 'image'
  }
  return 'fetch'
}

// 注入 preconnect 与 preload 标签
const createHtmlPreconnectPreloadPlugin = (preconnectOrigins: string[], preloadAssets: string[]) =>
  ({
    name: 'html-preconnect-preload',
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        ...preconnectOrigins.map((href) => ({
          tag: 'link',
          attrs: { rel: 'preconnect', href },
          injectTo: 'head' as const,
        })),
        ...preloadAssets.map((href) => ({
          tag: 'link',
          attrs: { rel: 'preload', href, as: getPreloadAs(href) },
          injectTo: 'head' as const,
        })),
      ]
      return tags
    },
  }) satisfies Plugin

// 手动分包策略
const createManualChunks = (id: string) => {
  if (!id.includes('node_modules')) {
    return
  }
  if (id.includes('element-plus')) {
    return 'element-plus'
  }
  if (id.includes('vue-router') || id.includes('pinia') || id.includes('vue-i18n')) {
    return 'vue-ecosystem'
  }
  if (id.includes('@vueuse')) {
    return 'vueuse'
  }
  if (id.includes('vue')) {
    return 'vue'
  }
  if (id.includes('axios')) {
    return 'axios'
  }
  if (id.includes('lodash-es')) {
    return 'lodash'
  }
  return 'vendor'
}

// 解析逗号分隔的环境变量列表
const parseListEnv = (value?: string) =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export default defineConfig(({ mode, command }) => {
  // 加载模式对应的环境变量
  const viteEnv: ImportMetaEnv = loadEnv(mode, process.cwd()) as any
  const compressTypes = parseListEnv(viteEnv.VITE_BUILD_COMPRESS)
  const enableGzip = compressTypes.includes('gzip')
  const enableBrotli = compressTypes.includes('brotli')
  const enableAnalyze = viteEnv.VITE_BUILD_ANALYZE === 'true'
  const preconnectOrigins = parseListEnv(viteEnv.VITE_PRECONNECT_ORIGINS)
  const preloadAssets = parseListEnv(viteEnv.VITE_PRELOAD_ASSETS)
  const enableSentry = viteEnv.VITE_SENTRY_ENABLE === 'true' && !!viteEnv.VITE_SENTRY_DSN

  return {
    // GitHub Pages 基于 base 的资源路径处理
    base: viteEnv.VITE_BASE_URL,
    plugins: [
      // HTML 预连接与预加载
      createHtmlPreconnectPreloadPlugin(preconnectOrigins, preloadAssets),
      vue(),
      vueJsx(),
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
        resolvers: [ElementPlusResolver()],
        // 自动导入声明文件
        dirs: ['src/composables', '!src/composables/index.ts'],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        // 按需自动导入的组件目录
        dirs: ['src/icons'],
        // 组件文件扩展名
        extensions: ['vue'],
        // 组件类型声明文件
        dts: 'src/types/components.d.ts',
      }),
      createSvgIconsPlugin({
        // SVG 图标目录
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        // 生成的 symbolId 规则
        symbolId: 'icon-[dir]-[name]',
      }),
      VueI18nPlugin({
        include: [path.resolve(process.cwd(), 'src/i18n/lang/**/*.json')],
        runtimeOnly: false,
        compositionOnly: true,
        fullInstall: true,
        // i18n 自定义块默认语言
        defaultSFCLang: 'yaml',
        globalSFCScope: true,
      }),
      // 构建产物压缩与分析
      ...(command === 'build' && enableSentry
        ? [
            sentryVitePlugin({
              org: process.env.SENTRY_ORG,
              project: process.env.SENTRY_PROJECT,
              authToken: process.env.SENTRY_AUTH_TOKEN,
              release: process.env.SENTRY_RELEASE,
              sourcemaps: {
                assets: './dist/**',
              },
            }),
          ]
        : []),
      ...(command === 'build' && enableGzip
        ? [
            viteCompression({
              algorithm: 'gzip',
              ext: '.gz',
            }),
          ]
        : []),
      ...(command === 'build' && enableBrotli
        ? [
            viteCompression({
              algorithm: 'brotliCompress',
              ext: '.br',
            }),
          ]
        : []),
      ...(command === 'build' && enableAnalyze
        ? [
            visualizer({
              filename: 'dist/stats.html',
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],
    // 路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 构建策略
    build: {
      rollupOptions: {
        output: {
          manualChunks: createManualChunks,
        },
      },
    },
    // 开发服务器配置
    server: {
      port: config.devPort,
      host: true,
      proxy: command === 'serve' ? createViteProxy(viteEnv.VITE_PROXY_TARGET) : undefined,
    },
  }
})
