<template>
  <div class="login">
    <h3 class="login-header">用户登录</h3>
    <van-form ref="form" @submit="submit">
      <van-cell-group inset>
        <van-field
          v-model="formData.mobile"
          name="mobile"
          label="手机号"
          placeholder="手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^1[23456789]\d{9}$/,
              message: '手机号格式错误',
            },
          ]"
          @focus="onFocus"
        />
        <van-row style="align-items: center">
          <van-col span="16">
            <van-field
              v-model="formData.code"
              type="digit"
              name="code"
              label="验证码"
              placeholder="验证码"
              :rules="[{ required: true, message: '请输入验证码' }]"
            />
          </van-col>
          <van-col span="8" style="padding-right: 16px">
            <van-button
              block
              size="small"
              round
              type="primary"
              :disabled="disabled"
              @click="getCode"
              >{{ codeText }}</van-button
            >
          </van-col>
        </van-row>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          :loading="loading"
          round
          block
          type="primary"
          native-type="submit"
        >
          登录
        </van-button>
      </div>
      <div style="margin: 16px">
        <van-button round block type="success" @click="toWechatAuth">
          微信授权登录
        </van-button>
      </div>
    </van-form>
    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model:show="showKeybord"
      @input="onInput"
      @blur="showKeybord = false"
      @delete="onDelete"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      disabled: false,
      time: 60,
      showKeybord: false,
      formData: {
        mobile: '',
        code: '',
      },
    }
  },
  computed: {
    codeText({ disabled, time }) {
      if (!disabled) return '获取验证码'
      return `${time}s后重新获取`
    },
  },
  created() {
    const code = this.getWechatCode()
    // this.getAccessToken(code)
  },
  methods: {
    onInput(val) {
      console.log('val:', val)
      this.formData.mobile += val
    },
    onDelete() {
      this.formData.mobile = this.formData.mobile.slice(0, -1)
    },
    onFocus() {
      document.activeElement.blur()
      this.showKeybord = true
    },
    async getCode() {
      try {
        await this.$refs.form.validate('mobile')
        this.disabled = true
        await this.mockRequest()
        this.$notify({ type: 'success', message: '发送成功' })
      } catch (err) {
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
    mockRequest() {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })
    },
    async submit() {
      try {
        await this.$refs.form.validate(['mobile', 'code'])
        this.loading = true
        await this.mockRequest()
        this.$notify({ type: 'success', message: '登录成功' })
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
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
  height: 108px;
  line-height: 108px;
  color: #fff;
  text-align: center;
  font-size: 20px;
}
.van-cell {
  padding: 48px var(--van-cell-horizontal-padding);
}
</style>
