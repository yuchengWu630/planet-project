<template>
  <van-form ref="form">
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
  methods: {
    onInput(val) {
      console.log('input')
      const updateVal = this[this.activeKey] + val
      console.log('updateVal:', val, `update:${this.activeKey}`)
      this.$emit(`update:${this.activeKey}`, updateVal)
    },
    onDelete() {
      console.log('delete')
      const updateVal = this[this.activeKey].slice(0, -1)
      this.$emit(`update:${this.activeKey}`, updateVal)
    },
    onFocus(key) {
      document.activeElement.blur()
      this.showKeybord = true
      this.activeKey = key
    },
    updatePhone(val) {
      console.log('val:', val)
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
.van-cell {
  padding: 40px var(--van-cell-horizontal-padding);
}
</style>
