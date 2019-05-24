<template>
  <div
    class="mini home"
    v-bind:class="[resolution == '480P' ? 'simpleCanvas':'',resolution == '720P' ? 'normalCanvas':'',resolution == '1080P' ? 'extendCanvas':'']"
  >
    <div class="container inside-container">
      <div class="editor dragCanvas" v-bind:class="[isEditorColorBlack ? 'easyeditor':'']">
        <ImgElement
          v-for="element in elements"
          :key="element.id"
          :resolution="resolution"
          :zoom="zoom"
          :element="element"
          :elementSelected="eleSelected"
          @getElementSelected="getElementSelected"
          @clearElementSelected="clearElementSelected"
          @delElementSelected="delElementSelected"
        ></ImgElement>
      </div>
      <div class="topbar">
        <div class="btn-group">
          <Button type="primary" shape="circle" class="btn-trigger" @click="triggerBg" ghost>Tigger</Button>
          <Upload
            :action="domain"
            :http-request="upqiniu"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
          >
            <Button type="primary" shape="circle" icon="ios-cloud-upload-outline" ghost>Upload files</Button>
          </Upload>
          <Button type="primary" shape="circle" class="btn-save" @click="exportJSON" ghost>Save</Button>
        </div>
      </div>
      <div class="bottombar">
        <div class="btn-group">
          <Button type="primary" shape="circle" class="btn-trigger" @click="updateData" ghost>Apply</Button>
          <Select v-model="selectData" placement="top-start">
            <Option value="480P">480P (853*480)</Option>
            <Option value="720P">720P (1280*720)</Option>
            <Option value="1080P">1080P (1920*1080)</Option>
          </Select>
        </div>
      </div>
      <div class="rightbar">
        <Button type="primary" shape="circle" class="btn-up" @click="indexUpward" ghost>Up</Button>
        <LayerPicker
          v-for="element in sortEles"
          :key="element.id"
          :element="element"
          :elementSelected="eleSelected"
          @getElementSelected="getElementSelected"
          @clearElementSelected="clearElementSelected"
          @delElementSelected="delElementSelected"
        ></LayerPicker>
        <Button type="primary" shape="circle" class="btn-down" @click="indexDownward" ghost>Down</Button>
      </div>
    </div>
  </div>
</template>

<script>
//数组对象方法倒序排序
function sortByKey(array, key) {
  return array.sort((a, b) => {
    let x = a[key];
    let y = b[key];
    return x > y ? -1 : x < y ? 1 : 0;
  });
}
import "animate.css";
export default {
  name: "mini",
  data() {
    return {
      appid: "",
      isEditorColorBlack: false,
      selectData: "720P",
      resolution: "720P",
      zoom: 1,
      mag: 1,
      data: {},
      elements: [],
      eleSelected: {},
      lastIndex: 0,
      imageUrl: "",
      token: {},
      // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
      domain: "https://upload.qiniup.com",
      // 这是七牛云空间的外链默认域名
      qiniuaddr: "prvz33yaw.bkt.clouddn.com"
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
    this.appid = this.$utils.parseUrl("appid");
    if (this.appid == null) {
      //this.$Message.error("No user");
      console.log("No user:");
      this.$router.push({
        path: "/error",
        query: { msg: "No user" }
      });
    } else {
      if (this.$store.state[this.appid] != undefined) {
        console.log("current user:", this.appid);
        this.elements = this.$store.state[this.appid].elements;
        this.lastIndex = this.$store.state[this.appid].lastIndex;
        console.log(this.lastIndex);
      } else {
        this.$store.dispatch("createNode", {
          id: this.appid
        });
        console.log("new user:", this.appid);
        this.elements = [];
        this.lastIndex = 1;
      }
    }
  },
  mounted() {
    let socketObj = { appid: this.appid, type: "editor" };
    this.$socket.emit("online", socketObj);

    this.$watch("elements", this.updateDataPre, { deep: true });
  },
  computed: {
    sortEles: function() {
      return sortByKey(this.elements, "index");
    }
  },
  methods: {
    indexUpward() {
      let ele = this.eleSelected;
      if (ele.index >= 1) ele.index++;
    },
    indexDownward() {
      let ele = this.eleSelected;
      if (ele.index > 1) ele.index--;
    },
    // 上传文件到七牛云
    upqiniu(file) {
      console.log(file);
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      let filetype = "";
      if (file.type === "image/png") {
        filetype = "png";
      } else {
        filetype = "jpg";
      }
      // 重命名要上传的文件
      const Name = file.name;
      const suffix = Name.substr(Name.indexOf(".")); // 文件后缀
      const keyname = "images-oss_" + Date.parse(new Date()) + suffix; // 组成新文件名

      // 从后端获取上传凭证token
      this.$axios.get("http://139.196.92.199:3006/token").then(res => {
        console.log(res);
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("token", res.data);
        formdata.append("key", keyname);
        // 获取到凭证之后再将文件上传到七牛云空间
        this.$axios
          .post(this.domain, formdata, config)
          .then(res => {
            this.imageUrl = "http://" + this.qiniuaddr + "/" + res.data.key;
            //this.$Message.success("Upload Success");
            console.log(res);
            this.elementAdd(this.imageUrl, "img");
          })
          .catch(err => {
            console.log(err);
            //this.$Message.error("Upload Error");
          });
      });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        console.log("Type Error");
        //this.$message.error("Type Error");
      }
      if (!isLt2M) {
        console.log("Volume Error");
        //this.$message.error("Volume Error");
      }
      this.upqiniu(file);
      return false; // 阻止Upload的默认上传
    },
    triggerBg() {
      if (this.isEditorColorBlack) this.isEditorColorBlack = false;
      else this.isEditorColorBlack = true;
    },
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
      this.elements.push(newObj);
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
    updateData() {
      // 输出至 Stage
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
    updateDataPre() {
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
    },
    exportJSON() {
      this.$Loading.start();
      //console.log(this.elements);
      this.$store.dispatch("updateElements", {
        id: this.appid,
        eles: this.elements
      });
      this.$store.dispatch("indexIncrement", {
        id: this.appid,
        index: this.lastIndex
      });
      let _this = this;
      //console.log(_this.$store.state);
      this.$axios
        .post(
          "http://139.196.92.199:3006/data",
          JSON.parse(JSON.stringify(_this.$store.state))
        )
        .then(function(response) {
          console.log(response);
          if (response.data.code == 1) {
            _this.$Loading.finish();
          } else {
            _this.$Loading.error();
          }
        })
        .catch(function(error) {
          console.log(error);
          _this.$Loading.error();
        });
    }
  },
  watch: {
    selectData: {
      handler(newValue, oldValue) {
        let html = document.getElementsByTagName("html")[0];
        if (newValue == "480P") {
          html.style.width = "853px";
          html.style.height = "480px";
          //this.zoom = 1;
        } else if (newValue == "720P") {
          html.style.width = "1280px";
          html.style.height = "720px";
          //this.zoom = 0.65;
        } else if (newValue == "1080P") {
          html.style.width = "1920px";
          html.style.height = "1080px";
          //this.zoom = 0.45;
        } else {
          html.style.width = "853px";
          html.style.height = "480px";
          //this.zoom = 1;
          this.videoMag = 1;
        }
        this.resolution = newValue;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.easyeditor {
  background-color: #1a1a1a !important;
}

.simpleCanvas {
  width: 853px;
  height: 480px;
  //zoom: 1;
}

.normalCanvas {
  width: 1280px;
  height: 720px;
  //zoom: 0.65;
}

.extendCanvas {
  width: 1920px;
  height: 1080px;
  //zoom: 0.45;
}

.mini {
  background-color: transparent !important;

  .container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: transparent !important;
    overflow: hidden;

    .editor {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 0;
      left: 0;
      border: 1px #1a1a1a solid;
      background-color: transparent;
      overflow: hidden;
      z-index: 0;
    }

    .topbar {
      width: 100%;
      min-height: 35px;
      margin: 5px;
      position: absolute;
      top: 0;

      .btn-group {
        width: 100%;
        min-height: 35px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .ivu-upload {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          margin-right: 5px;
          margin-left: 5px;
          z-index: 9999;
        }
      }
    }

    .bottombar {
      width: 100%;
      min-height: 35px;
      margin: 5px;
      position: absolute;
      bottom: 0;

      .btn-group {
        width: 100%;
        min-height: 35px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        button {
          margin-right: 5px;
          margin-left: 5px;
          z-index: 9999;
        }

        .ivu-select {
          width: 20%;
          background-color: transparent;
          z-index: 9999;

          .ivu-select-selection {
            background-color: transparent;
          }
        }
      }
    }

    .rightbar {
      min-width: 150px;
      height: 100%;
      margin: 5px;
      position: absolute;
      right: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .btn-up {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
