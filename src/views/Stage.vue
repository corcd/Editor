<template>
  <div class="stage">
    <div
      id="canvas"
      class="showCanvas"
      v-bind:class="[stageResolution == '480P' ? 'simpleCanvas':'',stageResolution == '720P' ? 'normalCanvas':'',stageResolution == '1080P' ? 'extendCanvas':'']"
    >
      <img
        id="ele_stage"
        class="showImg"
        alt="img"
        draggable="false"
        v-for="element in elements"
        :key="element.id"
        :src="element.imgSrc"
        :style="{'top':element.top*coefficient+'px','left':element.left*coefficient+'px','width':element.width+'px','height':element.height+'px','opacity':(element.alpha/100.0),'z-index':element.index}"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "stage",
  components: {},
  data() {
    return {
      stageResolution: "480P",
      coefficient: 1,
      elements: []
    };
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    customEmit(val) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
    }
  },
  mounted() {
    this.$socket.emit("online", "demo-stage");

    this.$socket.on("receiveMsg", data => {
      console.log(data);
      this.coefficient = data.Mag;
      this.stageResolution = data.Resolution;
      // if (data.Resolution == "480P") coefficient = 1;
      // else if (data.Resolution == "720P") coefficient = 1.5;
      // else if (data.Resolution == "1080P") coefficient = 1.5 * 1.5;
      // else coefficient = 1;

      this.elements = data.Objs;
      // this.$nextTick(() => {
      //   this.elements = data.Objs;
      // });
    });
  },
  beforeDestroy() {},
  methods: {
    // setPosition() {
    //   let ele = document.getElementById("ele_stage");

    //   ele.style.top = this.currentTop + "px";
    //   ele.style.left = this.currentLeft + "px";

    //   console.log(ele.style.top, ele.style.left);
    // }
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

.stage {
  .showCanvas {
    margin: 0;
    padding: 0;
    border: 1px grey solid;
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
</style>
