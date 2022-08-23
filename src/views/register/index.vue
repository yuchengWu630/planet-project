<template>
  <div class="login">
    <h3 class="login-header">009星通行证</h3>
    <validate-form
      ref="validateForm"
      v-model:phone="formData.phone"
      v-model:code="formData.code"
    />
    <p class="tips">
      已有账号？
      <router-link to="/login">去登录</router-link>
    </p>
    <div style="margin: 16px">
      <van-button
        style="margin-bottom: 16px"
        :loading="loading"
        round
        block
        type="primary"
        @click="submit(1)"
      >
        登录
      </van-button>
      <van-button round block type="success" @click="toWechatAuth">
        微信授权登录
      </van-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/axios'
export default {
  data() {
    return {
      loading: false,
      disabled: false,
      time: 60,
      showKeybord: false,
      activeKey: 'phone',
      formData: {
        type: 1, // 0-注册；1:登陆
        phone: '15889738492',
        code: '0000',
      },
    }
  },
  computed: {
    codeText({ disabled, time }) {
      if (!disabled) return '获取验证码'
      return `${time}s后重新获取`
    },
    keyboardTitle({ activeKey, formData }) {
      return formData[activeKey]
    },
  },
  created() {
    // const code = this.getWechatCode()
    // this.getAccessToken(code)
  },
  methods: {
    onInput(val) {
      console.log('val:', val)
      this.formData[this.activeKey] += val
    },
    onDelete() {
      this.formData[this.activeKey] = this.formData[this.activeKey].slice(0, -1)
    },
    onFocus(key) {
      document.activeElement.blur()
      this.showKeybord = true
      this.activeKey = key
    },
    async getCode() {
      try {
        await this.$refs.form.validate('phone')
        this.disabled = true
        await request({
          url: 'api/bz/user/phone/send',
          method: 'post',
          params: {
            type: 1,
            phone: this.formData.phone,
          },
        })
        this.$notify({ type: 'success', message: '发送成功' })
        this.countDown()
      } catch (err) {
        this.disabled = false
        this.time = 60
        console.error(err)
      }
    },
    countDown() {
      const timer = setInterval(() => {
        if (this.time > 0) {
          this.time--
        } else {
          clearInterval(timer)
          this.disabled = false
          this.time = 60
        }
      }, 1000)
    },
    login(params) {
      return request({
        url: 'api/bz/user/phone/login',
        method: 'post',
        params,
      })
    },
    register(params) {
      return request({
        url: 'api/bz/user/phone/reg',
        method: 'post',
        params,
      })
    },
    async submit(type) {
      try {
        await this.$refs.form.validate(['phone', 'code'])
        this.loading = true
        const params = JSON.parse(JSON.stringify(this.formData))
        params.type = type // 0-注册；1:登陆
        const res =
          type === 0 ? await this.register(params) : await this.login(params)
        this.$notify({ type: 'success', message: '登录成功' })
        this.getUserInfo()
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async getUserInfo() {
      try {
        const res = request({
          url: 'api/bz/sud/get_user_info',
          method: 'post',
          data: {},
        })
        console.log('userInfo:', res)
      } catch (err) {
        console.error(err)
      }
    },
    // 第一步：1、跳转微信授权，
    toWechatAuth() {
      const APP_ID = 'wxa7da15529eb0d0e7'
      const REDIRECT_URI = 'http://192.168.2.5/login'
      const SCOPE = 'snsapi_userinfo'
      const STATE = '10086'
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`
    },
    // 第一步：2、用户同意授权，获取code
    getWechatCode() {
      const params = new URLSearchParams(window.location.search)
      return params.get('code')
    },
    // 第二步：通过 code 换取网页授权access_token
    getAccessToken(code) {
      const APP_ID = 'wxa7da15529eb0d0e7'
      const SECRET = '7f5236c68c2d9e7c4cc9ce92c9df2e96'
      fetch(`http://192.168.2.5:8080/auth/accessToken?code=${code}`)
        .then(res => res.json())
        .then(data => {
          console.log('data:', data)
        })
        .catch(err => console.log('Request Failed', err))
    },
  },
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
}
.login-header {
  height: 64px;
  line-height: 108px;
  color: #fff;
  text-align: center;
  font-size: 20px;
}
.tips {
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  color: #fff;
  text-align: right;
}
.tips a {
  color: var(--van-primary-color);
}

.van-cell {
  padding: 40px var(--van-cell-horizontal-padding);
}
</style>
