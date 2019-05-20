<template>
  <div class="stage">
    <div id="canvas" class="showCanvas">
      <img id="ele_stage" class="showImg" alt="Vue logo" src="../assets/logo.png">
    </div>
  </div>
</template>

<script>
export default {
  name: "stage",
  components: {},
  data() {
    return {
      currentTop: "",
      currentLeft: ""
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
    this.$socket.emit("online", "demo-2");
    this.$socket.on("online", name => {
      if (!name) {
        return;
      }
      alert(name + "上线");
    });

    this.$socket.on("receiveMsg", data => {
      //console.log(data);
      this.currentTop = data.Top;
      this.currentLeft = data.Left;
      this.$nextTick(() => {
        this.setPosition();
      });
    });
  },
  beforeDestroy() {},
  methods: {
    setPosition() {
      let ele = document.getElementById("ele_stage");

      ele.style.top = this.currentTop;
      ele.style.left = this.currentLeft;

      console.log(ele.style.top, ele.style.left);
    }
  }
};
</script>

<style lang="scss" scoped>
.stage {
  width: 100%;
  height: 100%;

  .showCanvas {
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
