export const debounce = (func, wait, immediate = false) => {
  let timer, ctx
  const later = (arg) => setTimeout(() => {
    func.apply(ctx, arg)
    timer = ctx = null
  }, wait)
  return function (...arg) {
    if (!timer) {
      timer = later(arg)
      ctx = this
      if (immediate) {
        func.apply(ctx, arg)
      }
    } else {
      clearTimeout(timer)
      timer = later(arg)
    }
  }
}