import { createApp } from 'vue'
import { setupRouter } from './router/index'
import App from './App.vue'
import Vant from 'vant'
import { setDomFontSize } from './utils/dom'
import 'normalize.css/normalize.css'
import 'vant/lib/index.css'

function setupApp() {
  const app = createApp(App)
  console.log('app:', app)
  app.use(Vant)
  setDomFontSize()
  setupRouter(app)
  app.mount('#app')
}

setupApp()
