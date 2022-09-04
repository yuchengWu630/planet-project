<template>
  <div :class="[('adv-img-'+ratio), 'adv']">
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const ratio = ref(1) 

const props = defineProps({
  showCanvas: String | Number,
});

console.log(props.showCanvas)

watch(() => props.showCanvas, (nv, ov) => {
  console.log(nv)
  if (!nv) {
    clearInterval(time)
  }
})

const time = setInterval(() => {
  getBackgroundNum()
}, 3000)

function getBackgroundNum () {
  let num = Math.floor(Math.random()*4+1)
  if (ratio.value !== num) {
    ratio.value = num
    return
  }
  getBackgroundNum()
}

</script>

<style>
.adv {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: 1s ease-out;
}
.adv-img-2 {
  background:url('../../assets/adv/2.jpg') no-repeat center;
  background-size: contain;
}
.adv-img-3 {
  background:url('../../assets/adv/3.jpg') no-repeat center;
  background-size: contain;
}
.adv-img-4 {
  background:url('../../assets/adv/4.jpg') no-repeat center;
  background-size: contain;
}
.adv-img-1 {
  background:url('../../assets/adv/1.jpg') no-repeat center;
  background-size: contain;
}
</style>