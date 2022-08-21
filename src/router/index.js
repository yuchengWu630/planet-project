import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { createRouterGuard } from './guard/index'
import { views } from './views';


console.log(views)
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录'
    },
    component: views['login']
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '星球'
    },
    component: views['home']
  },
  {
    path: '/game',
    name: 'Game',
    meta: {
      title: '展馆'
    },
    component: views['game']
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export async function setupRouter(app) {
  app.use(router)
  console.log('router:', router)
  createRouterGuard(router)
}
