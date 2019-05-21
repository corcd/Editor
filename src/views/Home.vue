<template>
  <div class="home">
    <div class="header">
      <StatusBar></StatusBar>
    </div>
    <div class="container">
      <SideBar :element="eleSelected" @changeResolution="changeResolution"></SideBar>
      <div class="inside-container">
        <div id="canvas" class="dragCanvas">
          <ImgElement
            v-for="element in elements"
            :key="element.id"
            :fileType="element.type"
            :element="element"
            :imgSrc="element.imgSrc"
            :showOperate="element.edit"
            @getElementSelected="getElementSelected"
            @clearElementSelected="clearElementSelected"
          ></ImgElement>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
import appConst from "../util/appConst";
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
      currentY: 0,
      lastTop: 0,
      lastLeft: 0,
      resolution: "480P",
      mag: 1,
      data: {},
      elements: [
        {
          id: 1,
          width: 200,
          height: 200,
          top: 0,
          left: 0,
          type: "pic",
          imgSrc:
            "http://dingyue.nosdn.127.net/rdVGgleN1ShQeYpNeWL7HkScsZZhbwdaPzoWUaGzD0=PM1529677325458.jpg",
          alpha: 0,
          index: 1,
          edit: false
        }
      ],
      eleSelected: {},
      http: appConst.BACKEND_DOMAIN
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
  mounted() {
    this.$socket.emit("online", "demo-1");

    this.$watch("elements", this.sendPosition, { deep: true });
  },
  beforeDestroy() {},
  computed: {
    elementPosition() {
      return ele => {
        return {
          zIndex: ele["zindex"],
          top: ele["top"] + "px",
          left: ele["left"] + "px"
        };
      };
    }
  },
  methods: {
    getElementSelected(ele) {
      // 跟随变化
      this.eleSelected = ele;
    },
    clearElementSelected() {
      this.eleSelected = null;
    },
    changeResolution(reso, mag) {
      this.resolution = reso;
      this.mag = mag;
      this.sendPosition();
    },
    // eleMove(cWidth, cHeight) {
    //   //console.log(cWidth, cHeight);
    //   let ele = document.getElementById("ele");
    //   //console.log(canvas.offsetTop,canvas.offsetLeft);
    //   this.width = ele.offsetWidth;
    //   this.height = ele.offsetHeight;
    //   this.top = this.currentY - canvas.offsetTop - this.height / 2;
    //   this.left = this.currentX - canvas.offsetLeft - this.width / 2;

    //   this.lastTop = this.top;
    //   this.lastLeft = this.left;

    //   // // 在容器中
    //   // if (this.top >= 0 && this.left >= 0) {
    //   //   if (this.top >= cHeight - this.height) {
    //   //     this.lastTop = cHeight - this.height;
    //   //   } else {
    //   //     this.lastTop = this.top;
    //   //   }

    //   //   if (this.left >= cWidth - this.width) {
    //   //     this.lastLeft = cWidth - this.width;
    //   //   } else {
    //   //     this.lastLeft = this.left;
    //   //   }
    //   // }
    //   // // 触及容器顶部 & 左边框
    //   // else if (this.top < 0 && this.left >= 0) {
    //   //   this.lastTop = 0;
    //   //   if (this.left >= cWidth - this.width) {
    //   //     this.lastLeft = cWidth - this.width;
    //   //   } else {
    //   //     this.lastLeft = this.left;
    //   //   }
    //   // }
    //   // // 触及容器右边框 & 底部
    //   // else if (this.top >= 0 && this.left < 0) {
    //   //   this.lastLeft = 0;
    //   //   if (this.top >= cHeight - this.height) {
    //   //     this.lastTop = cHeight - this.height;
    //   //   } else {
    //   //     this.lastTop = this.top;
    //   //   }
    //   // }
    //   // // 容器原点
    //   // else {
    //   //   this.lastTop = 0;
    //   //   this.lastLeft = 0;
    //   // }

    //   ele.style.top = this.lastTop + "px";
    //   ele.style.left = this.lastLeft + "px";

    //   this.sendPosition(this.lastTop, this.lastLeft, this.resolution, this.mag);
    // },
    // eleMoveDown() {
    //   let canvas = document.getElementById("canvas");
    //   canvas.addEventListener("mousemove", this.eleDrag);
    // },
    // eleMoveUp() {
    //   let canvas = document.getElementById("canvas");
    //   canvas.removeEventListener("mousemove", this.eleDrag);
    // },
    // eleDrag(event) {
    //   let e = event || window.event;
    //   // 锁判断，当释放鼠标的时候，鼠标移动不执行操作
    //   if (this.isDraggable) {
    //     this.currentX = e.clientX;
    //     this.currentY = e.clientY;
    //     this.eleMove(853, 480);
    //   }
    // },
    // eleDragStart(event) {
    //   console.log("dragstart");
    //   event.preventDefault();
    // },
    sendPosition() {
      this.$socket.emit("sendMsg", {
        Resolution: this.resolution,
        Mag: this.mag,
        Objs: this.elements
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  -webkit-animation-fill-mode: none;

  .header {
    width: 100%;
    display: fixed;
    top: 0;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #f5f7f9;

    .inside-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .dragCanvas {
        width: 853px;
        height: 480px;
        margin: 0;
        padding: 0;
        border: 0;
        background: #fff;
        box-shadow: 0px 0px 15px #7d828f;
        position: relative;
        overflow: hidden;
        z-index: 0;

        .element {
          position: absolute;
        }
      }
    }
  }
}
</style>
