<template>
  <div class="login" :style="pageStyles">
    <h3 class="login-header">009星通行证</h3>
    <validate-form
      ref="validateForm"
      :type="0"
      v-model:phone="formData.phone"
      v-model:code="formData.code"
      @on-keyboard-show="onKeyboardShow"
    />
    <p class="tips">
      已有账号？
      <router-link to="/login">去登录</router-link>
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
        注册
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
      showKeyboard: false,
      formData: {
        type: 0, // 0-注册；1:登陆
        phone: '',
        code: '',
      },
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
    register(params) {
      return request({
        url: 'api/bz/user/phone/reg',
        method: 'post',
        params,
      })
    },
    async submit() {
      try {
        await this.$refs.validateForm.validate()
        this.loading = true
        const params = JSON.parse(JSON.stringify(this.formData))
        await this.register(params)
        this.$notify({ type: 'success', message: '注册成功' })
        this.$router.push('./login')
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
