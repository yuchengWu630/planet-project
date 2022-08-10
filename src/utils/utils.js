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

/**
 * 动态向页面追加文件
 * @param { string } url
 * @param { function } callback
 */
 export function asyncLoader (url) {
  return new Promise(resolve => {
    url = `${process.env.BASE_URL}${url}`
    let ext = url.slice(url.lastIndexOf('.'))
    const id = url.slice(url.lastIndexOf('/') + 1).replace(/\./g, '_')
    ext = ext.split('?')[0]
    if (document.getElementById(id)) {
      resolve(true)
      return
    }
    let rs = null
    if (ext === '.js') {
      rs = document.createElement('script')
      rs.type = 'text/javascript'
      rs.id = id
      // IE
      if (rs.readyState) {
        rs.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null
            resolve(true)
          }
        }
      } else {
        // Other
        rs.onload = function () {
          resolve(true)
        }
      }
      rs.src = url
    } else if (ext === '.css') {
      rs = document.createElement('link')
      rs.rel = 'stylesheet'
      rs.href = url
      rs.id = id
      rs.onload = function () {
        resolve(true)
      }
    }
    if (rs) {
      document.getElementsByTagName('head')[0].appendChild(rs)
    }
  })
}