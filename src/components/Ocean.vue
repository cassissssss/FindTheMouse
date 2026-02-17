<script setup>
defineProps({
  density: { type: Number, default: 25 },
  width: { type: Number, default: 100 },
  depth: { type: Number, default: 100 },
  speed: { type: Number, default: 3 },
  color: { type: String, default: '#88cff1' },
  opacity: { type: Number, default: 0.85 },
  metalness: { type: Number, default: 0.3 },
  roughness: { type: Number, default: 0.8 }
});
</script>

<template>
  <!-- Pluie -->
  <a-entity particle-system="preset: rain; color: #24CAFF; particleCount: 2000"></a-entity>

  <!-- Océan natif A-Frame - Couche 1 -->
  <a-entity :ocean="`density: ${density}; width: ${width}; depth: ${depth}; speed: ${speed}`"
            :material="`color: ${color}; opacity: ${opacity}; metalness: ${metalness}; roughness: ${roughness}`"
            rotation="-90 0 0"
            shadow="cast: true; receive: true"></a-entity>

  <!-- Océan natif A-Frame - Couche 2 -->
  <a-entity :ocean="`density: ${density * 2}; width: ${width}; depth: ${depth}; speed: ${speed * 0.67}`"
            :material="`color: ${color}; opacity: ${opacity}; metalness: ${metalness}; roughness: ${roughness}`"
            rotation="-90 0 0"
            shadow="cast: true; receive: true"></a-entity>
</template>
