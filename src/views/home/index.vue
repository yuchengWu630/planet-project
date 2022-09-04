<template>
  <div style="background:#000">
    <adv v-show="showCanvas" :showCanvas="showCanvas"></adv>
    <pro v-show="showCanvas" :progress="progress"></pro>
    <div id="planetCanvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
// import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "@/utils/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const scene = new THREE.Scene();
const dracoLoader = new DRACOLoader();
const { VITE_MODEL_URL } = import.meta.env
const loader = new GLTFLoader();
const sun = new THREE.Vector3();
let camera
let showCanvas = ref(true);
let progress = ref(0);
let timeOut = null
let renderEnabled


let directionLight=new THREE.DirectionalLight(
    0xcccccc, // 光的颜色 默认0xffffff
    .7 // 光照的强度 默认1
);
// 平行光的位置
directionLight.position.set( 15, 40, 15 );
// 如果设置为 true 该平行光会产生动态阴影。
directionLight.castShadow = true;
// 如果非零，那么光强度将会从最大值当前灯光位置处按照距离线性衰减到0。 缺省值为 0.0
directionLight.distance = 200;
// 将平行光添加到场景中
scene.add( directionLight )

var material = new THREE.ShadowMaterial();
material.opacity = 0.4;
var geometry = new THREE.PlaneBufferGeometry( 300, 300 );
// 创建网格对象 物体 材质
var mesh = new THREE.Mesh( geometry, material );
// 设置网格对象的位置
mesh.position.set( 0, -.9, 0 );
// 沿着X轴旋转
mesh.rotation.x = - Math.PI * 0.5;
// 接受阴影
mesh.receiveShadow = true; 
// 将网格对象添加到场景中
scene.add( mesh );

resizeCanvasRatio()

renderer.outputEncoding = THREE.sRGBEncoding;
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;
camera.position.set(.1, 2, -11);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.maxDistance = 16;
controls.minDistance = 4;
controls.maxPolarAngle = 1.56;
console.log(`${VITE_MODEL_URL}`)
dracoLoader.setDecoderPath(`${VITE_MODEL_URL}/libs/`);
new THREE.CubeTextureLoader().load([
  `${VITE_MODEL_URL}/libs/px.jpg`,
  `${VITE_MODEL_URL}/libs/nx.jpg`,
  `${VITE_MODEL_URL}/libs/py.jpg`,
  `${VITE_MODEL_URL}/libs/ny.jpg`,
  `${VITE_MODEL_URL}/libs/pz.jpg`,
  `${VITE_MODEL_URL}/libs/nz.jpg`
], function (cubeTexture) {
  // cubeTexture.encoding = THREE.sRGBEncoding;
  scene.background = cubeTexture;
});
loader.setDRACOLoader(dracoLoader);

function initDraw() {
  // document.getElementById('app').style.width = document.documentElement.clientWidth
  // document.getElementById('app').style.height = document.documentElement.clientHeight
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true
  const container = document.getElementById("planetCanvas");
  container.appendChild(renderer.domElement);
  dracoLoader.setDecoderPath(`${VITE_MODEL_URL}/libs/`);
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    `${VITE_MODEL_URL}/libs/planet.glb`,
    function (gltf) {
      if (progress.value >= 100) {
        const model = gltf.scene;
        // console.log(model)
        model.castShadow = true
        const deep = (arr) => {
          arr.forEach(i => {
              i.castShadow = true
              if (i.children.length) {
                deep(i.children)
              }
          })
        }
        deep(model.children)
        model.scale.set(0.04, 0.04, 0.04);
        scene.add(model);
        renderer.render(scene, camera);
        showCanvas.value = false;
        // const timer = setTimeout(() => {
        animate();
        // }, 3000)
      }
    },
    onProgress,
    function (e) {
      console.error(e);
    }
  );
}

function matchPercentage(data) {
  let result = (data * 100).toFixed(0);
  return result;
}

function onProgress(xhr) {
  progress.value = matchPercentage(xhr.loaded / xhr.total);
}

function animate() {
  // controls.update();
  if (renderEnabled) {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

function resizeCanvasRatio() {
  if (
    window.orientation == null ||
    window.orientation === 180 ||
    window.orientation === 0
  ) {
    renderer.setSize(window.innerHeight, window.innerWidth);
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerHeight / window.innerWidth,
      1,
      100
    );

  } else if (window.orientation === 90 || window.orientation === -90) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
  }
}

controls.addEventListener('change', function(){
  console.log('321321321312312=============32132132131213')
    timeRender();
});

function timeRender() {
	//设置为可渲染状态
    renderEnabled = true;
    //清除上次的延迟器
    if (timeOut) {
        clearTimeout(timeOut);
    }
 
    timeOut = setTimeout(function () {
        renderEnabled = false;
    }, 3000);
}

onMounted(() => {
  initDraw();
})
</script>

<style>

</style>