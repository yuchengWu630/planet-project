<template>
  <div class="login" :style="pageStyles">
    <h3 class="login-header">手机绑定</h3>
    <validate-form
      ref="validateForm"
      :type="2"
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
      showKeyboard: false,
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
