import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    avatar: '',
    key: '',
    nick: '',
    phone: '',
    rname: '',
    uname: '',
    roomId: '',
    openId: null,
  }),
  actions: {
    setUserInfo(data) {
      this.id = data.id || null
      this.avatar = data.avatar || ''
      this.key = data.key || ''
      this.nick = data.nick || ''
      this.phone = data.phone || ''
      this.rname = data.rname || ''
      this.uname = data.uname || ''
      this.roomId = data.roomId || ''
      this.openId = data.openId || null
      localStorage.userInfo = JSON.stringify(data)
    },
  },
})
