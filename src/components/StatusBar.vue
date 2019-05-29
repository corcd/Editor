<template>
  <div class="statusbar">
    <div class="btn-do-group">
      <h1>Editor</h1>
      <ButtonGroup shape="circle">
        <Button icon="ios-arrow-back" disabled></Button>
        <Button icon="ios-arrow-forward" disabled></Button>
      </ButtonGroup>
      <h3>UserId: {{appid}}</h3>
    </div>
    <div class="btn-group">
      <Poptip placement="bottom">
        <Button type="default" class="btn-new-word">New Text</Button>
        <div class="api" slot="content">
          <Input v-model="newText" placeholder="Enter something..." style="width: 150px"/>
          <Button type="default" class="btn-new-word-confirm" @click="addWord">Add</Button>
        </div>
      </Poptip>¸
      <Upload
        :action="domain"
        :http-request="upqiniu"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
      >
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
      </Upload>
      <Divider type="vertical"/>
      <Button type="primary" class="btn-save" @click="_save">Save</Button>
      <Button class="btn-preview" @click="_preview" type="primary" disabled>Preview</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatusBar",
  props: {
    appid: String
  },
  data() {
    return {
      imageUrl: "",
      newText: "",
      token: {},
      // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
      domain: "https://upload.qiniup.com",
      // 这是七牛云空间的外链默认域名
      qiniuaddr: "prvz33yaw.bkt.clouddn.com"
    };
  },
  methods: {
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
            this.$Message.success("Upload Success");
            console.log(res);
            this.$emit("elementAdd", this.imageUrl, "img");
          })
          .catch(err => {
            this.$Message.error("Upload Error");
          });
      });
    },
    addWord() {
      //this.newText = "你好，hello";
      if (this.newText != "") {
        this.$emit("elementAdd", this.newText, "word");
      } else {
        this.$Message.warning("Empty Input");
      }
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
        this.$message.error("Type Error");
      }
      if (!isLt2M) {
        this.$message.error("Volume Error");
      }
      this.upqiniu(file);
      return false; // 阻止Upload的默认上传
    },
    _preview() {
      this.$emit("toPreview");
    },
    _save() {
      this.$emit("triggerSave");
    }
  }
};
</script>

<style lang="scss" scoped>
.statusbar {
  width: 100%;
  height: 60px;
  background: #515a6e;
  display: flex;
  align-items: center;
  z-index: 9999;

  .btn-do-group {
    position: absolute;
    left: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    h1 {
      color: #fff;
      margin-right: 20px;
    }

    h3 {
      margin-left: 20px;
      color: #96a9d3;
    }
  }

  .btn-group {
    position: absolute;
    right: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .btn-new-word {
      margin-right: 20px;
    }

    .btn-new-word-confirm {
      margin-left: 10px;
    }

    .ivu-divider {
      margin-right: 48px;
    }

    .ivu-upload {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 38px;

      .ivu-upload-list {
      }
    }

    .btn-save {
      margin-right: 20px;
    }
  }
  // .demo-drawer-profile {
  //   font-size: 14px;
  // }
  // .demo-drawer-profile .ivu-col {
  //   margin-bottom: 12px;
  // }

  // .btn-profile {
  //   position: absolute;
  //   right:20px;
  // }
}
</style>
