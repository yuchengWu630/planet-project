<template>
  <div class="login">
    <h3 class="login-header">009星通行证</h3>
    <validate-form
      ref="validateForm"
      v-model:phone="formData.phone"
      v-model:code="formData.code"
    />
    <p class="tips">
      没有账号？
      <router-link to="/register">去注册</router-link>
    </p>
    <div style="margin: 16px">
      <van-button
        style="margin-bottom: 16px"
        :loading="loading"
        round
        block
        type="primary"
        @click="submit"
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
import { useUserStore } from '@/store/index.js'
import request from '@/utils/axios'
export default {
  data() {
    return {
      loading: false,
      formData: {
        type: 1, // 0-注册；1:登陆
        phone: '',
        code: '',
      },
    }
  },
  created() {
    // const code = this.getWechatCode()
    // this.getAccessToken(code)
  },
  methods: {
    login(params) {
      return request({
        url: 'api/bz/user/phone/login',
        method: 'post',
        params,
      })
    },
    async submit() {
      try {
        await this.$refs.validateForm.validate()
        this.loading = true
        const params = JSON.parse(JSON.stringify(this.formData))
        const res = await this.login(params)
        this.$notify({ type: 'success', message: '登录成功' })
        const userStore = useUserStore()
        userStore.setUserInfo(res)
        // this.getUserInfo()
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
    getAuthorizeUrl() {
      return request({
        url: 'weixin/mp/authorize',
        method: 'get',
      })
    },
    // 第一步：1、跳转微信授权，
    async toWechatAuth() {
      try {
        const url = await this.getAuthorizeUrl()
        console.log('url:', url)
        const url2 = decodeURIComponent(url).replace(
          'http://game.fashionmvs.com',
          encodeURIComponent('http://xp.test.com')
        )
        console.log('url2:', url2)
        window.location.href = url2
      } catch (err) {
        console.error(err)
      }
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
