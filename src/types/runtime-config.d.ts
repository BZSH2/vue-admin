import type { RuntimeConfig } from '@/config/runtime'

declare global {
  interface Window {
    /** 运行时配置（由 public/runtime-config.js 注入） */
    __RUNTIME_CONFIG__?: RuntimeConfig
  }
}

export {}
