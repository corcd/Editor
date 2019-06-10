<template>
  <div
    class="operate"
    :style="{width:element.width+'px',height:element.height+'px'}"
    :class="[inside ? 'whiteBorder':'blackBorder']"
  >
    <div class="close" @click="delElementSelected">
      <Icon type="md-close-circle" color="white" size="35"/>
    </div>
    <div class="scale scale-nw" @mousedown.stop="mousedown($event, 'nw')"></div>
    <div class="scale scale-ne" @mousedown.stop="mousedown($event, 'ne')"></div>
    <div class="scale scale-sw" @mousedown.stop="mousedown($event, 'sw')"></div>
    <div class="scale scale-se" @mousedown.stop="mousedown($event, 'se')"></div>
    <div class="scale scale-n" @mousedown.stop="mousedown($event, 'n')"></div>
    <div class="scale scale-e" @mousedown.stop="mousedown($event, 'e')"></div>
    <div class="scale scale-s" @mousedown.stop="mousedown($event, 's')"></div>
    <div class="scale scale-w" @mousedown.stop="mousedown($event, 'w')"></div>
  </div>
</template>

<script>
export default {
  name: "Operate",
  props: {
    element: Object,
    zoom: Number,
    objtype: {
      type: String
    },
    inside: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    delElementSelected() {
      this.$emit("delElementSelected", this.element);
    },
    mousedown(downEvent, mark) {
      let startX = downEvent.clientX;
      let startY = downEvent.clientY;
      let ele = this.element;
      let height = ele.height;
      let width = ele.width;
      let top = ele.top;
      let left = ele.left;
      let move = null;
      if (this.objtype != "word") {
        move = moveEvent => {
          //console.log("editing");
          let currX = moveEvent.clientX;
          let currY = moveEvent.clientY;
          let disY = parseInt((currY - startY) / this.zoom);
          let disX = parseInt((currX - startX) / this.zoom);
          let hasN = /n/.test(mark);
          let hasS = /s/.test(mark);
          let hasW = /w/.test(mark);
          let hasE = /e/.test(mark);
          let newHeight = +height + (hasN ? -disY : hasS ? disY : 0);
          let newWidth = +width + (hasW ? -disX : hasE ? disX : 0);
          ele.height = newHeight > 0 ? newHeight : 0;
          ele.width = newWidth > 0 ? newWidth : 0;
          ele.left = +left + (hasW ? disX : 0);
          ele.top = +top + (hasN ? disY : 0);
        };
      } else {
        move = moveEvent => {
          //console.log("editing");
          let currX = moveEvent.clientX;
          let currY = moveEvent.clientY;
          let disY = parseInt((currY - startY) / this.zoom);
          let disX = parseInt((currX - startX) / this.zoom);
          let hasN = /n/.test(mark);
          let hasS = /s/.test(mark);
          let hasW = /w/.test(mark);
          let hasE = /e/.test(mark);
          //let newHeight = +height + (hasN ? -disY : hasS ? disY : 0);
          let newWidth = +width + (hasW ? -disX : hasE ? disX : 0);
          //ele.height = newHeight > 0 ? newHeight : 0;
          ele.width = newWidth > 0 ? newWidth : 0;
          ele.left = +left + (hasW ? disX : 0);
          ele.top = +top + (hasN ? disY : 0);
        };
      }
      let up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        document.querySelector(".operate").removeEventListener("mouseup", up);
        document
          .querySelector(".layoutitem")
          .removeEventListener("mouseup", up);

        //console.log("edit end");
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
      document.querySelector(".operate").addEventListener("mouseup", up);
      document.querySelector(".layoutitem").removeEventListener("mouseup", up);
    }
  },
  watch: {
    "element.height": {
      handler(newValue, oldValue) {},
      deep: true,
      immediate: true
    },
    "element.width": {
      handler(newValue, oldValue) {},
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.whiteBorder {
  border: 1px dashed #fff;
}

.blackBorder {
  border: 1px dashed #000;
}

.operate {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  //border: 1px dashed #000;

  .close {
    position: absolute;
    top: -40px;
    left: 50%;
    margin-left: -17.5px;
    cursor: pointer;
  }

  .scale {
    position: absolute;
    background: #fff;
    border: 1px solid #000;
    box-shadow: 0px 0px 10px #c2c2c2;
    width: 7px;
    height: 7px;
    z-index: 1;
  }

  .scale-nw {
    top: -3.5px;
    left: -3.5px;
    cursor: nw-resize;
    border-radius: 50%;
  }

  .scale-ne {
    top: -3.5px;
    right: -3.5px;
    cursor: ne-resize;
    border-radius: 50%;
  }

  .scale-sw {
    bottom: -3.5px;
    left: -3.5px;
    cursor: sw-resize;
    border-radius: 50%;
  }

  .scale-se {
    bottom: -3.5px;
    right: -3.5px;
    cursor: se-resize;
    border-radius: 50%;
  }

  .scale-n {
    top: -3.5px;
    left: 50%;
    margin-left: -3.5px;
    cursor: n-resize;
  }

  .scale-e {
    right: -3px;
    top: 50%;
    margin-top: -3.5px;
    cursor: e-resize;
  }

  .scale-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3.5px;
    cursor: s-resize;
  }

  .scale-w {
    left: -3.5px;
    top: 50%;
    margin-top: -3.5px;
    cursor: w-resize;
  }
}
</style>
