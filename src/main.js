import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupRouter } from './router/index'
import App from './App.vue'
import Vant from 'vant'
import { setDomFontSize } from './utils/dom'
import 'normalize.css/normalize.css'
import 'vant/lib/index.css'

function setupApp() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.use(Vant)
  setDomFontSize()
  setupRouter(app)
  app.mount('#app')
}

setupApp()
