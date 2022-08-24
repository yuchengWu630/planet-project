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


let directionLight=new THREE.DirectionalLight(
    0xcccccc, // 光的颜色 默认0xffffff
    .7 // 光照的强度 默认1
);
// 平行光的位置
directionLight.position.set( 15, 40, 35 );
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
mesh.position.set( 0, 0, 0 );
// 沿着X轴旋转
mesh.rotation.x = - Math.PI * 0.5;
// 接受阴影
mesh.receiveShadow = true; 
// 将网格对象添加到场景中
scene.add( mesh );

// 水材质
// const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
// const water = new Water(
//   waterGeometry,
//   {
//     textureWidth: 512,
//     textureHeight: 512,
//     waterNormals: new THREE.TextureLoader().load( `${VITE_MODEL_URL}/libs/waternormals.jpg`, function ( texture ) {

//       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

//     } ),
//     sunDirection: new THREE.Vector3(),
//     sunColor: 0xffffff,
//     waterColor: 0x001e0f,
//     distortionScale: 3.7,
//     fog: scene.fog !== undefined
//   }
// );
// water.rotation.x = - Math.PI / 2
// water.position.set( 0, 0, 0 )
// scene.add( water )

// const sky = new Sky()
// sky.scale.setScalar( 10000 )
// scene.add( sky )

// const skyUniforms = sky.material.uniforms

// skyUniforms[ 'turbidity' ].value = 10
// skyUniforms[ 'rayleigh' ].value = 2
// skyUniforms[ 'mieCoefficient' ].value = 0.005
// skyUniforms[ 'mieDirectionalG' ].value = 0.8

// const parameters = {
//   elevation: 0,
//   azimuth: 250
// }

// function updateSun() {

//   const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
//   const theta = THREE.MathUtils.degToRad( parameters.azimuth );

//   sun.setFromSphericalCoords( 1, phi, theta );

//   sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
//   water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

//   scene.environment = pmremGenerator.fromScene( sky ).texture;

// }

// updateSun();

// const pmremGenerator = new THREE.PMREMGenerator( renderer );

resizeCanvasRatio()

renderer.outputEncoding = THREE.sRGBEncoding;
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;
camera.position.set(10.6, 2, -0.1);
const controls = new OrbitControls(camera, renderer.domElement);
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
  renderer.shadowMap.enabled = true
  const container = document.getElementById("planetCanvas");
  container.appendChild(renderer.domElement);
  dracoLoader.setDecoderPath(`${VITE_MODEL_URL}/libs/`);
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    `${VITE_MODEL_URL}/libs/planet.glb`,
    function (gltf) {
      const model = gltf.scene;
      console.log(model)
      model.castShadow = true
      const deep = (arr) => {
        arr.forEach(i => {
          // console.log('name', i.name, (i.name).includes('shadow'))
          // if ((i.name).includes('shadow')) { 
            i.castShadow = true
            if (i.children.length) {
              deep(i.children)
            }
          // }
        })
      }
      deep(model.children)
      // model.position.set( 0, .3, 0 )
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
  // water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

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