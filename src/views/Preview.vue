<template>
  <div class="preview">
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
        :style="{'top':element.top+'px','left':element.left+'px','width':element.width+'px','height':element.height+'px','opacity':(element.alpha/100.0),'z-index':element.index}"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "preview",
  components: {},
  data() {
    return {
      appid: "",
      stageResolution: "720P",
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
  created() {
    this.appid = this.$utils.parseUrl("appid");
    if (this.appid == null) {
      this.$Message.error("No user");
      console.log("No user:");
      this.$router.push({
        path: "/error",
        query: { msg: "No user" }
      });
    }
    console.log("current user:", this.appid);
  },
  mounted() {
    let socketObj = { appid: this.appid, type: "preview" };
    this.$socket.emit("online", socketObj);

    this.$socket.on("clearStage", () => {
      this.$nextTick(() => {
        this.elements = [];
        console.log(this.elements);
      });
    });

    this.$socket.on("receiveMsgPre", data => {
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
  beforeDestroy() {
    //this.$socket.close();
  },
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
  // width: 853px;
  // height: 480px;
}

.normalCanvas {
  // width: 1280px;
  // height: 720px;
}

.extendCanvas {
  // width: 1920px;
  // height: 1080px;
}

.preview {
  width: 100vw;
  height: 100vh;
  background-color: transparent !important;

  .showCanvas {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: transparent;
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
