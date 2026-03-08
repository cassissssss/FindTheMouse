<script setup>
  import { ref } from 'vue';

  defineProps({
    loaded: Boolean,
  });

  const showOnboarding = ref(true);

  function enterScene() {
    showOnboarding.value = false;
    if (AFRAME.utils.device.checkHeadsetConnected() && !AFRAME.utils.device.isMobile()) {
      document.querySelector('a-scene').enterVR();
    }
    document.querySelector('a-scene').emit('Play game');
  }
</script>

<template>
  <div id="onboarding" v-if="showOnboarding">
    <div>
      <h1>Furnitures Simulator</h1>
      <p v-if="!loaded">loading...</p>
      <button v-if="loaded" @click="enterScene()">Play Game</button>
      <p> Turn on sound for better experience !</p>
      <div class="licences">
        <section>
          <h4>Welcome to my little game Furnitures Simulator</h4>
          <p>Feel free to explore the virtual room and interact with the furniture.</p>
          <h4>Movement modes support</h4>
          <ul>
            <li>
              Desktop – Keyboard for move (WASD or Arrows keys) + Mouse for look
              control (Drag and drop)
            </li>
            <li>
              VR/AR – walk + Teleport (Grip for grab and laser for
              click) + Gaze cursor for click
              - grab with right controller and move objects with joystick or real movement, you can also rotate with joystick while grabbing
            </li>
          </ul>
        </section>
        <section>
          <h4>Source code</h4>
          <blockquote><a href="https://github.com/cassissssss/FurnituresSimulator">Github repo</a></blockquote>
        </section>
        <dl>
          <dt>
            <i>Included</i>
          </dt>
          <dt>
            <a href="https://github.com/c-frame/aframe-extras" target="_blank">aframe-extras</a>
          </dt><dd>
            <a href="https://github.com/c-frame/aframe-extras/blob/master/LICENSE" target="_blank">MIT License</a>
          </dd>

          <dt>
            <a href="https://github.com/c-frame/physx" target="_blank">aframe physx</a>
          </dt><dd>
            <a href="https://github.com/c-frame/aframe-extras/blob/master/LICENSE" target="_blank">MIT License</a>
          </dd>

          <dt>
            <a href="https://github.com/jure/aframe-blink-controls/" target="_blank">aframe-blink-controls</a>
          </dt><dd>
            <a href="https://github.com/jure/aframe-blink-controls/blob/main/LICENSE" target="_blank">MIT License</a>
          </dd>

          <dt>
            <a href="https://github.com/diarmidmackenzie/aframe-multi-camera/" target="_blank">aframe-multi-camera</a>
          </dt><dd>
            <a href="https://github.com/diarmidmackenzie/aframe-multi-camera/blob/main/LICENSE" target="_blank">MIT License</a>
          </dd>

          <dt>
            <a href=" https://github.com/AdaRoseCannon/aframe-xr-boilerplate" target="_blank">simple-navmesh-constraint</a>
          </dt><dd>
            By Ada Rose Cannon under MIT License
          </dd>

          <dt>
            <a href="https://sketchfab.com/3d-models/room-diorama-model-5b51ae0e29824c44be9af54f9e9c2b88" target="_blank">Room Diorama Model</a>
          </dt><dd>
            by <a href="https://sketchfab.com/mechamocha" target="_blank">mechamocha</a>
            under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC Attribution</a>
          </dd>

          <dt>
            <a href="https://sketchfab.com/3d-models/light-fixture-ceiling-recessed-269fd427629548a8a0949a6493c5b223" target="_blank">Light Fixture - Ceiling Recessed</a>
          </dt><dd>
            by <a href="https://sketchfab.com/mozillareality" target="_blank">MozillaHubs</a>
            under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC Attribution</a>
          </dd>

          <dt>
            <a href="https://sketchfab.com/3d-models/cardboard-box-set-low-poly-5d3d508061e544739e37c685af235684" target="_blank">Cardboard Box Set - Low Poly</a>
          </dt><dd>
            by <a href="https://sketchfab.com/ar.jethin" target="_blank">Nodeaxis Interactive</a>
            under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC Attribution</a>
          </dd>

        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
  h1 { font-size: 1.5rem }
  a {
    color: #333;
    text-decoration: none;
  }
  .licences {
    margin: 2rem 0;
    padding-bottom: 1rem;
    font-size: 1rem;
    text-align: left;
  }
  .licences dt {
    padding-top: 0.75rem;
    font-size: 0.9rem;
    font-weight: bold;
  }
  .licences dd {
    margin-left: 0;
    font-size: 0.8rem;
  }

  #onboarding {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #8ce8be;
    color: #333;
    width: 100vw;
    height: 100vh;
    padding: 1rem;
    font-family: monospace;
    z-index: 10000;
    overflow: auto;
  }
  #onboarding > * {
    margin: 0 auto;
    max-width: 50rem;
    width: calc(100vw - 10rem);
    text-align: center;
    border-radius: 0.3rem;
    padding: 1rem;
    font-size: 1.3rem;
  }
  #onboarding button {
    font-size: 1.3rem;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    background-color: #333;
    color: #8ce8be;
    border: none;
    cursor: pointer;
  }
</style>#onboarding li {
#onboarding li {
  font-size: 1rem;
  text-align: left;
}
