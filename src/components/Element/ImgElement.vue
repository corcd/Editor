<template>
  <div
    class="wrap"
    :style="{'top':element.top+'px','left':element.left+'px','z-index':element.index}"
    @click.stop="showEditor"
    @mousedown="mousedown"
    @mouseup="mouseup"
  >
    <img
      v-if="element.type==='img'"
      @dragstart="dragstart"
      :src="element.imgSrc"
      :style="{'width':element.width+'px','height':element.height+'px','opacity':(element.alpha/100.0)}"
    >
    <!-- <video v-if="fileType==='video'" @dragstart="dragstart" :src="imgSrc"/> -->
    <Operate v-show="(element.id == elementSelected.id)" :element="element"/>
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
    elementSelected: {
      type: Object,
      default: null
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
      //ele.edit = true;
      this.$emit("getElementSelected", ele);
      let click = () => {
        //ele.edit = false;
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
      document
        .querySelector(".dragCanvas")
        .addEventListener("click", click);
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
      let ele = this.element;
      //ele.edit = true;
      this.$emit("getElementSelected", ele);

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
