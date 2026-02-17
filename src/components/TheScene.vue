<script setup>
  import { ref } from 'vue';
  import '../aframe/clickable.js';
  import '../aframe/duplicate.js';
  import '../aframe/simple-navmesh-constraint.js';
  import Ground from './Ground.vue';
  import Ocean from './Ocean.vue';
  import bridgeModel from '/assets/dreamy_bridge.glb?url';

  import TheCameraRig from './TheCameraRig.vue';

  const allAssetsLoaded = ref(false);
</script>

<template>
  <a-scene
    background="color: black;"
  >
    <a-asset-item id="bridge" :src="bridgeModel"></a-asset-item>

    <a-assets @loaded="allAssetsLoaded = true">

    </a-assets>

    <template v-if="allAssetsLoaded">

      <Ground
      :posX="0"
      :posY="0.5"
      :posZ="0"
      :tileSize="1"
      :rows="6"
      :cols="6"
      :offset="0"
      :center="true"
      :color="'#848484'"
      />
      <Ground
      :posX="0"
      :posY="0.5"
      :posZ="-3.9"
      :tileSize="1"
      :rows="2"
      :cols="2"
      :offset="0"
      :center="true"
      :color="'#848484'"
      />
    <Ocean
      :density="25"
      :width="100"
      :depth="100"
      :speed="3"
      :color="'#88cff1'"
      :opacity="0.85"
      :metalness="0.3"
      :roughness="0.8"
    ></Ocean>

    <a-entity gltf-model="#bridge" position="0 0.5 -9.8" rotation="0 -90 0" scale="0.035 0.035 0.035"></a-entity>
    
    </template>
    <TheCameraRig />


  </a-scene>
</template>