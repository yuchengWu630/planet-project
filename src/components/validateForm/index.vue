<template>
  <van-form ref="form" class="validate-form" :style="formStyles">
    <van-cell-group inset>
      <van-field
        :modelValue="phone"
        name="phone"
        label="手机号"
        placeholder="手机号"
        :rules="[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[23456789]\d{9}$/, message: '手机号格式错误' },
        ]"
        @update:model-value="updatePhone"
        @focus="onFocus('phone')"
      />
      <van-row style="align-items: center">
        <van-col span="16">
          <van-field
            :modelValue="code"
            type="digit"
            name="code"
            label="验证码"
            placeholder="验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
            @update:modelValue="updateCode"
            @focus="onFocus('code')"
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
  </van-form>
  <!-- 数字键盘 -->
  <van-number-keyboard
    close-button-text="完成"
    :title="keyboardTitle"
    v-model:show="showKeybord"
    @input="onInput"
    @blur="showKeybord = false"
    @delete="onDelete"
  />
</template>
<script>
import request from '@/utils/axios'
export default {
  props: {
    // 0-注册；1:登陆；2-手机绑定
    type: {
      type: Number,
      default: 1,
    },
    phone: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      disabled: false,
      time: 60,
      showKeybord: false,
      activeKey: 'phone',
    }
  },
  computed: {
    codeText({ disabled, time }) {
      if (!disabled) return '获取验证码'
      return `${time}s后重新获取`
    },
    keyboardTitle({ activeKey }) {
      return this[activeKey]
    },
  },
  watch: {
    showKeybord(val) {
      this.$emit('on-keyboard-show', val)
    },
  },
  methods: {
    onInput(val) {
      const updateVal = this[this.activeKey] + val
      this.$emit(`update:${this.activeKey}`, updateVal)
    },
    onDelete() {
      const updateVal = this[this.activeKey].slice(0, -1)
      this.$emit(`update:${this.activeKey}`, updateVal)
    },
    onFocus(key) {
      document.activeElement.blur()
      this.showKeybord = true
      this.activeKey = key
    },
    updatePhone(val) {
      this.$emit('update:phone', val)
    },
    updateCode(val) {
      this.$emit('update:code', val)
    },
    validate() {
      return this.$refs.form.validate(['phone', 'code'])
    },
    async getCode() {
      try {
        await this.$refs.form.validate('phone')
        this.disabled = true
        await request({
          url: 'api/bz/user/phone/send',
          method: 'post',
          params: {
            type: this.type,
            phone: this.phone,
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
  },
}
</script>

<style>
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
.validate-form {
  border: 1px solid #eee;
  margin: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.van-cell {
  padding: 32px var(--van-cell-horizontal-padding);
}
.login .van-number-keyboard {
  bottom: auto;
  left: auto;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
}
.login .van-number-keyboard .van-number-keyboard__header {
  height: 100px;
}
.login .van-number-keyboard .van-key {
  height: 100px;
}
</style>
