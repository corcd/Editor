<template>
  <div
    class="wrap"
    :style="{top:element.top+'px',left:element.left+'px'}"
    @click.stop="showEditor"
    @mousedown="mousedown"
    @mouseup="mouseup"
  >
    <img
      v-if="fileType==='pic'"
      @dragstart="dragstart"
      :src="element.imgSrc"
      :style="{width:element.width+'px',height:element.height+'px'}"
    >
    <video v-if="fileType==='video'" @dragstart="dragstart" :src="imgSrc"/>
    <Operate v-show="showOperate" :element="element"/>
  </div>
</template>

<script>
import appConst from "../../util/appConst";
export default {
  name: "ImgElement",
  props: {
    element: {
      type: Object,
      require: true
    },
    showOperate: {
      type: Boolean,
      default: false
    },
    fileType: {
      type: String,
      default: "pic"
    },
    imgSrc: {
      type: String,
      default: "../assets/logo.png"
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      currentX: 0,
      currentY: 0,
      flag: false,
      scaleFlag: false,
      direction: "",
      http: appConst.BACKEND_DOMAIN
    };
  },
  methods: {
    showEditor() {
      let ele = this.element;
      ele.edit = true;
      this.$emit("getElementSelected", ele);
      let click = () => {
        ele.edit = false;
        this.$emit("clearElementSelected");
        document.removeEventListener("click", click);
      };
      document.addEventListener("click", click);
    },
    // 处理元素拖动
    move() {
      document.querySelector(".home").onmousemove = event => {
        var e = event || window.event;
        if (this.flag) {
          let nowX = e.clientX;
          let nowY = e.clientY;
          let disX = nowX - this.currentX;
          let disY = nowY - this.currentY;
          this.element.top = parseInt(this.top) + disY;
          this.element.left = parseInt(this.left) + disX;
        }
      };
    },
    mousedown(e) {
      this.flag = true;
      this.currentX = e.clientX;
      this.currentY = e.clientY;
      this.top = this.element.top;
      this.left = this.element.left;
      this.move();
    },
    mouseup(e) {
      this.flag = false;
      this.scaleFlag = false;
    },
    dragstart(event) {
      //console.log("dragstart");
      event.preventDefault();
    }
  }
};
</script>

<style lang='scss' scoped>
.wrap {
  position: absolute;
  cursor: move;

  img {
    position: absolute;
    user-select: none;
    /*-webkit-user-drag: none;*/
  }

  video {
    position: absolute;
    user-select: none;
  }
}
</style>
