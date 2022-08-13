import request from '@/utils/axios'

// 游戏列表
export const getCode = (data) => {
  return request({
    url: `https://mgp-hello.sudden.ltd/login/v3`,
    method: 'post',
    data
  })
}
