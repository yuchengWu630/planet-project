<template>
  <layout v-if="isLayout">
    <router-view></router-view>
  </layout>
  <router-view v-else></router-view>
</template>
<script >
import Layout from '@/views/layout/index.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// import { useRouter, useRoute } from "vue-router";
// let router = useRouter()
// let c = useRoute()
export default {
  name: 'App',
  components: { Layout },
  setup() {
    const router = useRouter();
    let isLayout = ref(false);
    onMounted(() => {
      // 打印
      console.log(router.currentRoute.value.fullPath.includes('game'))
      if (router.currentRoute.value.fullPath.includes('game')) {
        isLayout = false
      }
      console.log('router:', router.currentRoute.value.fullPath)
    })
    return {
      isLayout
    }
  }
}
</script>
