import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow, ipcMain, shell } from 'electron'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isDev = Boolean(process.env.VITE_DEV_SERVER_URL)
const preloadPath = path.resolve(__dirname, './preload.cjs')
const rendererOutDir = process.env.BUILD_OUT_DIR || (app.isPackaged ? 'dist-electron/renderer' : 'dist')
const indexHtmlPath = path.resolve(__dirname, '..', rendererOutDir, 'index.html')
const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? ''
const electronRuntimeConfigFileName = 'runtime-config.json'
const defaultElectronApiBaseUrl = 'http://8.133.21.62:35000'
const defaultElectronRuntimeConfig = {
  apiBaseUrl: defaultElectronApiBaseUrl,
}

let mainWindow = null

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isSafeHttpUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function openExternalSafely(url) {
  return shell.openExternal(url).catch((error) => {
    console.error('[electron] failed to open external url', { url, error })
  })
}

function getElectronRuntimeConfigPath() {
  return path.join(app.getPath('userData'), electronRuntimeConfigFileName)
}

function normalizeApiBaseUrl(rawUrl) {
  if (typeof rawUrl !== 'string') {
    return ''
  }

  const normalizedUrl = rawUrl.trim()
  return isSafeHttpUrl(normalizedUrl) ? normalizedUrl : ''
}

function ensureElectronRuntimeConfigFile() {
  const runtimeConfigPath = getElectronRuntimeConfigPath()

  if (!fs.existsSync(runtimeConfigPath)) {
    fs.mkdirSync(path.dirname(runtimeConfigPath), { recursive: true })
    fs.writeFileSync(
      runtimeConfigPath,
      `${JSON.stringify(defaultElectronRuntimeConfig, null, 2)}\n`,
      'utf8'
    )
  }

  return runtimeConfigPath
}

function readElectronRuntimeConfig() {
  const runtimeConfigPath = ensureElectronRuntimeConfigFile()

  try {
    const rawContent = fs.readFileSync(runtimeConfigPath, 'utf8').trim()

    if (!rawContent) {
      return { ...defaultElectronRuntimeConfig }
    }

    const parsed = JSON.parse(rawContent)

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...defaultElectronRuntimeConfig }
    }

    const mergedConfig = {
      ...defaultElectronRuntimeConfig,
      ...parsed,
    }

    // 兼容旧版本可能写入空字符串的情况，升级后自动补齐默认后端地址。
    if (typeof mergedConfig.apiBaseUrl !== 'string' || !mergedConfig.apiBaseUrl.trim()) {
      mergedConfig.apiBaseUrl = defaultElectronApiBaseUrl
      fs.writeFileSync(runtimeConfigPath, `${JSON.stringify(mergedConfig, null, 2)}\n`, 'utf8')
    }

    return mergedConfig
  } catch (error) {
    console.error('[electron] failed to read runtime config', { runtimeConfigPath, error })
    return { ...defaultElectronRuntimeConfig }
  }
}

// 统一收口 Electron 安装包最终生效的后端地址。
// 即使渲染进程没有把 baseURL 传过来，这里也会回退到用户配置或默认地址。
function getResolvedElectronApiBaseUrl(preferredBaseUrl) {
  const preferredApiBaseUrl = normalizeApiBaseUrl(preferredBaseUrl)

  if (preferredApiBaseUrl) {
    return preferredApiBaseUrl
  }

  const runtimeConfigApiBaseUrl = normalizeApiBaseUrl(readElectronRuntimeConfig().apiBaseUrl)

  if (runtimeConfigApiBaseUrl) {
    return runtimeConfigApiBaseUrl
  }

  return defaultElectronApiBaseUrl
}

function getElectronRuntimeConfigPayload() {
  const configPath = ensureElectronRuntimeConfigFile()
  const config = readElectronRuntimeConfig()

  return {
    configPath,
    config,
    resolvedApiBaseUrl: getResolvedElectronApiBaseUrl(config.apiBaseUrl),
  }
}

function appendSearchParams(requestUrl, params) {
  if (!params || typeof params !== 'object') {
    return requestUrl
  }

  const finalUrl = new URL(requestUrl)

  for (const [key, value] of Object.entries(params)) {
    if (value == null) {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null) {
          finalUrl.searchParams.append(key, String(item))
        }
      }
      continue
    }

    finalUrl.searchParams.set(key, String(value))
  }

  return finalUrl.toString()
}

function resolveRequestUrl(rawUrl, baseURL) {
  if (typeof rawUrl !== 'string' || !rawUrl) {
    throw new Error('Missing request url')
  }

  if (isSafeHttpUrl(rawUrl)) {
    return rawUrl
  }

  const resolvedApiBaseUrl = getResolvedElectronApiBaseUrl(baseURL)

  if (!resolvedApiBaseUrl) {
    throw new Error(
      `Electron 安装包缺少可用的 API 地址，请修改 ${getElectronRuntimeConfigPath()} 中的 apiBaseUrl 为 http://你的后端地址`
    )
  }

  const normalizedBaseUrl = resolvedApiBaseUrl.endsWith('/')
    ? resolvedApiBaseUrl.slice(0, -1)
    : resolvedApiBaseUrl
  const normalizedRequestUrl = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`

  return `${normalizedBaseUrl}${normalizedRequestUrl}`
}

function buildRequestBody(method, headers, data) {
  const normalizedMethod = String(method || 'GET').toUpperCase()

  if (normalizedMethod === 'GET' || normalizedMethod === 'HEAD' || data == null) {
    return undefined
  }

  if (typeof data === 'string') {
    return data
  }

  const contentType = headers['Content-Type'] || headers['content-type'] || ''

  if (
    contentType.includes('application/x-www-form-urlencoded') &&
    typeof data === 'object' &&
    !Array.isArray(data)
  ) {
    return new URLSearchParams(
      Object.entries(data).flatMap(([key, value]) => (value == null ? [] : [[key, String(value)]]))
    ).toString()
  }

  if (!contentType) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  }

  return typeof data === 'object' ? JSON.stringify(data) : data
}

async function performHttpRequest(payload) {
  const {
    method = 'GET',
    url,
    baseURL,
    headers = {},
    params,
    data,
    timeout = 10000,
  } = payload || {}
  const finalUrl = appendSearchParams(resolveRequestUrl(url, baseURL), params)
  const normalizedHeaders = Object.fromEntries(
    Object.entries(headers).flatMap(([key, value]) => (value == null ? [] : [[key, String(value)]]))
  )
  const controller = new AbortController()
  const timeoutId =
    timeout > 0
      ? setTimeout(() => {
          controller.abort()
        }, timeout)
      : null

  try {
    const response = await fetch(finalUrl, {
      method: String(method).toUpperCase(),
      headers: normalizedHeaders,
      body: buildRequestBody(method, normalizedHeaders, data),
      signal: controller.signal,
    })
    const responseHeaders = Object.fromEntries(response.headers.entries())
    const contentType = response.headers.get('content-type') || ''
    let responseData = null

    if (response.status !== 204 && String(method).toUpperCase() !== 'HEAD') {
      if (contentType.includes('application/json')) {
        responseData = await response.json().catch(() => null)
      } else {
        responseData = await response.text()
      }
    }

    return {
      url: finalUrl,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseData,
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`请求超时，请检查接口地址或网络连通性：${finalUrl}`)
    }

    throw error instanceof Error ? error : new Error(String(error))
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

async function loadRenderer(window) {
  if (isDev) {
    const url = devServerUrl
    const maxRetries = 60
    const retryDelay = 500

    if (!isSafeHttpUrl(url)) {
      throw new Error(`Invalid VITE_DEV_SERVER_URL: ${url}`)
    }

    for (let attempt = 0; attempt < maxRetries; attempt += 1) {
      try {
        await window.loadURL(url)
        return
      } catch {
        await wait(retryDelay)
      }
    }

    throw new Error(`Failed to connect to dev server: ${url}`)
  }

  await window.loadFile(indexHtmlPath)
}

function registerWindowSecurityHandlers(window) {
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeHttpUrl(url)) {
      void openExternalSafely(url)
    }

    return { action: 'deny' }
  })

  window.webContents.on('will-navigate', (event, url) => {
    if (url !== window.webContents.getURL()) {
      event.preventDefault()

      if (isSafeHttpUrl(url)) {
        void openExternalSafely(url)
      }
    }
  })
}

function registerIpcHandlers() {
  ipcMain.handle('app:get-info', () => ({
    name: app.getName(),
    version: app.getVersion(),
    platform: process.platform,
    isPackaged: app.isPackaged,
  }))

  ipcMain.handle('app:get-runtime-config', () => getElectronRuntimeConfigPayload())

  ipcMain.on('app:get-runtime-config-sync', (event) => {
    event.returnValue = getElectronRuntimeConfigPayload()
  })

  ipcMain.handle('system:open-external', async (_, rawUrl) => {
    if (typeof rawUrl !== 'string' || !isSafeHttpUrl(rawUrl)) {
      return false
    }

    try {
      await shell.openExternal(rawUrl)
      return true
    } catch (error) {
      console.error('[electron] failed to handle system:open-external', { rawUrl, error })
      return false
    }
  })

  ipcMain.handle('http:request', async (_, payload) => performHttpRequest(payload))
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    autoHideMenuBar: !isDev,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  registerWindowSecurityHandlers(mainWindow)

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('render-process-gone', (_, details) => {
    console.error('[electron] renderer process gone', details)
  })

  await loadRenderer(mainWindow)

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }
}

const hasSingleInstanceLock = app.requestSingleInstanceLock()
if (!hasSingleInstanceLock) {
  app.quit()
}

app.whenReady()
  .then(async () => {
    // 启动阶段直接读取一次运行时配置，顺带修复旧版本遗留的空 apiBaseUrl。
    readElectronRuntimeConfig()
    registerIpcHandlers()
    await createWindow()

    app.on('second-instance', () => {
      if (!mainWindow) {
        void createWindow()
        return
      }

      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }

      mainWindow.focus()
    })

    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow()
      }
    })
  })
  .catch((error) => {
    console.error('[electron] failed to bootstrap app', error)
    app.quit()
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  ipcMain.removeHandler('app:get-info')
  ipcMain.removeHandler('app:get-runtime-config')
  ipcMain.removeHandler('system:open-external')
  ipcMain.removeHandler('http:request')
  ipcMain.removeAllListeners('app:get-runtime-config-sync')
})
