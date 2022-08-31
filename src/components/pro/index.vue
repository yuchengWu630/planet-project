<template>
  <div class="progress-box">
    <div class="progress">
      <div class="progress-wrapper">
        <div class="back fill">
          <div class="before" :style="'width:' + progress + '%'"></div>
        </div>
        <div class="front fill">
          <div class="before" :style="'width:' + progress + '%'"></div>
        </div>
        <div class="left"></div>
        <div class="up fill">
          <div class="before" :style="'width:' + progress + '%'"></div>
        </div>
        <div class="down fill">
          <div class="before" :style="'width:' + progress + '%'"></div>
        </div>
        <div class="percent-tip" :style="'left:' + (progress - 8) + '%'">
          <span>{{ progress }}</span
          >%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({
  //子组件接收父组件传递过来的值
  progress: String | Number,
});
//使用父组件传递过来的值
const { progress } = toRefs(props);
</script>

<style>
.progress-box {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
.progress {
  width: 400px;
  height: 100px;
  margin: 0 auto;
  perspective: 1000px;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  /* margin-top: -60px; */
}
.progress .progress-wrapper {
  width: 400px;
  height: 100px;
  transition: 0.6s;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  position: relative;
  transform: rotateX(40deg);
}

.progress .progress-wrapper div {
  text-align: center;
  line-height: 100px;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
}

.progress .progress-wrapper div.back {
  box-shadow: 0 -16px 80px rgba(0, 0, 0, 0.15),
    0 16px 8px -5px rgba(0, 0, 0, 0.3), 0 -60px 140px rgba(254, 254, 254, 0.6);
  transform-origin: 50% 50%;
  transform: translateZ(-100px);
}

.progress .progress-wrapper div.front {
  transform-origin: 50% 100%;
  transform: translateZ(0);
}

.progress .progress-wrapper div.left {
  width: 100px;
  height: 100px;
  transform-origin: 0% 100%;
  transform: rotateY(90deg);
}

.progress .progress-wrapper div.right {
  width: 100px;
  height: 100px;
  right: 0;
  top: 0;
  transform-origin: 100% 100%;
  transform: rotateY(-90deg);
}

.progress .progress-wrapper div.up {
  width: 400px;
  height: 100px;
  transform-origin: 50% 0%;
  transform: rotateX(-90deg);
}

.progress .progress-wrapper div.down {
  width: 400px;
  height: 100px;
  transform-origin: 50% 100%;
  transform: rotateX(90deg);
}

.progress-wrapper .fill .before {
  width: 300px;
  height: 100px;
  background-color: rgba(0, 0, 0, 0.8);
  content: " ";
  display: block;
  position: absolute;
  margin: 0;
  box-sizing: border-box;
  transition: all 0.5s ease-out;
}

.progress .progress-wrapper .percent-tip {
  width: 80px;
  height: 50px;
  /* background-color: steelblue; */
  transform: translateZ(-100px) translateY(115px);
  box-shadow: 0 -16px 80px rgba(0, 0, 0, 0.15),
    0 16px 8px -5px rgba(0, 0, 0, 0.3), 0 -60px 140px rgba(254, 254, 254, 0.6);
  color: #000;
  line-height: 50px;
  /* left: 270px; */
  transition: all 0.5s ease-out;
}

.progress .progress-wrapper .percent-tip::before {
  content: " ";
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px;
  border-color: #fff;
  position: absolute;
  left: 20px;
  top: -17px;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}

.progress .progress-wrapper:hover .fill::before {
  background-color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
}
</style>