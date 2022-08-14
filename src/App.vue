<template>
  <layout>
    <router-view></router-view>
  </layout>
</template>
<script>
import Layout from '@/views/layout/index.vue'
export default {
  name: 'App',
  components: { Layout },
}
</script>
