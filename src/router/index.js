import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuard } from './guard/index'

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
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '星球'
    },
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/game',
    name: 'Game',
    meta: {
      title: '展馆'
    },
    component: () => import('@/views/game/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export async function setupRouter(app) {
  app.use(router)
  console.log('router:', router)
  createRouterGuard(router)
}
