import request from '@/utils/axios'

// 获取换装code
export const getCode = (data) => {
  return request({
    url: 'api/bz/sud/login',
    method: 'post',
    data
  })
}

// 保存用户装扮选择信息
export const saveUserAvatar  = (data) => {
  return request({
    url: '/api/bz/user/avatar/update',
    method: 'post',
    data
  })
}