<script setup>
import '../aframe/disable-in-vr.js'
import '../aframe/hide-in-vr.js'
import '../aframe/simple-navmesh-constraint.js'
import '../aframe/blink-controls.js'
import '../aframe/ray-follow-grab.js'
import '../aframe/physx-grabbable.js'
</script>

<template>
  <a-entity
    id="camera-rig"
    movement-controls="camera: #head;"
    disable-in-vr="component: movement-controls;"
  >
    <a-entity
      id="head"
      look-controls="pointerLockEnabled: true"
      simple-navmesh-constraint="navmesh: [data-role='nav-mesh']; height: 1.65;"
      disable-in-vr="component: simple-navmesh-constraint;"
      camera
      position="0 1.70 0"
    >
      <a-entity
        geometry="primitive: circle; radius: 0.0003;"
        material="shader: flat; color: white;"
        cursor
        raycaster="far: 4; objects: .clickable; showLine: true;"
        position="0 0 -0.1"
        disable-in-vr="component: raycaster; disableInAR: false;"
        hide-in-vr="hideInAR: false"
      ></a-entity>
    </a-entity>

    <!-- MAIN GAUCHE -->
    <a-entity
      id="hand-left"
      hand-controls="hand: left"
      laser-controls="hand: left"
      raycaster="far: 4; objects: .clickable; showLine: true;"
      ray-follow-grab="useHitDistance: false; holdDistance: 0.7; maxDistance: 4; followRotation: false;"
      blink-controls="
        cameraRig: #camera-rig;
        teleportOrigin: #head;
        collisionEntities: [data-role='nav-mesh'];
        snapTurn: false;
      "
      position="0 1.5 0"
    ></a-entity>

    <!-- MAIN DROITE -->
    <a-entity
      id="hand-right"
      hand-controls="hand: right"
      laser-controls="hand: right"
      raycaster="far: 4; objects: .clickable; showLine: true;"
      ray-follow-grab="useHitDistance: true; maxDistance: 4; followRotation: false;"
      position="0 1.5 0"
    ></a-entity>
  </a-entity>
</template>