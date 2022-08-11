<template>
  <div>
    <div v-show="showCanvas" class="box">
      <div class="logo"></div>
      <div class="container">
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
    <div v-show="showCanvas" class="mask"></div>
    <div id="content"></div>
    <van-popup class="popup-box" round v-model:show="showModal" :close-on-click-overlay="false">
      <div class="modal">
        <div class="modal-icon">
          <van-icon name="fail" class="icon-gantanhao" size="40"/>
        </div>
        <h2>{{title}}展厅装修中</h2>
        <div>【即将开放 敬请期待】</div>
        <div class="button" @click="handleCloseModal">知道了</div>
        <!-- <van-button color="#666666" plain type="primary">知道了</van-button> -->
      </div>
    </van-popup>
    <div>
      <iframe
        v-show="iframeSrc"
        id="iframe"
        :src="iframeSrc"
        frameborder="0"
      ></iframe>
      <van-icon v-if="iframeSrc" class="icon-back" name="arrow-left" @click="handleCloseModal"/>
      <div v-if="!showCanvas" class="audio-box">
        <audio ref="audio" style="display: none" autoplay loop class="audio-button">
          <source :src="audioSrc"/>
        </audio>
        <van-icon :name="playStart ? 'play-circle-o': 'pause-circle-o'" @click="handlePlayAudio"/>
      </div>
    </div>


    <div v-if="isPoster" class="contest-poster">
      <van-icon color="#fff" class="poster-close" name="cross" @click="handleCloseModal"/>
      <div class="poster-button">
        <van-icon name="arrow-left" color="#999" size="40" @click="isZh = !isZh"/>
        <van-icon name="arrow" color="#999" size="40" @click="isZh = !isZh"/>
      </div>
      <div v-if="isZh" class="zh-poster"></div>
      <div v-if="!isZh" class="en-poster"></div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
// import { NModal, NCard } from 'naive-ui'
import { debounce } from "@/utils/util";

let progress = ref(0);
let showCanvas = ref(true);
let animalEnd = ref(false);
let showModal = ref(false);
let isPoster = ref(false);
let title = ref("");
let iframeSrc = ref("");
let playStart = ref(true);
let audio = ref()
let audioSrc = ref('')
let isZh = ref(true)

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const scene = new THREE.Scene();
const dracoLoader = new DRACOLoader();
const loader = new GLTFLoader();

onMounted(() => {
  drawThree();
});

// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  100
);
camera.position.set(10.6, 2, -0.1);
const controls = new OrbitControls(camera, renderer.domElement);
const tweenCamera1 = new TWEEN.Tween({
  x: 32,
  y: 4,
  z: -0.1,
  lookAtX: 0,
  lookAtY: 0,
  lookAtZ: 0,
}).to({ x: 17.6, y: 1, z: -0.1, lookAtX: 0, lookAtY: 0, lookAtZ: 0 }, 2600);
const updateCamera = function (object, elapsed) {
  camera.position.set(object.x, object.y, object.z);
  camera.lookAt(
    new THREE.Vector3(object.lookAtX, object.lookAtY, object.lookAtZ)
  );
};
tweenCamera1.onUpdate(updateCamera);
tweenCamera1.onComplete(function () {
  animalEnd.value = true;
});
controls.update();
controls.enablePan = false;
controls.enableDamping = true;
controls.maxDistance = 30;
controls.minDistance = 6;
controls.maxPolarAngle = 1.56;

function drawThree() {
  const container = document.getElementById("content");
  container.appendChild(renderer.domElement);
  const urls = [
    "src/assets/px.jpg",
    "src/assets/nx.jpg",
    "src/assets/py.jpg",
    "src/assets/ny.jpg",
    "src/assets/pz.jpg",
    "src/assets/nz.jpg",
  ];
  dracoLoader.setDecoderPath("src/assets/");
  new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {
    // cubeTexture.encoding = THREE.sRGBEncoding;
    scene.background = cubeTexture;
  });
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "src/assets/planet.glb",
    function (gltf) {
      if (progress.value >= 100) {
        const model = gltf.scene;
        model.scale.set(0.04, 0.04, 0.04);
        scene.add(model);
        renderer.render(scene, camera);
        const timer = setTimeout(() => {
          tweenCamera1.start();
          showCanvas.value = false;
          audioSrc = 'src/assets/music.mp3'
          // handlePlayAudio()
          animate();
        }, 3000);
      }
    },
    onProgress,
    function (e) {
      console.error(e);
    }
  );

  container.addEventListener("click", onPointerMove);
  container.addEventListener("touchend", onPointerMove);
}

function animate() {
  TWEEN.update();
  controls.update();
  renderer.render(scene, camera);
  if(showModal.value) return
  if(iframeSrc.value !== '') return
  if(isPoster.value) return
  requestAnimationFrame(animate);
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (!showModal.value) {
    raycaster.setFromCamera(pointer, camera);
    // const intersects = raycaster.intersectObjects(scene.children);
    raycastMeshes(clickApp, raycaster);
  }
}

function raycastMeshes(callback, raycaster) {
  let intersects = [];
  let theScene = scene || new THREE.Scene();
  let theRaycaster = raycaster || new THREE.Raycaster();
  for (let i in theScene.children) {
    if (
      theScene.children[i] instanceof THREE.Group ||
      theScene.children[i] instanceof THREE.Scene
    ) {
      let rayArr = theRaycaster.intersectObjects(
        theScene.children[i].children,
        true
      );
      intersects.push(...rayArr);
    } else if (theScene.children[i] instanceof THREE.Mesh) {
      // 如果场景的子节点是Mesh网格对象，场景子节点被射线穿过的模型的数组集合
      // intersects.push(theRaycaster.intersectObject(theScene.children[i]))
    }
  }
  intersects = filtersVisibleFalse(intersects); // 过滤掉不可见的
  // 被射线穿过的模型的数组集合
  if (intersects && intersects.length > 0) {
    return callback(intersects);
  } else {
    // this.hiddenDetailDiv()
    return null;
  }
}

function filtersVisibleFalse(arr) {
  let arrList = arr;
  if (arr && arr.length > 0) {
    arrList = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].object.visible) {
        arrList.push(arr[i]);
      }
    }
  }
  return arrList;
}

const clickApp = debounce(function (intersects) {
  if (intersects[0].object !== undefined) {
    console.log(intersects[0].object.name, "这就是成功点击到的对象了~");
    switch (intersects[0].object.name) {
      case "Mesh013":
      case "Mesh013_1":
        // idc show
        title.value = "IDC SHOW WORLD";
        showModal.value = true;
        break;
      case "Plane002_1":
      case "Plane002_2":
      case "Plane002_3":
        // 品牌馆
        iframeSrc.value = "http://dc.szleather.org/";
        // location.replace("http://dc.szleather.org/");
        break;
      case "Mesh026":
      case "Mesh026_1":
        // 品牌馆
        title.value = "高能营";
        showModal.value = true;
        break;
      case "Mesh018":
      case "Mesh018_1":
        // 达人馆
        title.value = "干货站";
        showModal.value = true;
        break;
      case "Mesh031":
      case "Mesh031_1":
        // 尚学院
        title.value = "i酷学院";
        showModal.value = true;
        break;
      case "Plane004":
      case "Mesh023_1":
      case "Mesh023":
        // 显示器
        // title.value = "赛事专栏";
        // showModal.value = true;
        isPoster.value = true
        break;
      case "Mesh035":
      case "Mesh035_1":
        // coffee
        title.value = "IDC bot";
        showModal.value = true;
        break;
      case "Mesh039":
      case "Mesh039_1":
        // 创新营
        title.value = "顶流馆";
        showModal.value = true;
        break;
    }
  }
}, 200);

function matchPercentage(data) {
  let result = (data * 100).toFixed(0);
  return result;
}

function onProgress(xhr) {
  progress.value = matchPercentage(xhr.loaded / xhr.total);
}

function handleCloseModal() {
  showModal.value = false;
  iframeSrc.value = ''
  isPoster.value = false
  requestAnimationFrame(animate);
}

function handlePlayAudio() {
  playStart.value = !playStart.value
  if (playStart.value) {
    audio._value.pause()
  } else {
    audio._value.play()
  }
}
</script>

<style scoped>
#iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background: #fff;
}

.audio-box {
  position: absolute;
  top: 8px;
  right:20px;
  font-size: 30px;
  color: #000;
}

.icon-back {
  position: absolute;
  top: 12px;
  left: 16px;
  font-size: 30px;
  color: #000;
}

.box {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
}
.logo {
  width: 390px;
  height: 60px;
  background: url("../../assets/loadingҳ-logo.png") no-repeat;
  background-size: contain;
  margin: 0 auto;
}
.icon-gantanhao {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.container {
  width: 400px;
  height: 100px;
  margin: 0 auto;
  perspective: 1000px;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
}
.container .progress-wrapper {
  width: 400px;
  height: 100px;
  transition: 0.6s;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  position: relative;
  transform: rotateX(40deg);
}

.container .progress-wrapper div {
  text-align: center;
  line-height: 100px;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
}

.container .progress-wrapper div.back {
  box-shadow: 0 -16px 80px rgba(0, 0, 0, 0.15),
    0 16px 8px -5px rgba(0, 0, 0, 0.3), 0 -60px 140px rgba(254, 254, 254, 0.6);
  transform-origin: 50% 50%;
  transform: translateZ(-100px);
}

.container .progress-wrapper div.front {
  transform-origin: 50% 100%;
  transform: translateZ(0);
}

.container .progress-wrapper div.left {
  width: 100px;
  height: 100px;
  transform-origin: 0% 100%;
  transform: rotateY(90deg);
}

.container .progress-wrapper div.right {
  width: 100px;
  height: 100px;
  right: 0;
  top: 0;
  transform-origin: 100% 100%;
  transform: rotateY(-90deg);
}

.container .progress-wrapper div.up {
  width: 400px;
  height: 100px;
  transform-origin: 50% 0%;
  transform: rotateX(-90deg);
}

.container .progress-wrapper div.down {
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

.container .progress-wrapper .percent-tip {
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

.container .progress-wrapper .percent-tip::before {
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

.container .progress-wrapper:hover .fill::before {
  background-color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
}

.modal {
  padding: 40px 20px;
  width: 400px;
  box-sizing: border-box;
  font-size: 16px;
  background: #e6e6e6;
  text-align: center;
  font-weight: 400;
}

.modal h2 {
  font-weight: 400;
}

.modal-icon {
  border-radius: 100%;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  background: #d2d2d2;
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 20px;
}

.button {
  border: 1px solid #666666;
  background: #e6e6e6;
  border-radius: 4px;
  width: 140px;
  margin: 0 auto;
  padding: 8px 0;
  margin-top: 40px;
  cursor: pointer;
}

.contest-poster {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  background: #000;
}

.poster-button {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.zh-poster {
  width: 100%;
  height: 100%;
  background: url('../../assets/hb1.jpeg') no-repeat center;
  background-size: contain;
}
.en-poster {
  width: 100%;
  height: 100%;
  background: url('../../assets/hb2.jpeg') no-repeat center;
  background-size: contain;
}

.poster-close {
  position: absolute;
  right: 0px; 
  top: 12px;
  right: 16px;
  font-size: 30px;
  color: #fff;
}
</style>