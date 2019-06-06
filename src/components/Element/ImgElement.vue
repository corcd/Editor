<template>
  <div
    class="wrap"
    v-show="element.visible"
    :style="{'top':element.top+'px','left':element.left+'px','z-index':element.index}"
    :tabindex="element.index"
    @click="showEditor"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @keydown="keyboard($event)"
  >
    <img
      v-if="element.type==='img'"
      @dragstart="dragstart"
      :src="element.imgSrc"
      :style="{'width':element.width+'px','height':element.height+'px','opacity':(element.alpha/100.0)}"
    >
    <!-- <video v-if="fileType==='video'" @dragstart="dragstart" :src="imgSrc"/> -->
    <Operate
      v-show="(element.id == elementSelected.id)"
      :element="element"
      :zoom="zoom"
      :objtype="'img'"
    />
  </div>
</template>

<script>
export default {
  name: "ImgElement",
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
      direction: ""
    };
  },
  methods: {
    keyboard(event) {
      event.preventDefault();
      if (this.locked == false) {
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
      }
    },
    delElementSelected(ele) {
      if (this.locked == false) {
        this.$emit("delElementSelected", ele);
      }
    },
    showEditor() {
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
    // 处理元素拖动
    move() {
      document.querySelector(".home").onmousemove = event => {
        let e = event || window.event;
        if (this.flag) {
          let nowX = e.clientX;
          let nowY = e.clientY;
          let disX = nowX - this.currentX;
          let disY = nowY - this.currentY;
          this.element.top = parseInt(this.top + disY / this.zoom);
          this.element.left = parseInt(this.left + disX / this.zoom);
        }
      };
    },
    mousedown(e) {
      if (this.locked == false) {
        event.stopPropagation();
        let ele = this.element;
        //ele.edit = true;
        this.$emit("getElementSelected", ele);

        this.flag = true;
        this.currentX = e.clientX;
        this.currentY = e.clientY;
        this.top = this.element.top;
        this.left = this.element.left;
        this.move();
      }
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

  &:focus {
    outline: none;
  }

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
