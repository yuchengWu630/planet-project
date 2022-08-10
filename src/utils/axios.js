import Axios from "axios";

const axios = Axios.create({
  timeout: 20000
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
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

