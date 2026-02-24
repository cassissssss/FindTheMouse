<script setup>
import { ref } from 'vue'
import '../aframe/clickable.js'
import '../aframe/duplicate.js'
import '../aframe/simple-navmesh-constraint.js'
import '../aframe/outline-bloom.js'

import TheCameraRig from './TheCameraRig.vue'

import Speaker1 from '/assets/furnitures/speaker1.glb?url'
import Room from '/assets/room.glb?url'
import Navmesh from '/assets/navmesh.glb?url'

const allAssetsLoaded = ref(false)
</script>

<template>
  <a-scene stats physx="autoLoad: true;" outline-bloom="strength: 2.0; glow: 1; color: #00ff00">
    <a-assets @loaded="allAssetsLoaded = true">
      <a-asset-item id="speaker1-asset" :src="Speaker1"></a-asset-item>
      <a-asset-item id="room-asset" :src="Room"></a-asset-item>
      <a-asset-item id="navmesh-asset" :src="Navmesh"></a-asset-item>
    </a-assets>

    <template v-if="allAssetsLoaded">
      <a-sky color="#87CEEB"></a-sky>

      <a-entity
        light="type: ambient; color: #ffffff; intensity: 0.35">
      </a-entity>
      <a-entity
        light="
          type: directional;
          color: #fff3d1;
          intensity: 2;
          castShadow: true;
          shadowMapWidth: 2048;
          shadowMapHeight: 2048;
          shadowCameraTop: 10;
          shadowCameraBottom: -10;
          shadowCameraLeft: -10;
          shadowCameraRight: 10;
        "
        position="4 8 3">
      </a-entity>

      <a-entity
        light="
          type: point;
          color: #ffe2b8;
          intensity: 1.1;
          distance: 0.7;
          decay: 2;
        "
        position="0 2 -1">
      </a-entity>

      <a-entity
        id="speaker1-entity"
        class="clickable"
        gltf-model="#speaker1-asset"
        position="1 0 -1"
        physx-grabbable="yMode: lock; floorOffsetY: 0.02"
        physx-body="type: dynamic"
        physx-shape="type: box"
        shadow="cast: true; receive: true"
      ></a-entity>

      <!-- <a-entity
        id="sofa"
        class="clickable"
        gltf-model="#sofa-asset"
        position="0 0 -2"
        physx-grabbable="yMode: lock"
      ></a-entity> 
      
      <a-entity
        id="mug"
        class="clickable"
        gltf-model="#mug-asset"
        position="0 0.9 -1"
        physx-grabbable="yMode: range; minY: 0.75; maxY: 1.10"
      ></a-entity>-->

      <a-entity
        id="room-entity"
        class="floor room-collider"
        gltf-model="#room-asset"
        position="0 0 0"
        rotation="0 0 0"
        scale="1 1 1"
        physx-body="type: static"
        physx-shape="type: mesh"
      ></a-entity>
      <a-entity
        id="nav-mesh"
        position="-6.6 0 0.3"
        data-role="nav-mesh"
        gltf-model="#navmesh-asset"
        visible="false">
      </a-entity>
    </template>

    <TheCameraRig />
  </a-scene>
</template>