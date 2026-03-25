import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin, type PluginOption } from 'vite'
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

type BuildCommand = 'serve' | 'build'

// 构建阶段可切换的功能开关集合
// 由环境变量统一解析后传入，避免插件层重复读取 env
interface BuildFeatureFlags {
  enableGzip: boolean
  enableBrotli: boolean
  enableAnalyze: boolean
  enableSentry: boolean
}

// preload 的 as 类型映射规则
// 通过后缀列表声明资源类型，减少 if/else 分支复杂度
const PRELOAD_AS_RULES: Array<[string[], string]> = [
  [['.css'], 'style'],
  [['.js'], 'script'],
  [['.woff2', '.woff', '.ttf'], 'font'],
  [['.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico'], 'image'],
]

// 解析逗号分隔环境变量
// 输入如 "a,b, c" 会被标准化为 ["a", "b", "c"]
const parseListEnv = (value?: string) =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

// 识别当前是否为 Electron 渲染进程构建。
// 优先使用显式环境变量，同时兼容仅切换输出目录的旧脚本写法。
const isElectronRendererBuild = () =>
  process.env.BUILD_TARGET === 'electron' ||
  (process.env.BUILD_OUT_DIR ?? '').includes('dist-electron')

// Electron 安装包通过 file:// 打开 index.html。
// 这里把根路径资源改成相对路径，避免安装后仍然去磁盘根目录查找资源而白屏。
const normalizeElectronAssetHref = (href: string, electronRendererBuild: boolean) => {
  if (!electronRendererBuild || !href.startsWith('/')) {
    return href
  }

  return `.${href}`
}

// Web 端沿用原有 base；Electron 渲染进程构建强制切到相对路径。
const resolveBuildBase = (baseUrl: string | undefined, electronRendererBuild: boolean) =>
  electronRendererBuild ? './' : baseUrl || '/'

// 统一处理布尔类环境变量
// 仅字符串 "true" 视为开启，避免隐式类型转换带来误判
const isEnabledByEnv = (value?: string) => value === 'true'

// 根据资源后缀推断 preload 的 as 类型
// 未命中规则时回退为 fetch，保证标签属性始终有效
const getPreloadAs = (href: string) => {
  const lowerHref = href.toLowerCase()
  const matchedRule = PRELOAD_AS_RULES.find(([suffixes]) =>
    suffixes.some((suffix) => lowerHref.endsWith(suffix))
  )
  return matchedRule?.[1] ?? 'fetch'
}

// 注入 HTML 标题占位符
// 将模板中的 <%= title %> 替换为项目配置标题
const createHtmlTitlePlugin = (title: string) => ({
  name: 'html-title',
  transformIndexHtml(html: string) {
    return html.replace(/<%= title %>/g, title)
  },
})

// 注入 preconnect 与 preload 资源提示
// preconnect 用于提前建立连接，preload 用于关键资源提前下载
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

// 第三方依赖手动分包策略
// 将核心依赖分组，降低首屏主包体积并提高浏览器缓存命中
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

// 将插件配置标准化为数组，兼容单插件与插件数组两种返回形态
const toPluginArray = (plugin: PluginOption): PluginOption[] => {
  if (!plugin) {
    return []
  }
  return Array.isArray(plugin) ? plugin : [plugin]
}

// Sentry 上传 sourcemap 插件工厂
// 仅在开启监控且存在 dsn 时参与构建流程
const createSentryBuildPlugin = (enabled: boolean) =>
  enabled
    ? sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: process.env.SENTRY_RELEASE,
        sourcemaps: {
          // sourcemap 上传路径始终跟随当前构建输出目录，避免 Electron 构建时仍指向旧的 Web 目录。
          assets: `./${process.env.BUILD_OUT_DIR || config.outputDir}/**`,
        },
      })
    : undefined

// gzip 压缩插件工厂
// 生成 .gz 文件，便于服务端按 Accept-Encoding 协商返回
const createGzipBuildPlugin = (enabled: boolean) =>
  enabled
    ? viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      })
    : undefined

// Brotli 压缩插件工厂
// 生成 .br 文件，通常较 gzip 有更高压缩率
const createBrotliBuildPlugin = (enabled: boolean) =>
  enabled
    ? viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      })
    : undefined

// 构建产物分析插件工厂
// 在当前构建输出目录生成 stats.html，辅助定位体积热点
const createAnalyzeBuildPlugin = (enabled: boolean) =>
  enabled
    ? visualizer({
        // 分析报告输出到当前实际构建的目录下，便于和对应产物一起查看。
        filename: `${process.env.BUILD_OUT_DIR || config.outputDir}/stats.html`,
        gzipSize: true,
        brotliSize: true,
      })
    : undefined

// 汇总构建专属插件
// 通过统一扁平化处理，消除 undefined 与嵌套数组
const createBuildPlugins = (flags: BuildFeatureFlags): PluginOption[] =>
  [
    createSentryBuildPlugin(flags.enableSentry),
    createGzipBuildPlugin(flags.enableGzip),
    createBrotliBuildPlugin(flags.enableBrotli),
    createAnalyzeBuildPlugin(flags.enableAnalyze),
  ].flatMap(toPluginArray)

// 统一收敛插件注册顺序，便于维护
// 先注册基础插件，再按 build 命令追加构建增强插件
const createPlugins = (
  command: BuildCommand,
  preconnectOrigins: string[],
  preloadAssets: string[],
  flags: BuildFeatureFlags
): PluginOption[] => {
  const plugins: PluginOption[] = [
    createHtmlTitlePlugin(config.title),
    createHtmlPreconnectPreloadPlugin(preconnectOrigins, preloadAssets),
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
      resolvers: [ElementPlusResolver()],
      dirs: ['src/composables', '!src/composables/index.ts'],
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: ['src/icons'],
      extensions: ['vue'],
      dts: 'src/types/components.d.ts',
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]',
    }),
    VueI18nPlugin({
      include: [path.resolve(process.cwd(), 'src/i18n/lang/**/*.json')],
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true,
      defaultSFCLang: 'yaml',
      globalSFCScope: true,
    }),
  ]

  if (command === 'build') {
    plugins.push(...createBuildPlugins(flags))
  }

  return plugins.flatMap(toPluginArray)
}

export default defineConfig(({ mode, command }) => {
  // 读取当前模式下的环境变量
  // 所有开关都在此处归一化，避免散落在各插件配置中
  const viteEnv = loadEnv(mode, process.cwd()) as ImportMetaEnv
  const electronRendererBuild = isElectronRendererBuild()
  const base = resolveBuildBase(viteEnv.VITE_BASE_URL, electronRendererBuild)
  const compressTypes = parseListEnv(viteEnv.VITE_BUILD_COMPRESS)
  const enableGzip = compressTypes.includes('gzip')
  const enableBrotli = compressTypes.includes('brotli')
  const enableAnalyze = isEnabledByEnv(viteEnv.VITE_BUILD_ANALYZE)
  const preconnectOrigins = parseListEnv(viteEnv.VITE_PRECONNECT_ORIGINS)
  const preloadAssets = parseListEnv(viteEnv.VITE_PRELOAD_ASSETS).map((href) =>
    normalizeElectronAssetHref(href, electronRendererBuild)
  )
  const enableSentry = isEnabledByEnv(viteEnv.VITE_SENTRY_ENABLE) && !!viteEnv.VITE_SENTRY_DSN

  return {
    // Web 端沿用环境变量；Electron 安装包改为相对资源路径。
    base,
    // 插件注册
    // 统一由 createPlugins 处理顺序与条件挂载
    plugins: createPlugins(command, preconnectOrigins, preloadAssets, {
      enableGzip,
      enableBrotli,
      enableAnalyze,
      enableSentry,
    }),
    // 源码别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // Rollup 构建分包策略
    // 把高频与重量级依赖拆分到稳定 chunk，减少重复下载
    build: {
      // Electron 打包会把这里切到 dist-electron/renderer，避免覆盖 Web 版本的 dist。
      outDir: process.env.BUILD_OUT_DIR || config.outputDir,
      rollupOptions: {
        output: {
          manualChunks: createManualChunks,
        },
      },
    },
    // 本地开发服务
    // 开发模式注入代理，构建模式不注入以避免产物受影响
    server: {
      port: config.devPort,
      host: true,
      proxy: command === 'serve' ? createViteProxy(viteEnv.VITE_PROXY_TARGET) : undefined,
    },
  }
})
