import { debounce } from './utils'

// 以1920px 底图为准开发页面
export const setDomFontSize = () => {
  const Hwidth = document.documentElement.clientWidth > document.documentElement.clientHeight ? document.documentElement.clientWidth : document.documentElement.clientHeight
  let width = Hwidth || document.documentElement.clientWidth || document.body.clientWidth;
  let fontsize = Math.floor(width / 66) + Math.random()*.1 + 'px';
  (document.getElementsByTagName('html')[0].style)['font-size'] = fontsize;
}

let setDomFontSizeDebounce = debounce(setDomFontSize, 400)
window.addEventListener('resize', setDomFontSizeDebounce); // 浏览器加入收缩监听防抖，重新计算rem配置