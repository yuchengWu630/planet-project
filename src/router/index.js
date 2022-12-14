import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import { createRouterGuard } from './guard/index'
import { views } from './views'

console.log(views)
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: views['login'],
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: '注册',
    },
    component: views['register'],
  },
  {
    path: '/bind',
    name: 'Bind',
    meta: {
      title: '手机绑定',
    },
    component: views['bind'],
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '星球',
    },
    component: views['home'],
  },
  {
    path: '/game',
    name: 'Game',
    meta: {
      title: '个人中心',
    },
    component: views['game'],
  },
  {
    path: '/scenes',
    name: 'Scenes',
    meta: {
      title: '展馆',
    },
    component: views['scenes'],
  },
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
