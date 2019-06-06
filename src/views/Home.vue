<template>
  <div class="home">
    <div class="header">
      <StatusBar
        :appid="appid"
        @toPreview="toPreview"
        @triggerSave="exportJSON('')"
        @elementAdd="elementAdd"
      ></StatusBar>
    </div>
    <div class="content">
      <SideBar
        :appid="appid"
        :elementSelected="eleSelected"
        :exportable="isExportable"
        @changeResolution="changeResolution"
        @changeSocketExport="changeSocketExport"
        @applyLayout="updateDataOnce"
      ></SideBar>
      <div class="inside-container">
        <Button
          type="primary"
          shape="circle"
          size="small"
          class="btn-trigger"
          @click="triggerBg"
        >White/Black</Button>
        <div
          id="canvas"
          class="dragCanvas"
          v-bind:class="[resolution == '480P' ? 'simpleCanvas':'',resolution == '720P' ? 'normalCanvas':'',resolution == '1080P' ? 'extendCanvas':'',isCanvasColorBlack ? 'blackCanvas':'']"
          v-bind:style="{'zoom': zoom}"
        >
          <ImgElement
            v-for="element in filterOfImg"
            :key="element.id"
            :resolution="resolution"
            :zoom="zoom"
            :element="element"
            :elementSelected="eleSelected"
            @getElementSelected="getElementSelected"
            @clearElementSelected="clearElementSelected"
            @delElementSelected="delElementSelected"
          ></ImgElement>
          <WordElement
            v-for="element in filterOfWord"
            :key="element.id"
            :resolution="resolution"
            :zoom="zoom"
            :element="element"
            :elementSelected="eleSelected"
            :marqueeStatus="element.marquee_pattern"
            :marqueeDuration="element.marquee_duration"
            @getElementSelected="getElementSelected"
            @clearElementSelected="clearElementSelected"
            @delElementSelected="delElementSelected"
          ></WordElement>
          <LayoutItem
            v-for="element in filterOfLayout"
            :key="element.id"
            :resolution="resolution"
            :zoom="zoom"
            :element="element"
            :elementSelected="eleSelected"
            @getElementSelected="getElementSelected"
            @clearElementSelected="clearElementSelected"
            @delElementSelected="delElementSelected"
          ></LayoutItem>
        </div>
      </div>
      <LayBar
        :elements="elements"
        :elementSelected="eleSelected"
        @elementAdd="elementAdd"
        @getElementSelected="getElementSelected"
        @clearElementSelected="clearElementSelected"
        @delElementSelected="delElementSelected"
      ></LayBar>
    </div>
    <div class="footer">
      <StatisticsBar
        :zoom="zoom"
        :elementSelected="eleSelected"
        @changeScaleValue="changeScaleValue"
      ></StatisticsBar>
    </div>
  </div>
</template>

<script>
import "animate.css";
import "../assets/css/custom.css";
import { setInterval, clearInterval } from "timers";
export default {
  name: "home",
  components: {},
  data() {
    return {
      appid: "",
      timer: null,
      isCanvasColorBlack: false,
      isExportable: false,
      resolution: "720P",
      zoom: 1,
      mag: 1,
      data: {},
      elements: [],
      eleSelected: {},
      lastIndex: 1
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
  beforeCreate() {},
  created() {
    this.$Loading.start();
    // 获取 appid
    this.appid = this.$utils.parseUrl("appid");
    if (this.appid == "" || this.appid == undefined) {
      this.$Message.error("No user");
      console.log(response.data.msg);
      this.$Loading.finish();
      this.$router.push({
        path: "/error",
        query: { msg: "No user" }
      });
    }
    let _this = this;
    this.$axios
      .post("https://editor.guangdianyun.tv:3006/getData", {
        appid: _this.appid,
        type: "editor"
      })
      .then(function(response) {
        if (response.data.code == "1") {
          _this.$Message.success("Init Success");
          console.log(response.data.msg);
          _this.elements = response.data.data.elements;
          _this.lastIndex = response.data.data.lastIndex;
          _this.$Loading.finish();
        } else if (response.data.code == "0") {
          
        } else {
          _this.$Message.error("Init Failed");
          _this.$Loading.error();
        }
      })
      .catch(function(error) {
        _this.$Message.error("Init Error");
        _this.$Loading.error();
      });

    // if (this.appid == null) {
    //   this.$Message.error("No user");
    //   console.log("No user:");
    //   this.$router.push({
    //     path: "/error",
    //     query: { msg: "No user" }
    //   });
    // } else {
    //   if (this.$store.state[this.appid] != undefined) {
    //     console.log("current user:", this.appid);
    //     this.elements = this.$store.state[this.appid].elements;
    //     this.lastIndex = this.$store.state[this.appid].lastIndex;
    //     console.log(this.lastIndex);
    //   } else {
    //     this.$store.dispatch("createNode", {
    //       id: this.appid
    //     });
    //     console.log("new user:", this.appid);
    //     this.elements = [];
    //     this.lastIndex = 1;
    //   }
    // }
  },
  mounted() {
    let socketObj = { appid: this.appid, type: "editor" };
    this.$socket.emit("online", socketObj);

    this.$socket.on("onceUpdate", () => {
      this.updateData();
    });

    this.$watch("elements", this.updateData, { deep: true });

    // auto-keep
    this.timer = setInterval(() => {
      this.exportJSON("auto save");
    }, 120000);
  },
  beforeDestroy() {
    //let temp = JSON.parse(JSON.stringify(this.elements));
    //this.$socket.close();
    // 节流
    //this.exportJSON("");
    clearInterval(this.timer);
    this.timer = null;
  },
  destroyed() {},
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
    keyboard(event) {
      if (event.keyCode == 13) {
        this.$Message.info("Enter");
      }
    },
    changeScaleValue(v) {
      this.$nextTick(() => {
        this.zoom = v;
      });
    },
    triggerBg() {
      if (this.isCanvasColorBlack) this.isCanvasColorBlack = false;
      else this.isCanvasColorBlack = true;
    },
    elementAdd(param, type) {
      let newObj = {};
      if (type == "img") {
        let image = new Image();
        image.src = param;
        image.onload = () => {
          newObj = {
            id: this.lastIndex,
            width: image.width,
            height: image.height,
            top: 0,
            left: 0,
            title: "",
            type: type,
            imgSrc: param,
            alpha: 100,
            index: 1,
            visible: true
          };
          this.lastIndex++;
          this.elements.push(newObj);
          image = null;
        };
      } else if (type == "word") {
        newObj = {
          id: this.lastIndex,
          width: 200,
          top: 0,
          left: 0,
          title: "",
          lineHeight: 1.5,
          type: type,
          text: param,
          color: "#000000",
          textAlign: "left",
          fontSize: 28,
          fontWeight: "normal",
          fontFamily: "Helvetica",
          alpha: 100,
          index: 1,
          visible: true,
          playing: true,
          tranform: 0,
          animation: "",
          loop: false,
          duration: 1,
          delay: 0,
          marquee_pattern: "normal",
          marquee_duration: 10
        };
        this.lastIndex++;
        this.elements.push(newObj);
      } else if (type == "layout") {
        if (param == "default_1") {
          newObj = {
            id: this.lastIndex,
            width: 880,
            height: 177,
            top: 550,
            left: 22,
            title: "",
            type: "layout",
            alpha: 100,
            index: 2,
            locked: true,
            visible: true,
            children: [
              {
                id: this.lastIndex + 1,
                width: 815,
                height: 135,
                top: -2,
                left: 0,
                title: "",
                type: "img",
                imgSrc:
                  "http://prvz33yaw.bkt.clouddn.com/images-oss_title_1.png",
                alpha: 100,
                index: 3,
                visible: true,
                duration: 0.1,
                marquee_duration: 1
              },
              {
                id: this.lastIndex + 2,
                width: 158,
                top: 34,
                left: 74,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "组件测试",
                color: "#FFFFFF",
                textAlign: "left",
                fontSize: "36",
                fontWeight: "bold",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 4,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              },
              {
                id: this.lastIndex + 3,
                width: 200,
                top: 83,
                left: 76,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "组件测试副标题",
                color: "#FFFFFF",
                textAlign: "left",
                fontSize: "24",
                fontWeight: "normal",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 4,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              }
            ],
            duration: 0.1,
            marquee_duration: 1
          };
          this.lastIndex = this.lastIndex + 4;
          this.elements.push(newObj);
        } else if (param == "default_2") {
          newObj = {
            id: this.lastIndex,
            width: 880,
            height: 177,
            top: 550,
            left: 22,
            title: "",
            type: "layout",
            alpha: 100,
            index: 2,
            locked: true,
            visible: true,
            children: [
              {
                id: this.lastIndex + 1,
                width: 815,
                height: 135,
                top: -2,
                left: 0,
                title: "",
                type: "img",
                imgSrc:
                  "http://prvz33yaw.bkt.clouddn.com/images-oss_title_2.png",
                alpha: 100,
                index: 3,
                visible: true,
                duration: 0.1,
                marquee_duration: 1
              },
              {
                id: this.lastIndex + 2,
                width: 158,
                top: 17,
                left: 32,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "组件测试",
                color: "#FFFFFF",
                textAlign: "left",
                fontSize: "36",
                fontWeight: "bold",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 4,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              },
              {
                id: this.lastIndex + 3,
                width: 200,
                top: 97,
                left: 32,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "组件测试副标题",
                color: "#000000",
                textAlign: "left",
                fontSize: "24",
                fontWeight: "normal",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 4,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              }
            ],
            duration: 0.1,
            marquee_duration: 1
          };
          this.lastIndex = this.lastIndex + 4;
          this.elements.push(newObj);
        } else if (param == "default_3") {
          newObj = {
            id: this.lastIndex,
            width: 880,
            height: 150,
            top: 550,
            left: 22,
            title: "",
            type: "layout",
            alpha: 100,
            index: 2,
            locked: true,
            visible: true,
            children: [
              {
                id: this.lastIndex + 1,
                width: 815,
                height: 135,
                top: -2,
                left: 0,
                title: "",
                type: "img",
                imgSrc:
                  "http://prvz33yaw.bkt.clouddn.com/images-oss_title_3.png",
                alpha: 100,
                index: 3,
                visible: true,
                duration: 0.1,
                marquee_duration: 1
              },
              {
                id: this.lastIndex + 2,
                width: 158,
                top: 49,
                left: 73,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "组件测试",
                color: "#FFFFFF",
                textAlign: "left",
                fontSize: "36",
                fontWeight: "bold",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 4,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              },
              {
                id: this.lastIndex + 3,
                width: 200,
                top: -4,
                left: 76,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "组件测试副标题",
                color: "#FFFFFF",
                textAlign: "left",
                fontSize: "24",
                fontWeight: "normal",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 4,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              }
            ],
            duration: 0.1,
            marquee_duration: 1
          };
          this.lastIndex = this.lastIndex + 4;
          this.elements.push(newObj);
        } else if (param == "default_4") {
          newObj = {
            id: this.lastIndex,
            width: 880,
            height: 177,
            top: 541,
            left: 207,
            title: "",
            type: "layout",
            alpha: 100,
            index: 2,
            locked: true,
            visible: true,
            children: [
              {
                id: this.lastIndex + 1,
                width: "796",
                height: "120",
                top: 29,
                left: 42,
                title: "",
                type: "img",
                imgSrc:
                  "http://prvz33yaw.bkt.clouddn.com/images-oss_1559528456000.png",
                alpha: 100,
                index: 1,
                visible: true,
                duration: 0.1,
                marquee_duration: 1
              },
              {
                id: this.lastIndex + 2,
                width: 35,
                top: 56,
                left: 375,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "1",
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: "46",
                fontWeight: "normal",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 1,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              },
              {
                id: this.lastIndex + 3,
                width: "35",
                top: 57,
                left: 469,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "1",
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: "46",
                fontWeight: "normal",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 1,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              },
              {
                id: this.lastIndex + 4,
                width: "145",
                top: 70,
                left: 120,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "队伍 1",
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: 28,
                fontWeight: "bold",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 1,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              },
              {
                id: this.lastIndex + 5,
                width: 145,
                top: 70,
                left: 618,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "队伍 2",
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: 28,
                fontWeight: "bold",
                fontFamily: "Helvetica",
                alpha: 100,
                index: 1,
                visible: true,
                playing: true,
                tranform: 0,
                animation: "",
                loop: false,
                duration: 1,
                delay: 0,
                marquee_pattern: "normal",
                marquee_duration: 10
              }
            ],
            duration: 0.1,
            marquee_duration: 1
          };
          this.lastIndex = this.lastIndex + 6;
          this.elements.push(newObj);
        }
      }

      //this.$store.commit("indexIncrement", this.lastIndex);
      //console.log(newObj);
      //this.$Message.success("New Object");
      //this.$store.dispatch("addElements", newObj);
      //this.lastIndex = this.$store.state.lastIndex;
      //this.elements = JSON.parse(JSON.stringify(this.$store.state.elements));
    },
    delElementSelected(ele) {
      this.elements.splice(
        this.elements.findIndex(item => item.id === ele.id),
        1
      );
    },
    getElementSelected(ele) {
      // 跟随变化
      this.eleSelected = ele;
    },
    clearElementSelected() {
      this.eleSelected = {
        id: 0,
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        type: null,
        imgSrc: "N/A",
        alpha: 100,
        index: 0
      };
    },
    changeResolution(reso, mag, zoom) {
      this.resolution = reso;
      this.mag = mag;
      this.zoom = zoom;
      this.updateData();
    },
    changeSocketExport(boolean) {
      this.isExportable = boolean;
      this.updateData();
    },
    toPreview() {
      this.exportJSON("");
      this.$router.push({
        path: "/preview",
        query: {
          data: this.elements,
          Resolution: this.resolution,
          Mag: this.mag
        }
      });
    },
    updateData() {
      // 输出至 Stage
      let socketData = {
        Resolution: this.resolution,
        Mag: this.mag,
        Objs: this.elements
      };
      this.$socket.emit("sendMsgPre", {
        appid: this.appid,
        data: socketData
      });
      if (this.isExportable) {
        this.$socket.emit("sendMsg", {
          appid: this.appid,
          data: socketData
        });
      }
    },
    updateDataOnce() {
      let socketData = {
        Resolution: this.resolution,
        Mag: this.mag,
        Objs: this.elements
      };
      this.$socket.emit("sendMsg", {
        appid: this.appid,
        data: socketData
      });
    },
    exportJSON(type) {
      this.$Loading.start();
      console.log(this.elements);
      // this.$store.dispatch("updateElements", {
      //   id: this.appid,
      //   eles: this.elements
      // });
      // this.$store.dispatch("indexIncrement", {
      //   id: this.appid,
      //   index: this.lastIndex
      // });
      let _this = this;
      //console.log(_this.$store.state);
      this.$axios
        .post("https://editor.guangdianyun.tv:3006/setData", {
          appid: _this.appid,
          data: { elements: _this.elements, lastIndex: _this.lastIndex }
        })
        .then(function(response) {
          console.log(response);
          if (response.data.code == "1") {
            if (type != "") {
              _this.$Message.success("Auto Save");
            } else {
              _this.$Message.success("Save OK");
            }
            _this.$Loading.finish();
          } else {
            _this.$Message.error("Save Failed");
            _this.$Loading.error();
          }
        })
        .catch(function(error) {
          _this.$Message.error("Save Error");
          _this.$Loading.error();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.blackCanvas {
  background-color: #1a1a1a !important;
}

.simpleCanvas {
  width: 853px;
  height: 480px;
  zoom: 1;
}

.normalCanvas {
  width: 1280px;
  height: 720px;
  zoom: 0.66666666;
}

.extendCanvas {
  width: 1920px;
  height: 1080px;
  zoom: 0.44444444;
}

.home {
  width: 100%;
  height: 100%;
  -webkit-animation-fill-mode: none;

  .header {
    width: 100%;
    height: 60px;
  }

  .content {
    width: 100%;
    min-height: 600px;
    position: absolute;
    top: 60px;
    bottom: 30px;
    left: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #f5f7f9;
    overflow: hidden;

    .inside-container {
      width: 100%;
      height: 100%;
      min-height: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .btn-trigger {
        position: absolute;
        top: 15px;
        left: 20px;
      }

      .dragCanvas {
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

  .footer {
    width: 100%;
    height: 30px;
    position: fixed;
    bottom: 0;
  }
}
</style>
