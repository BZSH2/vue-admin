import type { RuntimeConfig } from '@/config/runtime'

type ElectronAppInfo = {
  name: string
  version: string
  platform: NodeJS.Platform
  isPackaged: boolean
}

type ElectronRuntimeConfigPayload = {
  configPath: string
  config: RuntimeConfig
  resolvedApiBaseUrl: string
}

type ElectronHttpRequestPayload = {
  url?: string
  method?: string
  baseURL?: string
  headers?: Record<string, string>
  params?: Record<string, unknown>
  data?: unknown
  timeout?: number
}

type ElectronHttpResponsePayload = {
  url: string
  status: number
  statusText: string
  headers: Record<string, string>
  data: unknown
}

type ElectronAPI = {
  runtimeConfig: RuntimeConfig
  runtimeConfigPath: string
  resolvedApiBaseUrl: string
  getAppInfo: () => Promise<ElectronAppInfo>
  getRuntimeConfig: () => Promise<ElectronRuntimeConfigPayload>
  openExternal: (url: string) => Promise<boolean>
  request: (payload: ElectronHttpRequestPayload) => Promise<ElectronHttpResponsePayload>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
