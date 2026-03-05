import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'virtual:svg-icons-register'
import 'virtual:uno.css'

import App from './App.vue'
import { router, setupRouter } from './router'
import { setupI18n } from '@/i18n'
import './styles/index.scss'

async function setupApp() {
  const app = createApp(App)
  setupRouter(app)
  app.use(createPinia())
  await setupI18n(app)
  app.mount('#app')
}

setupApp()
