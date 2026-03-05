/// <reference types="vite/client" />
/// <reference types="vite-plugin-svg-icons/client" />

interface ImportMetaEnv {
  /** 开发环境是否登录 */
  readonly VITE_DEV_LOGIN: boolean
  /** 登录跳转的地址 */
  readonly VITE_LOGIN_URL: string
  /** 本地登录的端口 BL项目启动的端口 */
  readonly VITE_LOGIN_URL_PORT: string
  /** 存储的cookie domain */
  readonly VITE_COOKIE_DOMAIN: string
  /** 项目基本地址 */
  readonly VITE_BASE_URL: string
  /** 项目开启端口 */
  readonly VITE_REPORT: string
  /** 项目代理环境 */
  readonly VITE_DEV_PROXY: string
  /** 是否启用gzip或brotli压缩 */
  readonly VITE_BUILD_COMPRESS: string
  /** 配置打包环境变量 */
  readonly VITE_BUILD_ENV: string
  /** 是否输出构建分析报告 */
  readonly VITE_BUILD_ANALYZE: string
  /** 预连接的外部域名列表 */
  readonly VITE_PRECONNECT_ORIGINS: string
  /** 需要预加载的资源路径列表 */
  readonly VITE_PRELOAD_ASSETS: string
  /** 子系统key */
  readonly VITE_SYSTEM_KEY: string
  /** Sentry DSN */
  readonly VITE_SENTRY_DSN?: string
  /** Sentry 环境标识 */
  readonly VITE_SENTRY_ENV?: string
  /** 是否开启 Sentry */
  readonly VITE_SENTRY_ENABLE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
