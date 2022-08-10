import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { createRouterGuard } from './guard/index'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export async function setupRouter(app) {
  app.use(router);
  createRouterGuard(router);
}