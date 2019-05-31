<template>
  <div
    class="layoutitem"
    v-show="element.visible"
    :style="{'top':element.top+'px','left':element.left+'px','width':element.width+'px','height':element.height+'px','z-index':element.index}"
    :tabindex="element.index"
    @click.stop="showEditor"
    @mousedown.stop="mousedown"
    @mouseup="mouseup"
    @keydown="keyboard($event)"
  >
    <ImgElement
      v-for="item in filterOfImg"
      :key="item.id"
      :resolution="resolution"
      :zoom="zoom"
      :locked="locked"
      :element="item"
      :elementSelected="elementSelected"
      @getElementSelected="getElementSelected"
      @clearElementSelected="clearElementSelected"
      @delElementSelected="delElementSelected"
    ></ImgElement>
    <WordElement
      v-for="item in filterOfWord"
      :key="item.id"
      :resolution="resolution"
      :zoom="zoom"
      :locked="locked"
      :element="item"
      :elementSelected="elementSelected"
      :marqueeStatus="item.marquee_pattern"
      :marqueeDuration="item.marquee_duration"
      @getElementSelected="getElementSelected"
      @clearElementSelected="clearElementSelected"
      @delElementSelected="delElementSelected"
    ></WordElement>
    <Operate
      v-show="(element.id == elementSelected.id)"
      :element="element"
      :zoom="zoom"
      :objtype="'layout'"
    />
  </div>
</template>

<script>
export default {
  name: "LayoutItem",
  props: {
    resolution: String,
    zoom: Number,
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
      locked: false,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      currentX: 0,
      currentY: 0,
      flag: false,
      scaleFlag: false
    };
  },
  computed: {
    filterOfImg() {
      return this.element["children"].filter(item => item.type == "img");
    },
    filterOfWord() {
      return this.element["children"].filter(item => item.type == "word");
    }
  },
  methods: {
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
      //this.$Message.error("Click Layout");
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
      let ele = this.element;
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
      event.preventDefault();
    },
    delElementSelected(ele) {
      this.element.children.splice(
        this.element.children.findIndex(item => item.id === ele.id),
        1
      );
    },
    getElementSelected(ele) {
      // 跟随变化
      this.$emit("getElementSelected", ele);
    },
    clearElementSelected() {
      this.$emit("clearElementSelected");
    }
  },
  watch: {
    // elementSelected: {
    //   handler(newValue, oldValue) {
    //     if (this.element.locked) {
    //       this.elementSelected = {};
    //     }
    //   }
    // },
    "element.locked": {
      handler(newValue, oldValue) {
        if (newValue != oldValue) {
          this.locked = newValue;
          console.log(this.locked);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.layoutitem {
  position: absolute;
  cursor: move;

  &:focus {
    outline: none;
  }
}
</style>
