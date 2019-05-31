<template>
  <aside
    class="wrap"
    v-show="element.visible"
    :style="{'top':element.top+'px','left':element.left+'px','z-index':element.index}"
    :tabindex="element.index"
    @click="showEditor"
    @mousedown="mousedown"
    @keydown="keyboard($event)"
  >
    <Operate
      class="operate"
      v-show="(element.id == elementSelected.id)"
      :element="element"
      :zoom="zoom"
      :objtype="'word'"
    />
    <section class="content" @dragstart="dragstart">
      <div :class="'animated'+ ' ' + this.element['animation']" :style="styleAnime">
        <div v-show="element.type=='word'" :style="styleBasic(element)">{{ element.text }}</div>
      </div>
    </section>
  </aside>
</template>

<script>
import { setInterval, clearInterval } from "timers";
export default {
  name: "WordElement",
  props: {
    resolution: String,
    zoom: Number,
    locked: {
      type: Boolean,
      default: false
    },
    element: {
      type: Object,
      require: true
    },
    elementSelected: {
      type: Object
    },
    marqueeStatus: { type: String, default: "normal" },
    marqueeDuration: Number
  },
  data() {
    return {
      marquee_timer: null,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      currentX: 0,
      currentY: 0
    };
  },
  created() {
    //this.marquee(10, true);
    if (this.marqueeStatus == "normal") {
      clearInterval(this.marquee_timer);
      this.marquee_timer = null;
      //this.$Message.warning("Marquee Cancel");
    } else if (this.marqueeStatus == "once") {
      this.marquee(this.element, this.marqueeDuration, false);
      //this.$Message.success("Marquee Applied Once");
    } else if (this.marqueeStatus == "loop") {
      this.marquee(this.element, this.marqueeDuration, true);
      //this.$Message.success("Marquee Applied Loop");
    } else {
      this.$Message.error("Marquee Error");
    }
  },
  beforeDestroy() {
    clearInterval(this.marquee_timer);
    this.marquee_timer = null;
  },
  computed: {
    styleAnime() {
      return {
        animationIterationCount: this.element["loop"] ? "infinite" : "initial",
        animationDuration: this.element["duration"] + "s",
        animationDelay: this.element["delay"] + "s"
      };
    }
  },
  methods: {
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
    },
    keyboard(event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.keyCode == 13) {
        this.$Message.info("Enter");
      } else if (event.keyCode == 8) {
        //this.$Message.info("BackSpace");
        this.delElementSelected(this.element);
      } else if (event.keyCode == 46) {
        //this.$Message.info("Delete");
        this.delElementSelected(this.element);
      } else if (event.keyCode == 37) {
        // 左
        this.element.left--;
      } else if (event.keyCode == 38) {
        // 上
        this.element.top--;
      } else if (event.keyCode == 39) {
        // 右
        this.element.left++;
      } else if (event.keyCode == 40) {
        // 下
        this.element.top++;
      }
    },
    delElementSelected(ele) {
      this.$emit("delElementSelected", ele);
    },
    showEditor() {
      //console.log(this.element);
      if (this.locked == false) {
        event.stopPropagation();
        let ele = this.element;
        this.$emit("getElementSelected", ele);
      }

      let click = () => {
        this.$emit("clearElementSelected");
        document
          .querySelector(".inside-container")
          .removeEventListener("click", click);
        document
          .querySelector(".dragCanvas")
          .removeEventListener("click", click);
      };
      document
        .querySelector(".inside-container")
        .addEventListener("click", click);
      document.querySelector(".dragCanvas").addEventListener("click", click);
    },
    mousedown(downEvent) {
      if (this.locked == false) {
        event.stopPropagation();
        let ele = this.element;
        this.$emit("getElementSelected", ele);
      }

      let startY = downEvent.clientY;
      let startX = downEvent.clientX;
      let startTop = this.element.top;
      let startLeft = this.element.left;

      let move = moveEvent => {
        let currX = moveEvent.clientX;
        let currY = moveEvent.clientY;
        this.element.top = parseInt((currY - startY) / this.zoom + startTop);
        this.element.left = parseInt((currX - startX) / this.zoom + startLeft);
      };
      let up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      if (this.locked == false) {
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      }
    },
    dragstart(event) {
      //console.log("dragstart");
      event.preventDefault();
    },
    marquee(ele, delay, loop) {
      clearInterval(this.marquee_timer);
      this.marquee_timer = null;

      ele.left = 1280;
      this.marquee_timer = setInterval(() => {
        this.$nextTick(() => {
          if (ele.left <= -ele.width) {
            if (!loop) {
              clearInterval(this.marquee_timer);
              this.marquee_timer = null;
            } else {
              ele.left = 1280;
            }
          }
          ele.left--;
          this.animate = !this.animate;
        });
      }, delay);
    }
  },
  watch: {
    marqueeStatus: {
      handler(newValue, oldValue) {
        if (newValue != oldValue) {
          if (newValue == "normal") {
            clearInterval(this.marquee_timer);
            this.marquee_timer = null;
            //this.$Message.warning("Marquee Cancel");
          } else if (newValue == "once") {
            this.marquee(this.element, this.marqueeDuration, false);
            //this.$Message.success("Marquee Applied Once");
          } else if (newValue == "loop") {
            this.marquee(this.element, this.marqueeDuration, true);
            //this.$Message.success("Marquee Applied Loop");
          } else {
            this.$Message.error("Marquee Error");
          }
        }
      }
    },
    marqueeDuration: {
      handler(newValue, oldValue) {
        if (newValue != oldValue && this.marqueeStatus == "loop") {
          this.marquee(this.element, newValue, true);
        } else if (newValue != oldValue && this.marqueeStatus == "once") {
          this.marquee(this.element, newValue, false);
        } else {
          clearInterval(this.marquee_timer);
          this.marquee_timer = null;
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.wrap {
  position: absolute;
  cursor: move;

  &:focus {
    outline: none;
  }

  .operate {
    z-index: 2;
  }

  section {
    white-space: pre-wrap;
    word-wrap: break-word;
    position: relative;
    user-select: none;
    z-index: 1;
  }
}
</style>
