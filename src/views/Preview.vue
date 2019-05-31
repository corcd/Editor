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
        v-for="element in filterOfImg"
        :key="element.id"
        :src="element.imgSrc"
        :style="{'top':element.top+'px','left':element.left+'px','width':element.width+'px','height':element.height+'px','opacity':(element.alpha/100.0),'z-index':element.index}"
      >
      <section
        class="showWord"
        v-for="element in filterOfWord"
        draggable="false"
        :key="element.id"
        :style="{'top':element.top+'px','left':element.left+'px','z-index':element.index}"
      >
        <div :class="'animated'+ ' ' + element['animation']" :style="styleAnime(element)">
          <div id="ele_word_stage" :style="styleBasic(element)">{{ element.text }}</div>
        </div>
      </section>

      <aside
        v-for="element in filterOfLayout"
        :key="element.id"
        :style="{'top':element.top+'px','left':element.left+'px','z-index':element.index}"
      >
        <img
          class="showImg"
          alt="img"
          draggable="false"
          v-for="item in filterOfChildrenImg(element)"
          :key="item.id"
          :src="item.imgSrc"
          :style="{'top':item.top+'px','left':item.left+'px','width':item.width+'px','height':item.height+'px','opacity':(item.alpha/100.0),'z-index':item.index}"
        >
        <section
          class="showWord"
          v-for="item in filterOfChildrenWord(element)"
          draggable="false"
          :key="item.id"
          :style="{'top':item.top+'px','left':item.left+'px','z-index':item.index}"
        >
          <div :class="'animated'+ ' ' + item['animation']" :style="styleAnime(item)">
            <div id="ele_word_stage" :style="styleBasic(item)">{{ item.text }}</div>
          </div>
        </section>
      </aside>
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
  computed: {
    filterOfImg() {
      return this.elements.filter(item => item.type == "img");
    },
    filterOfWord() {
      return this.elements.filter(item => item.type == "word");
    },
    filterOfLayout() {
      return this.elements.filter(item => item.type == "layout");
    }
  },
  methods: {
    filterOfChildrenImg(ele) {
      return ele.children.filter(item => item.type == "img");
    },
    filterOfChildrenWord(ele) {
      return ele.children.filter(item => item.type == "word");
    },
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
      position: absolute;
      user-select: none;
    }

    aside {
      margin: 0;
      padding: 0;
      position: absolute;
    }
  }
}
</style>
