<template>
  <div class="login">
    <h3 class="login-header">009星通行证</h3>
    <validate-form
      ref="validateForm"
      :type="0"
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
import { useUserStore } from '@/store/index.js'
import request from '@/utils/axios'
export default {
  data() {
    return {
      loading: false,
      formData: {
        type: 0, // 0-注册；1:登陆
        phone: '',
        code: '',
      },
    }
  },
  methods: {
    register(params) {
      return request({
        url: 'api/bz/user/phone/reg',
        method: 'post',
        params,
      })
    },
    async submit() {
      try {
        await this.$refs.form.validate(['phone', 'code'])
        this.loading = true
        const params = JSON.parse(JSON.stringify(this.formData))
        const { data } = await this.register(params)
        const userStore = useUserStore()
        userStore.setUserInfo(data)
        this.$notify({ type: 'success', message: '登录成功' })
        this.push.push('./game')
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
