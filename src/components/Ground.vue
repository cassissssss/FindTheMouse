<script setup>
import { computed } from 'vue';
 
const props = defineProps({
  posX: { type: Number, default: 0 },
  posY: { type: Number, default: 0.2 },
  posZ: { type: Number, default: 0 },
  tileSize: { type: Number, default: 1 },
  rows: { type: Number, default: 2 },
  cols: { type: Number, default: 2 },
  offset: { type: Number, default: 0.1 },
  tileDepth: { type: Number, default: 1 },
  center: { type: Boolean, default: false },
  color: { type: String, default: '#C9B79C' },
  visible: { type: Boolean, default: true },
  navmesh: { type: Boolean, default: true }
});
 
const navmeshWidth = computed(() =>
  props.rows * props.tileSize + Math.max(props.rows - 1, 0) * props.offset
);
 
const navmeshDepth = computed(() =>
  props.cols * props.tileDepth + Math.max(props.cols - 1, 0) * props.offset
);
</script>
 
<template>
  <a-entity>
    <a-box
      v-if="navmesh"
      data-role="nav-mesh"
      :position="`${posX} 0 ${posZ}`"
      :width="navmeshWidth"
      height="0.2"
      :depth="navmeshDepth"
      material="opacity: 100; transparent: false; shader: flat"
      color="red"
      visible="false"
    ></a-box>
    <a-box v-if="visible"
      :position="`${posX} ${posY} ${posZ}`"
      :width="tileSize"
      :height="0.2"
      :depth="tileDepth"
      :color="color"
      :duplicate="`rows: ${rows}; cols: ${cols}; width: ${tileSize}; depth: ${tileDepth}; gap: ${offset}; center: ${center}`"
    ></a-box>
  </a-entity>
</template>