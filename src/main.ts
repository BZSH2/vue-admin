import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'

import 'virtual:svg-icons-register'
import 'virtual:uno.css'

import App from './App.vue'
import { router, setupRouter } from './router'
import { setupI18n } from '@/i18n'
import './styles/index.scss'
import { setupSentry } from '@/plugins/sentry'
import { setupTheme, teardownTheme } from '@/plugins/theme'
let app: VueApp<Element> | null = null

async function render(props: Record<string, any> = {}) {
  setupTheme()
  const { container } = props
  const app = createApp(App)
  setupSentry(app)
  setupRouter(app)
  const redirect = sessionStorage.getItem('redirect')
  if (redirect) {
    sessionStorage.removeItem('redirect')
    await router.replace(redirect)
  }
  app.use(createPinia())
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
