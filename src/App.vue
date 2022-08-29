<template>
  <layout>
    <router-view></router-view>
  </layout>
</template>
<script>
import Layout from '@/views/layout/index.vue'
import { useUserStore } from '@/store/index.js'
export default {
  name: 'App',
  created() {
    const userStore = useUserStore()
    const userInfo =
      localStorage && localStorage.userInfo
        ? JSON.parse(localStorage.userInfo)
        : {}
    if (userInfo.key) {
      userStore.setUserInfo(userInfo)
    }
  },
  components: { Layout },
}
</script>
