<template>
  <div :class="[type!=='see'?'canvas':'']" @click="cleanSelected">
    
  </div>
</template>

<script>
import "animate.css";
export default {
  name: "Editor"
};
</script>

<style lang="scss" scoped>
div {
  -webkit-animation-fill-mode: none;

  .canvas {
    background-color: #fff;
    margin: 0 auto;
    position: relative;

    .bg-layer {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;

      .element {
        position: absolute;
      }
    }
  }
}
</style>
