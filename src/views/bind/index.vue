<template>
  <div class="login">
    <h3 class="login-header">手机绑定</h3>
    <validate-form
      ref="validateForm"
      :type="2"
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
        绑定
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
        type: 2,
        phone: '',
        code: '',
        openId: null,
      },
    }
  },
  created() {
    const userStore = useUserStore()
    if (!userStore.openId) {
      this.$dialog.alert({ message: '微信未授权，请先授权' }).then(() => {
        this.$router.push('./login')
      })
      return
    }
    this.formData.openId = userStore.openId
  },
  methods: {
    bind(params) {
      return request({
        url: 'api/bz/user/phone/bind',
        method: 'post',
        params,
      })
    },
    async submit() {
      try {
        await this.$refs.validateForm.validate()
        this.loading = true
        const params = JSON.parse(JSON.stringify(this.formData))
        const { data } = await this.bind(params)
        const userStore = useUserStore()
        userStore.setUserInfo(data)
        this.$notify({ type: 'success', message: '绑定成功' })
        this.$router.push('./game')
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
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
  font-size: 12px;
}
.tips a {
  color: var(--van-primary-color);
}

.van-cell {
  padding: 40px var(--van-cell-horizontal-padding);
}
</style>
