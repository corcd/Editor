<template>
  <div class="stage">
    <div
      id="canvas"
      class="showCanvas"
      v-bind:class="[stageResolution == '480P' ? 'simpleCanvas':'',stageResolution == '720P' ? 'normalCanvas':'',stageResolution == '1080P' ? 'extendCanvas':'']"
    >
      <img
        id="ele_img_stage"
        class="showImg"
        alt="img"
        draggable="false"
        v-for="element in filterOfImg"
        :key="element.id"
        :src="element.imgSrc"
        :style="{'top':element.top+'px','left':element.left+'px','width':element.width+'px','height':element.height+'px','opacity':(element.alpha/100.0),'z-index':element.index}"
      >
      <section
        class="showWord"
        v-for="element in filterOfWord"
        :key="element.id"
        :style="{'top':element.top+'px','left':element.left+'px','z-index':element.index}"
      >
        <div :class="'animated'+ ' ' + element['animation']" :style="styleAnime(element)">
          <div id="ele_word_stage" draggable="false" :style="styleBasic(element)">{{ element.text }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "stage",
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
    let socketObj = { appid: this.appid, type: "stage" };
    this.$socket.emit("online", socketObj);

    this.$socket.on("clearStage", () => {
      this.$nextTick(() => {
        this.elements = [];
        console.log(this.elements);
      });
    });

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
  beforeDestroy() {
    //this.$socket.close();
  },
  computed: {
    filterOfImg() {
      return this.elements.filter(item => item.type == "img");
    },
    filterOfWord() {
      return this.elements.filter(item => item.type == "word");
    }
  },
  methods: {
    styleAnime(ele) {
      return {
        animationIterationCount: ele["loop"] ? "infinite" : "initial",
        animationDuration: ele["duration"] + "s",
        animationDelay: ele["delay"] + "s"
      };
    },
    styleBasic(ele) {
      return {
        width: ele["width"] + "px",
        lineHeight: ele["lineHeight"],
        color: ele["color"],
        textAlign: ele["textAlign"],
        fontSize: ele["fontSize"] + "px",
        fontWeight: ele["fontWeight"],
        "font-family": ele["fontFamily"],
        opacity: ele["alpha"] / 100,
        transform: "rotate(" + ele["transform"] + "deg" + ")"
      };
    }
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
  background-color: transparent !important;

  .showCanvas {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: 1px grey solid;
    position: relative;
    //overflow: hidden;
    //z-index: 0;

    .showImg {
      margin: 0;
      padding: 0;
      position: absolute;
    }

    .showWord {
      margin: 0;
      padding: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      position: relative;
      user-select: none;
    }
  }
}
</style>
