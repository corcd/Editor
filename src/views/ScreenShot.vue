<template>
  <div class="screenshot">
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
        v-show="element.visible"
        :key="element.id"
        :src="element.imgSrc"
        :style="{'top':element.top+'px','left':element.left+'px','width':element.width+'px','height':element.height+'px','opacity':(element.alpha/100.0),'z-index':element.index}"
      >
      <section
        class="showWord"
        draggable="false"
        v-for="element in filterOfWord"
        v-show="element.visible"
        :key="element.id"
        :style="{'top':element.top+'px','left':element.left+'px','z-index':element.index}"
      >
        <div :class="'animated'+ ' ' + element['animation']" :style="styleAnime(element)">
          <div id="ele_word_stage" :style="styleBasic(element)">{{ element.text }}</div>
        </div>
      </section>

      <aside
        v-for="element in filterOfLayout"
        v-show="element.visible"
        :key="element.id"
        :style="{'top':element.top+'px','left':element.left+'px','z-index':element.index}"
      >
        <img
          class="showImg"
          alt="img"
          draggable="false"
          v-for="item in filterOfChildrenImg(element)"
          v-show="item.visible"
          :key="item.id"
          :src="item.imgSrc"
          :style="{'top':item.top+'px','left':item.left+'px','width':item.width+'px','height':item.height+'px','opacity':(item.alpha/100.0),'z-index':item.index}"
        >
        <section
          class="showWord"
          draggable="false"
          v-for="item in filterOfChildrenWord(element)"
          v-show="item.visible"
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
import "animate.css";
import "../assets/css/custom.css";
export default {
  name: "screenshot",
  components: {},
  data() {
    return {
      appid: "",
      stageResolution: "720P",
      coefficient: 1,
      layout: [],
      layout_id: 0,
      title: "",
      poster: "",
      elements: []
    };
  },
  created() {
    this.appid = this.$utils.parseUrl("appid");
    this.layout_id = this.$utils.parseUrl("id");
    if (this.appid == null) {
      this.$Message.error("No user");
      console.log("No user:");
      this.$router.push({
        path: "/error",
        query: { msg: "No user" }
      });
    }
    if (this.layout_id == null) {
      console.log("No layout id");
      this.$router.push({
        path: "/error",
        query: { msg: "No Layout" }
      });
    }
    console.log("layout_id:", this.layout_id);

    // 获取工作区数据
    let self = this;
    this.$axios
      .post("https://editor.guangdianyun.tv:3006/getData", {
        appid: self.appid,
        type: "editor"
      })
      .then(response => {
        if (response.data.code == 1) {
          console.log(response.data.msg);
          self.layout = response.data.data.layout;
          console.log("layout data length:", self.layout.length);
          if (self.layout.length == 0) {
            //console.log("New User")
            self.elements = [];
          } else {
            self.elements =
              self.layout[
                self.layout.findIndex(item => item.id == self.layout_id)
              ].elements;
            console.log(self.elements);
          }
        } else if (response.data.code == 0) {
        } else {
        }
      })
      .catch(function(error) {});
  },
  mounted() {},
  beforeDestroy() {
    //this.$socket.close();
  },
  computed: {
    filterOfImg() {
      if (this.elements)
        return this.elements.filter(item => item.type == "img");
    },
    filterOfWord() {
      if (this.elements)
        return this.elements.filter(item => item.type == "word");
    },
    filterOfLayout() {
      if (this.elements)
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

.screenshot {
  background-color: #2f353b !important;

  .showCanvas {
    margin: 0;
    padding: 0;
    background-color: #2f353b;
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
