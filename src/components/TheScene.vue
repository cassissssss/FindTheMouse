<script setup>
import { ref } from 'vue'

import '../aframe/clickable.js'
import '../aframe/duplicate.js'
import '../aframe/simple-navmesh-constraint.js'
import '../aframe/outline-bloom.js'
import '../aframe/placement-collision.js'
import '../aframe/spawn-from-catalog.js'
import '../aframe/catalog-spawner.js'
import '../aframe/spawn-box.js'
import '../aframe/move-sfx.js'
import '../utils/catalog.js'

import TheCameraRig from './TheCameraRig.vue'

import Speaker1 from '/assets/furnitures/speaker1.glb?url'
import Room from '/assets/room.glb?url'
import Desk from '/assets/furnitures/desk.glb?url'
import Couch from '/assets/furnitures/couch.glb?url'
import Pc from '/assets/furnitures/pc.glb?url'
import Cardbox from '/assets/cardbox.glb?url'
import Book2 from '/assets/furnitures/book2.glb?url'
import Books1 from '/assets/furnitures/books1.glb?url'
import Books2 from '/assets/furnitures/books2.glb?url'
import Candle from '/assets/furnitures/candle.glb?url'
import Chair from '/assets/furnitures/chair.glb?url'
import Cup from '/assets/furnitures/cup.glb?url'
import cup2 from '/assets/furnitures/cup2.glb?url'
import Discs from '/assets/furnitures/discs.glb?url'
import Keyboard from '/assets/furnitures/keyboard.glb?url'
import Kobo from '/assets/furnitures/kobo.glb?url'
import Lamp from '/assets/furnitures/lamp.glb?url'
import LittlePlant from '/assets/furnitures/little-plant.glb?url'
import LittleTable from '/assets/furnitures/little-table.glb?url'
import Mouse from '/assets/furnitures/mouse.glb?url'
import Painting from '/assets/furnitures/painting.glb?url'
import Photo from '/assets/furnitures/photo.glb?url'
import Plank1 from '/assets/furnitures/plank1.glb?url'
import Plank2 from '/assets/furnitures/plank2.glb?url'
import Plant from '/assets/furnitures/plant.glb?url'
import Vinyle from '/assets/furnitures/vinyle.glb?url'

import Navmesh from '/assets/navmesh.glb?url'


const allAssetsLoaded = ref(false)
</script>

<template>
  <a-scene stats physx="autoLoad: true;" outline-bloom="strength: 2.0; glow: 1; color: #00ff00">
    <a-assets @loaded="allAssetsLoaded = true">
      <a-asset-item id="speaker1-asset" :src="Speaker1"></a-asset-item>
      <a-asset-item id="desk-asset" :src="Desk"></a-asset-item>
      <a-asset-item id="pc-asset" :src="Pc"></a-asset-item>
      <a-asset-item id="couch-asset" :src="Couch"></a-asset-item>
      <a-asset-item id="room-asset" :src="Room"></a-asset-item>

      <a-asset-item id="book2-asset" :src="Book2"></a-asset-item>
      <a-asset-item id="books1-asset" :src="Books1"></a-asset-item>
      <a-asset-item id="books2-asset" :src="Books2"></a-asset-item>
      <a-asset-item id="candle-asset" :src="Candle"></a-asset-item>
      <a-asset-item id="chair-asset" :src="Chair"></a-asset-item>
      <a-asset-item id="cup-asset" :src="Cup"></a-asset-item>
      <a-asset-item id="cup2-asset" :src="cup2"></a-asset-item>
      <a-asset-item id="discs-asset" :src="Discs"></a-asset-item>
      <a-asset-item id="keyboard-asset" :src="Keyboard"></a-asset-item>
      <a-asset-item id="kobo-asset" :src="Kobo"></a-asset-item>
      <a-asset-item id="lamp-asset" :src="Lamp"></a-asset-item>
      <a-asset-item id="little-plant-asset" :src="LittlePlant"></a-asset-item>
      <a-asset-item id="little-table-asset" :src="LittleTable"></a-asset-item>
      <a-asset-item id="mouse-asset" :src="Mouse"></a-asset-item>
      <a-asset-item id="painting-asset" :src="Painting"></a-asset-item>
      <a-asset-item id="photo-asset" :src="Photo"></a-asset-item>
      <a-asset-item id="plank1-asset" :src="Plank1"></a-asset-item>
      <a-asset-item id="plank2-asset" :src="Plank2"></a-asset-item>
      <a-asset-item id="plant-asset" :src="Plant"></a-asset-item>
      <a-asset-item id="vinyle-asset" :src="Vinyle"></a-asset-item>

      <a-asset-item id="navmesh-asset" :src="Navmesh"></a-asset-item>

      <a-asset-item id="cardbox-asset" :src="Cardbox"></a-asset-item>

      <audio id="cardboard-sfx" src="/assets/sounds/box-sound.mp3" preload="auto"></audio>
      <audio id="creak-sfx" src="/assets/sounds/creaking-wood.mp3" preload="auto"></audio>
    </a-assets>

    <template v-if="allAssetsLoaded">
      <a-sky color="#87CEEB"></a-sky>

      <a-entity light="type: ambient; color: #ffffff; intensity: 0.35"></a-entity>

      <a-entity id="spawn-center" position="0 0.05 -2"></a-entity>

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
        position="4 8 3"
      ></a-entity>

      <!-- <a-entity
        light="
          type: point;
          color: #ffe2b8;
          intensity: 1.1;
          distance: 0.7;
          decay: 2;
        "
        position="0 2 -1"
      ></a-entity> -->

      <a-entity id="spawned-items"></a-entity>

      <a-entity
        id="catalog-spawner"
        catalog-spawner="
          mode: roundrobin;
          includeIds: desk,couch,chair,little-table,speaker,pc,keyboard,mouse,lamp,plant,little-plant,book2,books1,books2,cup,cup2,candle,kobo,painting,photo,vinyle,discs,plank1,plank2;
          container: #spawned-items;
          hideTargetSelector: #cardboard-stack;
          hideOnEmpty: true;
        "
      ></a-entity>

     <a-entity
        id="spawn-proxy"
        spawn-from-catalog="
          container: #spawned-items;
          handSelector: #hand-right;
          spawnAnchorSelector: #spawn-center;
          autoGrab: false;
          spawnHeight: 0.05;
          roomSelector: #room-entity;
          roomPadding: 0.5;
        "
        visible="false"
      ></a-entity>

      <a-entity
        id="cardboard-stack"
        class="clickable"
        gltf-model="#cardbox-asset"
        position="-1.430 0 -0.130"
        rotation="0 0 0"
        scale="1.3 1.3 1.3"
        spawn-box="spawner: #catalog-spawner; cooldownMs: 450;"
      >
        <a-sound
          src="#cardboard-sfx"
          autoplay="false"
          loop="false"
          volume="0.8"
          positional="true"
          distanceModel="inverse"
          refDistance="1"
          rolloffFactor="1.2"
        ></a-sound>
      </a-entity>

      <!-- Room + collisions -->
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

      <!-- Navmesh -->
      <a-entity
        id="nav-mesh"
        position="-6.6 0 0.3"
        data-role="nav-mesh"
        gltf-model="#navmesh-asset"
        visible="false"
      ></a-entity>
    </template>

    <TheCameraRig />
  </a-scene>
</template>