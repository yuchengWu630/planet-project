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
    roomId: null,
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
      this.roomId = data.roomId || null
      this.openId = data.openId || null
      localStorage.userInfo = JSON.stringify(data)
    },
    clearUserInfo() {
      localStorage.clear()
      this.id = null
      this.avatar = ''
      this.key = ''
      this.nick = ''
      this.phone = ''
      this.rname = ''
      this.uname = ''
      this.roomId = null
      this.openId = null
    },
  },
})
