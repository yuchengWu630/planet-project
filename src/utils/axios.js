import Axios from "axios";

const axios = Axios.create({
  baseURL: '/', 
  withCredentials: true,
  timeout: 30000
})

axios.interceptors.request.use(
  config => {
    // 请求拦截
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    // 响应拦截
    return response.data
  },
  error => {
    return handleCode(error.response.status, error)
  }
)


const handleCode = (code, error) => {
  try {
    let message = ''
    switch (code) {
      // 跳转
      case 400:
        message = '错误请求'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求错误'
        break
      case 405:
        console.log(error)
        message = 'Method Not Supported'
        break
      case 500:
        message = '服务端出错'
        break
      case 502:
        message = 'Bad Gateway'
        break
    }
    if (message) {
      Message.error(message)
    }
  } catch (error) {
    return Promise.reject(error)
  }
  // 对响应错误做点什么
  return Promise.reject(error)
}

export default axios