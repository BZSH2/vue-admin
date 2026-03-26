import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'

import 'virtual:svg-icons-register'
import 'virtual:uno.css'

import App from './App.vue'
import { router, setupRouter } from './router'
import { setupI18n } from '@/i18n'
import './styles/index.scss'
import { setupTheme, teardownTheme } from '@/plugins/theme'

import { $baseMessage } from '@/composables/useMessage'
import { setRefreshTokenHandler, setRequestErrorHandler } from '@/utils/request'
import { useAuthStore } from '@/stores/auth'

let app: VueApp<Element> | null = null

async function render(props: Record<string, any> = {}) {
  setupTheme()

  const { container } = props
  const app = createApp(App)

  // 先注册 pinia（这样 router guard 里就可以安全使用 store）
  const pinia = createPinia()
  app.use(pinia)

  // request 层错误提示策略（UI 注入），避免 request 层强依赖 ElementPlus
  setRequestErrorHandler((error) => {
    $baseMessage(error.message, 'error')
  })

  // 401 自动刷新 token（可选）
  const authStore = useAuthStore(pinia)
  setRefreshTokenHandler(() => authStore.refreshToken())

  setupRouter(app)

  const redirect = sessionStorage.getItem('redirect')
  if (redirect) {
    sessionStorage.removeItem('redirect')
    await router.replace(redirect)
  }

  await setupI18n(app)
  const mountPoint = container ? container.querySelector('#app') : '#app'
  app.mount(mountPoint as Element | string)
  return app
}

export async function bootstrap() {}

export async function mount(props: Record<string, any>) {
  app = await render(props)
}

export function unmount() {
  app?.unmount()
  teardownTheme()
  app = null
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render()
}
