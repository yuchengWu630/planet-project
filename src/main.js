import { createApp } from 'vue'
import { setupRouter } from './router/index'
import App from './App.vue'
import { setDomFontSize } from './utils/dom'
import 'normalize.css/normalize.css'


async function setupApp() {
  const app = createApp(App)
  setDomFontSize()
  await setupRouter(app)
  app.mount('#app')
}

setupApp()