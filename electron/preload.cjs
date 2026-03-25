const { contextBridge, ipcRenderer } = require('electron')

const runtimeConfigPayload = ipcRenderer.sendSync('app:get-runtime-config-sync')

const electronAPI = {
  runtimeConfig: runtimeConfigPayload?.config ?? {},
  runtimeConfigPath: runtimeConfigPayload?.configPath ?? '',
  resolvedApiBaseUrl: runtimeConfigPayload?.resolvedApiBaseUrl ?? '',
  getAppInfo: () => ipcRenderer.invoke('app:get-info'),
  getRuntimeConfig: () => ipcRenderer.invoke('app:get-runtime-config'),
  openExternal: (url) => ipcRenderer.invoke('system:open-external', url),
  request: (payload) => ipcRenderer.invoke('http:request', payload),
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI)
} else {
  window.electronAPI = electronAPI
}
