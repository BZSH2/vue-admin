import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'virtual:svg-icons-register'

import App from './App.vue'
import { router, setupRouter } from './router'
import i18n from '@/i18n'
import './styles/index.scss'

function setupApp() {
  const app = createApp(App)
  setupRouter(app)
  app.use(createPinia()).use(i18n)
  app.mount('#app')
}

setupApp()
