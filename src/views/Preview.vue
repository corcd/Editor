<template>
  <div class="preview">
    <div class="header">
      <div class="statusbar">
        <Button class="btn-backward" @click="backward" type="primary">Back</Button>
      </div>
    </div>
    <div class="container">
      <div
        id="canvas"
        class="showCanvas"
        v-bind:class="[previewResolution == '480P' ? 'simpleCanvas':'',previewResolution == '720P' ? 'normalCanvas':'',previewResolution == '1080P' ? 'extendCanvas':'']"
      >
        <img
          id="ele_stage"
          class="showImg"
          alt="Vue logo"
          v-for="element in elements"
          :key="element.id"
          :src="element.imgSrc"
          :style="{'top':element.top+'px','left':element.left+'px','width':element.width+'px','height':element.height+'px','opacity':(element.alpha/100.0),'z-index':element.index}"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "preview",
  components: {},
  data() {
    return {
      elements: {},
      previewResolution: { type: String, default: "480P" },
      mag: 1
    };
  },
  mounted() {
    this.elements = this.$route.query.data;
    this.previewResolution = this.$route.query.Resolution;
    this.mag = this.$route.query.Mag;
  },
  beforeDestroy() {},
  methods: {
    backward() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.simpleCanvas {
  width: 853px;
  height: 480px;
}

.normalCanvas {
  width: 1280px;
  height: 720px;
}

.extendCanvas {
  width: 1920px;
  height: 1080px;
}

.preview {
  width: 100%;
  height: 100%;
  -webkit-animation-fill-mode: none;

  .header {
    width: 100%;
    display: fixed;
    top: 0;

    .statusbar {
      width: 100%;
      height: 60px;
      background: #515a6e;
      display: flex;
      align-items: center;

      .btn-backward {
        position: absolute;
        left: 20px;
      }
    }
  }

  .container {
    width: 100%;
    height: 100%;
    min-height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7f9;

    .showCanvas {
      margin: 0;
      padding: 0;
      border: 1px grey solid;
      box-shadow: 0px 0px 15px #7d828f;
      position: relative;
      overflow: hidden;
      z-index: 0;

      img {
        margin: 0;
        padding: 0;
        position: absolute;
      }
    }
  }
}
</style>
