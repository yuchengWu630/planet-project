<template>
  <div class="login" :style="pageStyles">
    <h3 class="login-header">009星通行证</h3>
    <validate-form
      ref="validateForm"
      v-model:phone="formData.phone"
      v-model:code="formData.code"
      @on-keyboard-show="onKeyboardShow"
    />
    <p class="tips">
      没有账号？
      <router-link to="/register">去注册</router-link>
    </p>
    <div style="margin: 0 16px 16px">
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
      showKeyboard: false,
      formData: {
        type: 1,
        phone: '15889738492',
        code: '0000',
      },
    }
  },
  created() {
    const code = this.getWechatCode()
    if (code) {
      this.getUserInfoByWechat(code)
    }
  },
  computed: {
    pageStyles({ showKeyboard }) {
      return {
        width: showKeyboard ? '50%' : 'auto',
      }
    },
  },
  methods: {
    onKeyboardShow(val) {
      this.showKeyboard = val
      const container = document.querySelector('.container')
      container.style.justifyContent = val ? 'flex-start' : 'center'
    },
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
        const { data } = await this.login(params)
        this.$notify({ type: 'success', message: '登录成功' })
        const userStore = useUserStore()
        console.log(
          data,
          '=============================== data ======================='
        )
        userStore.setUserInfo(data)
        this.$router.push('./game')
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
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
        const { data } = await this.getAuthorizeUrl()
        window.location.href = data
      } catch (err) {
        console.error(err)
      }
    },
    // 第一步：2、用户同意授权，获取code
    getWechatCode() {
      const params = new URLSearchParams(window.location.search)
      return params.get('code')
    },
    // 第二步：通过 code 获取用户信息
    async getUserInfoByWechat(code) {
      try {
        const { data } = await request({
          url: 'weixin/mp/userInfo',
          method: 'post',
          params: { code },
        })
        const userStore = useUserStore()
        userStore.setUserInfo(data)
        if (!data.phone) {
          await this.$dialog.alert({
            message: '您还未绑定手机号，立即绑定',
          })
          this.$router.push('./bind')
          return
        }
        this.$router.push('./game')
      } catch (err) {
        console.error(err)
      }
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
  height: 48px;
  line-height: 48px;
  color: #333;
  text-align: center;
  font-size: 20px;
}
.tips {
  margin: 0 16px 16px;
  height: 20px;
  line-height: 20px;
  color: #666;
  text-align: right;
  font-size: 12px;
}
.tips a {
  color: var(--van-primary-color);
}
</style>
