/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router) {

  router.beforeEach(async (to, from, next) => {
    // 开始 loadingBar
    // window.NProgress?.start()
    // 页面跳转权限处理
    next()
  });
  router.afterEach(to => {
    // 结束 loadingBar
    // window.NProgress?.done()
  });
}
