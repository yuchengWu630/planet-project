import request from '@/utils/axios'

// 获取换装code
export const getCode = (data) => {
  return request({
    url: 'api/bz/sud/login',
    method: 'post',
    data
  })
}

// 获取场景code
export const getSceneCode  = (data) => {
  return request({
    url: '/api/bz/scene/get_sstoken',
    method: 'post',
    data
  })
}