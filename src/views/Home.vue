<template>
  <div class="home">
    <div class="header">
      <StatusBar @toPreview="toPreview" @elementAdd="elementAdd"></StatusBar>
    </div>
    <div class="container">
      <SideBar
        :elementSelected="eleSelected"
        :exportable="isExportable"
        @changeResolution="changeResolution"
        @changeSocketExport="changeSocketExport"
      ></SideBar>
      <div class="inside-container">
        <div id="canvas" class="dragCanvas">
          <ImgElement
            v-for="element in elements"
            :key="element.id"
            :element="element"
            :elementSelected="eleSelected"
            @getElementSelected="getElementSelected"
            @clearElementSelected="clearElementSelected"
          ></ImgElement>
        </div>
      </div>
      <LayBar
        :elements="elements"
        :elementSelected="eleSelected"
        @getElementSelected="getElementSelected"
        @clearElementSelected="clearElementSelected"
      ></LayBar>
    </div>
    <div class="footer">
      <StatisticsBar :elementSelected="eleSelected"></StatisticsBar>
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
      isExportable: true,
      resolution: "480P",
      mag: 1,
      data: {},
      elements: JSON.parse(JSON.stringify(this.$store.state.elements)),
      eleSelected: {},
      lastIndex: this.$store.state.lastIndex,
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
  created() {
    //this.elements = this.$store.state.elements;
  },
  mounted() {
    this.$socket.emit("online", "demo-editor");

    this.$watch("elements", this.updateData, { deep: true });
  },
  beforeDestroy() {
    let temp = JSON.parse(JSON.stringify(this.elements));
    this.$store.dispatch("updateElements", temp);
    this.$store.commit("indexIncrement", this.lastIndex);

    // 节流
    this.exportJSON();
  },
  computed: {},
  methods: {
    elementAdd(url, type) {
      let newObj = {
        id: this.lastIndex,
        width: 200,
        height: 200,
        top: 0,
        left: 0,
        type: type,
        imgSrc: url,
        alpha: 100,
        index: 1
      };
      this.lastIndex++;
      this.$store.commit("indexIncrement", this.lastIndex);
      //console.log(newObj);
      //this.elements.push(newObj);
      this.$store.dispatch("addElements", newObj);
      this.lastIndex = this.$store.state.lastIndex;
      this.elements = JSON.parse(JSON.stringify(this.$store.state.elements));
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
    changeResolution(reso, mag) {
      this.resolution = reso;
      this.mag = mag;
      this.updateData();
    },
    changeSocketExport(boolean) {
      this.isExportable = boolean;
    },
    toPreview() {
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
      if (this.isExportable) {
        this.$socket.emit("sendMsg", {
          Resolution: this.resolution,
          Mag: this.mag,
          Objs: this.elements
        });
      }
    },
    exportJSON() {
      this.$axios
        .post(
          "http://139.196.92.199:3006/data",
          JSON.parse(JSON.stringify(this.$store.state))
        )
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          this.$Message.error("Save Error");
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
      min-height: 600px;
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
