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
// 增加点光源
const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
pointLight.position.set( 13, 13, 13 );
scene.add( pointLight );
// 点光源辅助线
const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );

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
      const model = gltf.scene;
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