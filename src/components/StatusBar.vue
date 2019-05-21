<template>
  <div class="statusbar">
    <div class="btn-group">
      <Upload
        :on-success="_upload"
        action
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
      >
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
      </Upload>
      <Button class="btn-profile" @click="isProfileShow = true" type="primary">View Profile</Button>
    </div>
    <!-- <Drawer :closable="false" width="640" v-model="isProfileShow">
      <p :style="pStyle">User Profile</p>
      <p :style="pStyle">Personal</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">Full Name: Aresn</Col>
          <Col span="12">Account: aresn@aresn.com</Col>
        </Row>
        <Row>
          <Col span="12">City: BeiJing</Col>
          <Col span="12">Country: China</Col>
        </Row>
        <Row>
          <Col span="12">Birthday: May 14, 1991</Col>
          <Col span="12">
            Website:
            <a href="https://dev.iviewui.com" target="_blank">https://dev.iviewui.com</a>
          </Col>
        </Row>Message: Hello, Developer
      </div>
      <Divider/>
      <p :style="pStyle">Company</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">Position: Programmer</Col>
          <Col span="12">Responsibilities:Coding</Col>
        </Row>
        <Row>
          <Col span="12">Department: Map visualization</Col>
        </Row>Skills:C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc.
      </div>
      <Divider/>
      <p :style="pStyle">Contacts</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">Email: admin@aresn.com</Col>
          <Col span="12">Phone Number: +86 18888888888</Col>
        </Row>
        <Row>
          <Col span="12">
            GitHub:
            <a
              href="https://github.com/iview/iview"
              target="_blank"
            >https://github.com/iview/iview</a>
          </Col>
        </Row>
      </div>
    </Drawer>-->
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64;
export default {
  name: "StatusBar",
  data() {
    return {
      isPreviewOn: false,
      isProfileShow: false
    };
  },
  methods: {
    _upload(response, file) {
      console.log(response, file);
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
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        let _file = e.target.result;

        console.log(Base64.encode(_file));
        // this.$api
        //   .post({
        //     data: Base64.encode(_file)
        //   })
        //   .then(res => {
        //     // 上传成功
        //   });
      };
      return false; // 阻止Upload的默认上传
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

  .btn-group {
    position: absolute;
    right: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .ivu-upload {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;

      .ivu-upload-list {
      }
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
