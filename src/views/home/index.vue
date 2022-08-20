<template>
  <div id="planetCanvas"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
// import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "@/utils/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const scene = new THREE.Scene();
const dracoLoader = new DRACOLoader();
const { VITE_MODEL_URL } = import.meta.env
const loader = new GLTFLoader();
let camera
let directionLight=new THREE.DirectionalLight(
    0xffffff, // 光的颜色 默认0xffffff
    1 // 光照的强度 默认1
);
// 平行光的位置
directionLight.position.set( 15, 40, 35 );
// 如果设置为 true 该平行光会产生动态阴影。
directionLight.castShadow = true;
// 如果非零，那么光强度将会从最大值当前灯光位置处按照距离线性衰减到0。 缺省值为 0.0
directionLight.distance = 200;
// 将平行光添加到场景中
scene.add( directionLight );

// // 用于模拟聚光灯 SpotLight 的锥形辅助对象.
// lightHelper = new THREE.directionLightHelper( directionLight );
// // 将模拟聚光灯辅助对象添加到场景中
// scene.add( lightHelper );
// // 增加点光源
// const pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
// pointLight.position.set( 13, 13, 13 );
// scene.add( pointLight );
// // 点光源辅助线
// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );

var material = new THREE.MeshPhongMaterial( { 
    color: 0xffffff, 
    dithering: true 
} );
var geometry = new THREE.PlaneBufferGeometry( 300, 300 );
// 创建网格对象 物体 材质
var mesh = new THREE.Mesh( geometry, material );
// 设置网格对象的位置
mesh.position.set( 0, 0, 0 );
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
camera.position.set(10.6, 2, -0.1);
const controls = new OrbitControls(camera, renderer.domElement);
console.log(controls.handleTouchStartRotate)
// controls.touches = {
// 	ONE: THREE.TOUCH.ROTATE,
// 	TWO: THREE.TOUCH.DOLLY_PAN
// }
// console.log(THREE.TOUCH.ROTATE)
// const updateCamera = function (object, elapsed) {
//   camera.position.set(object.x, object.y, object.z);
//   camera.lookAt(
//     new THREE.Vector3(object.lookAtX, object.lookAtY, object.lookAtZ)
//   );
// };
// controls.update();
// controls.enablePan = false;
// controls.enableDamping = true;
// controls.maxDistance = 30;
// controls.minDistance = 6;
// controls.maxPolarAngle = 1.56;

function initDraw() {
  // document.getElementById('app').style.width = document.documentElement.clientWidth
  // document.getElementById('app').style.height = document.documentElement.clientHeight
  renderer.outputEncoding = THREE.sRGBEncoding;
  const container = document.getElementById("planetCanvas");
  container.appendChild(renderer.domElement);
  dracoLoader.setDecoderPath(`${VITE_MODEL_URL}`);
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    `${VITE_MODEL_URL}planet.glb`,
    function (gltf) {
      console.log(gltf)
      const model = gltf.scene;
      model.castShadow = true
      model.children.forEach(i => {
        i.castShadow = true
      })
      model.scale.set(0.04, 0.04, 0.04);
      scene.add(model);
      renderer.render(scene, camera);
      animate();
    },
    ()=>{},
    function (e) {
      console.error(e);
    }
  );
}

function animate() {
  // controls.update();
  renderer.render(scene, camera);
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


onMounted(() => {
  initDraw();
})
</script>

<style>

</style>