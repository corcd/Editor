<template>
  <div class="home">
    <div id="canvas" class="dragCanvas">
      <img
        id="ele"
        class="dragImg"
        ref="dragEle"
        alt="Vue logo"
        src="../assets/logo.png"
        @dragstart="eleDragStart($event)"
        @mouseup="eleMoveUp($event)"
        @mousedown="eleMoveDown($event)"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      isDraggable: true,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      currentX: 0,
      currentY: 0
    };
  },
  beforeDestroy() {},
  methods: {
    eleMove(cWidth, cHeight) {
      //console.log(cWidth, cHeight);
      let ele = document.getElementById("ele");
      let canvas = document.getElementById("canvas");
      //console.log(canvas.offsetTop,canvas.offsetLeft);
      this.width = ele.offsetWidth;
      this.height = ele.offsetHeight;
      this.top = this.currentY - canvas.offsetTop - this.height / 2;
      this.left = this.currentX - canvas.offsetLeft - this.width / 2;

      // 在容器中
      if (this.top >= 0 && this.left >= 0) {
        if (this.top >= cHeight - this.height) {
          ele.style.top = cHeight - this.height + "px";
        } else {
          ele.style.top = this.top + "px";
        }

        if (this.left >= cWidth - this.width) {
          ele.style.left = cWidth - this.width + "px";
        } else {
          ele.style.left = this.left + "px";
        }
      }
      // 触及容器顶部 & 左边框
      else if (this.top < 0 && this.left >= 0) {
        ele.style.top = 0 + "px";
        if (this.left >= cWidth - this.width) {
          ele.style.left = cWidth - this.width + "px";
        } else {
          ele.style.left = this.left + "px";
        }
      }
      // 触及容器右边框 & 底部
      else if (this.top >= 0 && this.left < 0) {
        ele.style.left = 0 + "px";
        if (this.top >= cHeight - this.height) {
          ele.style.top = cHeight - this.height + "px";
        } else {
          ele.style.top = this.top + "px";
        }
      }
      // 容器原点
      else {
        ele.style.top = 0 + "px";
        ele.style.left = 0 + "px";
      }
      //console.log(ele.style.top, ele.style.left);
    },
    eleMoveDown(event) {
      let canvas = document.getElementById("canvas");
      canvas.addEventListener("mousemove", this.eleDrag);
    },
    eleMoveUp(event) {
      let canvas = document.getElementById("canvas");
      canvas.removeEventListener("mousemove", this.eleDrag);
    },
    eleDrag(event) {
      let e = event || window.event;
      // 锁判断，当释放鼠标的时候，鼠标移动不执行操作
      if (this.isDraggable) {
        this.currentX = event.clientX;
        this.currentY = event.clientY;
        this.eleMove(800, 600);
      }
    },
    eleDragStart(event) {
      console.log("dragstart");
      event.preventDefault();
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;

  .dragCanvas {
    width: 800px;
    height: 600px;
    margin: auto;
    padding: 0;
    border: 2px black solid;
    position: relative;

    img {
      margin: 0;
      padding: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
