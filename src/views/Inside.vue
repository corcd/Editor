<template>
  <div class="inside home">
    <div class="inside-header">
      <div class="inside-header-info">
        <span v-show="!isTitleEdit" class="inside-header-info-main">{{ title }}</span>
        <Input v-show="isTitleEdit" class="inside-header-info-input" v-model="title"/>
        <Icon
          v-show="!isTitleEdit"
          class="inside-header-info-icon"
          type="md-settings"
          size="20"
          @click="changeTitleEditStatus"
        />
        <Icon
          v-show="isTitleEdit"
          class="inside-header-info-icon"
          type="md-checkmark-circle"
          size="20"
          @click="changeTitleEditStatus"
        />
        <Tag color="error">ALPHA</Tag>
      </div>
      <div class="inside-header-controller">
        <div class="inside-header-save" @click="selectToggleTest(layout_id)">
          <span>选中切换测试</span>
        </div>
        <div class="inside-header-save" @click="clearStageTest">
          <span>清除测试</span>
        </div>
        <div class="inside-header-save" @click="onceUpdataTest">
          <span>切换测试</span>
        </div>
        <div class="inside-header-save" @click="delData">
          <span>删除场景</span>
        </div>
        <div class="inside-header-save" @click="saveNewData">
          <span>另存为新场景</span>
        </div>
        <div class="inside-header-save" @click="saveData('update')">
          <span>保存当前场景</span>
        </div>
      </div>
    </div>
    <div class="inside-content">
      <div class="inside-sidebar" v-show="layout_id != 0">
        <div class="inside-sidebar-divider">
          <span>添加元素</span>
        </div>
        <Upload
          :action="domain"
          :http-request="upqiniu"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
        >
          <div class="inside-sidebar-button">
            <span>添加图片元素</span>
          </div>
        </Upload>
        <Poptip placement="bottom">
          <div class="inside-sidebar-button">
            <span>添加字幕元素</span>
          </div>
          <div class="api" slot="content">
            <Input v-model="newText" placeholder="Enter something..." style="width: 150px"/>
            <Button type="default" class="btn-new-word-confirm" @click="addWord">添加字幕</Button>
          </div>
        </Poptip>
        <div class="inside-sidebar-divider">
          <span>预设字幕条</span>
        </div>
        <ComponentPicker
          :imgSrc="'http://prvz33yaw.bkt.clouddn.com/images-oss_title_1.png'"
          :title="'预设字幕条 1'"
          :type="'default_1'"
          @addElement="addElement"
        ></ComponentPicker>
        <ComponentPicker
          :imgSrc="'http://prvz33yaw.bkt.clouddn.com/images-oss_title_2.png'"
          :title="'预设字幕条 2'"
          :type="'default_2'"
          @addElement="addElement"
        ></ComponentPicker>
        <ComponentPicker
          :imgSrc="'http://prvz33yaw.bkt.clouddn.com/images-oss_title_3.png'"
          :title="'预设字幕条 3'"
          :type="'default_3'"
          @addElement="addElement"
        ></ComponentPicker>
        <div class="inside-sidebar-divider">
          <span>预设比分板</span>
        </div>
        <ComponentPicker
          :imgSrc="'http://prvz33yaw.bkt.clouddn.com/images-oss_1559528456000.png'"
          :title="'预设比分板 1'"
          :type="'default_4'"
          @addElement="addElement"
        ></ComponentPicker>
      </div>
      <div class="inside-editor" v-show="layout_id != 0">
        <div class="inside-editor-toolbar">
          <div class="inside-editor-toolbar-tools">
            <div class="inside-editor-toolbar-tools-content">
              <div
                class="inside-editor-toolbar-tools-style"
                v-if="eleSelected.type=='layout' && eleSelected.model=='score'"
              >
                <span style="width: 120px !important;">队伍 1:</span>
                <Input
                  v-model="eleSelected.children[3].text"
                  placeholder="请输入标题内容..."
                  style="margin-right: 5px;"
                  clearable
                />
                <ColorPicker v-model="eleSelected.children[3].color" recommend></ColorPicker>
              </div>
              <div class="inside-editor-toolbar-tools-style" v-if="eleSelected.type=='layout'">
                <span v-show="eleSelected.model!='score'" style="width: 100px !important;">标题:</span>
                <span v-show="eleSelected.model=='score'">比分:</span>
                <Input
                  v-model="eleSelected.children[1].text"
                  v-if="eleSelected.model!='score'"
                  placeholder="请输入标题内容..."
                  style="margin-right: 5px;"
                  clearable
                />
                <InputNumber
                  :max="999"
                  :min="0"
                  v-model="eleSelected.children[1].text"
                  v-if="eleSelected.model=='score'"
                  placeholder="请输入比分..."
                  style="margin-right: 5px;"
                  clearable
                />
                <ColorPicker v-model="eleSelected.children[1].color" recommend></ColorPicker>
              </div>
              <div
                class="inside-editor-toolbar-tools-style"
                v-if="eleSelected.type=='layout' && eleSelected.model=='score'"
              >
                <span style="width: 120px !important;">队伍 2:</span>
                <Input
                  v-model="eleSelected.children[4].text"
                  placeholder="请输入副标题内容..."
                  style="margin-right: 5px;"
                  clearable
                />
                <ColorPicker v-model="eleSelected.children[4].color" recommend></ColorPicker>
              </div>
              <div class="inside-editor-toolbar-tools-style" v-if="eleSelected.type=='layout'">
                <span v-show="eleSelected.model!='score'" style="width: 120px !important;">副标题:</span>
                <span v-show="eleSelected.model=='score'">比分:</span>
                <Input
                  v-model="eleSelected.children[2].text"
                  v-if="eleSelected.model!='score'"
                  placeholder="请输入副标题内容..."
                  style="margin-right: 5px;"
                  clearable
                />
                <InputNumber
                  :max="999"
                  :min="0"
                  v-model="eleSelected.children[2].text"
                  v-if="eleSelected.model=='score'"
                  placeholder="请输入比分..."
                  style="margin-right: 5px;"
                  clearable
                />
                <ColorPicker v-model="eleSelected.children[2].color" recommend></ColorPicker>
              </div>

              <div class="inside-editor-toolbar-tools-style" v-if="eleSelected.type=='word'">
                <span style="width: 100px !important;">内容:</span>
                <Input
                  v-model="eleSelected.text"
                  placeholder="请输入内容..."
                  style="margin-right: 5px;"
                  clearable
                />
                <ColorPicker v-model="eleSelected.color" recommend></ColorPicker>
              </div>
              <div class="inside-editor-toolbar-tools-style" v-show="eleSelected.type=='word'">
                <span>字体:</span>
                <Select v-model="eleSelected.fontFamily" style="width: 90px; margin-right: 5px;">
                  <Option v-for="item in fontFamily" :key="item" :label="item" :value="item"></Option>
                </Select>
                <i-switch v-model="switchStatus" @on-change="changeFontWeight">
                  <span slot="open" style="width: 40px !important; font-size: 12px;">粗</span>
                  <span slot="close" style="width: 40px !important; font-size: 12px;">常</span>
                </i-switch>
              </div>
              <div
                class="inside-editor-toolbar-tools-style"
                v-if="false"
                v-show="eleSelected.type=='word'"
              >
                <ButtonGroup class="textAlignControl">
                  <Button
                    :disabled="eleSelected.textAlign == 'left'"
                    @click="changeTextAlign('left')"
                  >L</Button>
                  <Button
                    :disabled="eleSelected.textAlign == 'center'"
                    @click="changeTextAlign('center')"
                  >C</Button>
                  <Button
                    :disabled="eleSelected.textAlign == 'right'"
                    @click="changeTextAlign('right')"
                  >R</Button>
                </ButtonGroup>
              </div>
              <div class="inside-editor-toolbar-tools-style" v-show="eleSelected.type=='word'">
                <span>字号:</span>
                <InputNumber :max="100" :min="8" v-model="eleSelected.fontSize"></InputNumber>
              </div>

              <div
                class="inside-editor-toolbar-tools-style"
                v-show="eleSelected.type=='word' || eleSelected.type=='img'"
              >
                <span>透明度:</span>
                <InputNumber :max="100" :min="1" v-model="eleSelected.alpha"></InputNumber>
              </div>
            </div>
          </div>
        </div>
        <div class="inside-editor-content inside-container">
          <div
            class="dragCanvas canvas"
            v-bind:class="[resolution == '480P' ? 'simpleCanvas':'',resolution == '720P' ? 'normalCanvas':'',resolution == '1080P' ? 'extendCanvas':'',isCanvasColorBlack ? 'blackCanvas':'']"
            @click="clearElementSelected"
            @dragenter="dragenter($event)"
            @dragover="dragover($event)"
            @drop="drop($event)"
          >
            <ImgElement
              v-for="element in filterOfImg"
              :key="element.id"
              :resolution="resolution"
              :zoom="zoom"
              :inside="true"
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
              :inside="true"
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
              :inside="true"
              :element="element"
              :elementSelected="eleSelected"
              @getElementSelected="getElementSelected"
              @clearElementSelected="clearElementSelected"
              @delElementSelected="delElementSelected"
            ></LayoutItem>
          </div>
        </div>
      </div>
      <div class="inside-controlbar">
        <div class="inside-controlbar-divider">
          <span>历史场景模块</span>
        </div>
        <div class="inside-controlbar-divider">
          <span>场景测试模块</span>
        </div>
        <div class="inside-controlbar-layout">
          <div class="inside-controlbar-layoutpicker" v-for="item in layout" :key="item.id">
            <span>{{ item.title }}</span>
            <span>(ID:{{ item.id }})</span>
          </div>
        </div>
        <div class="inside-controlbar-divider">
          <span>图层测试模块</span>
        </div>
        <Table
          :columns="[{
                        title: '图层',
                        key: 'type'
                    },
                    {
                        title: '层次',
                        key: 'index',
                        sortable: true
                    }]"
          :data="elements"
          no-data-text="无图层"
          size="small"
        ></Table>
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
import "../assets/css/custom.css";
export default {
  name: "inside",
  data() {
    return {
      appid: "",
      uin: "",
      dms_token: "",
      eleid: 0,
      update_timer: null,
      timer: null,
      isCanvasColorBlack: false,
      isCollapsed: false,
      isExportable: false,
      isTitleEdit: false,
      selectData: "720P",
      resolution: "720P",
      zoom: 0.66666666,
      mag: 1,
      data: {},
      layout: [],
      current_layout_id: null,
      layout_id: 0,
      title: "",
      poster: "",
      elements: [],
      eleSelected: {},
      lastIndex: 1,
      newText: "",
      fontFamily: [
        "Helvetica",
        "SimSun",
        "SumHei",
        "Microsoft YaHei",
        "YouYuan",
        "sans-serif"
      ],
      switchStatus: false,
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
  beforeCreate() {},
  created() {
    this.$Loading.start();
    // 获取 appid
    this.appid = this.$utils.parseUrl("appid");
    console.log(this.appid);
    // 获取 uin
    this.uin = this.$utils.parseUrl("uin");
    console.log(this.uin);
    // 获取 token
    this.dms_token = this.$utils.parseUrl("token");
    console.log(this.dms_token);

    if (this.appid == "" || this.appid == undefined) {
      this.$Message.error("No user");
      console.log(response.data.msg);
      this.$Loading.finish();
      this.$router.push({
        path: "/error",
        query: { msg: "No user" }
      });
    }
    if (this.uin == "" || this.uin == undefined) {
      this.$Message.error("No uin");
    }
    // 获取工作区数据
    let self = this;
    this.$axios
      .post("https://editor.guangdianyun.tv:3006/getData", {
        appid: self.appid,
        type: "editor"
      })
      .then(response => {
        if (response.data.code == 1) {
          console.log(response.data);
          self.layout = response.data.data.layout;
          self.current_layout_id = response.data.extra;
          console.log("current_layout_id", self.current_layout_id);
          console.log("layout data length:", self.layout.length);
          if (self.layout.length == 0) {
            //console.log("New User")
            self.$Message.success("Init Success");
          } else {
            self.$Message.success("Load Success");
          }
          //this.elements = response.data.data.elements;
          //this.lastIndex = response.data.data.lastIndex;
          self.$Loading.finish();
        } else if (response.data.code == 0) {
        } else {
          self.$Message.error("Init Failed");
          self.$Loading.error();
        }
      })
      .catch(function(error) {
        self.$Message.error("Init Error");
        self.$Loading.error();
      });
    // DMS
    this.$axios({
      method: "GET",
      url: "//consoleapi.guangdianyun.tv/v1/account/person/getDmsKeyInfo",
      headers: {
        token: this.dms_token
      }
    })
      .then(response => {
        if (response.data.code == 200) {
          console.log(response.data.data);
          // DMS Init
          ROP.Leave();
          let pub_key = response.data.data.pub_key;
          let sub_key = response.data.data.sub_key;
          let clientid =
            "editor" + Date.parse(new Date()) + "" + Math.random() * 999;
          ROP.Enter(pub_key, sub_key, clientid, true);
          ROP.Subscribe("editor_" + this.uin);
          // 连接成功
          ROP.On("enter_suc", function() {
            console.log("EnterSuc");
          });
          // 连接失败
          ROP.On("enter_fail", function(err) {
            console.log("EnterFail:" + err);
          });
          // 重连
          ROP.On("offline", function(err) {
            console.log("offline:" + err);
          });
          // 离线
          ROP.On("reconnect", function() {
            console.log("reconnect:");
          });
          // 被相同ID挤掉线。
          ROP.On("connectold", function() {
            console.log("Another One");
          });
          // 与服务器断开连接的事件
          ROP.On("losed", function() {
            console.log("Losed");
          });
          // 收到消息
          ROP.On("publish_data", function(data, topic) {
            console.log("recv at " + topic + " -> " + data);
            let dataObj = JSON.parse(data);
            if (dataObj.cmd == "add") {
              try {
                // 新建场景
                self.$nextTick(() => {
                  if (self.layout.length == 0) {
                    console.log("empty layout");
                    console.log(self.layout);
                    self.newLayout(1);
                    console.log(self.layout);
                  } else {
                    console.log("not empty layout");
                    let new_id = self.layout[self.layout.length - 1].id + 1;
                    console.log(self.layout);
                    self.newLayout(new_id);
                    console.log(self.layout);
                  }
                  self.saveData("update");
                });
              } catch (error) {
                console.log(error);
              }
            } else if (dataObj.cmd == "edit") {
              // 编辑已有场景
              try {
                //self.layout_id = dataObj.extra.id;
                self.loadLayout(dataObj.id);
              } catch (error) {
                console.log(error);
              }
            } else if (dataObj.cmd == "modify") {
              // 编辑已有场景
              try {
                self.selectToggleTest(dataObj.id);
                //self.layout_id = dataObj.extra.id;
                //self.loadLayout(dataObj.id);
                //self.current_layout;
                //self.onceUpdataTest();
              } catch (error) {
                console.log(error);
              }
            } else if (dataObj.cmd == "update") {
            } else {
              // 防错处理
              console.log("DMS Params Error");
            }
          });
          self.$Loading.finish();
        } else {
          self.$Message.error("DMS Load Failed", response.data.errorMessag);
          self.$Loading.error();
        }
      })
      .catch(function(error) {
        self.$Message.error("DMS Load Error");
        self.$Loading.error();
      });
  },
  mounted() {
    let socketObj = { appid: this.appid, type: "editor" };
    this.$socket.emit("online", socketObj);

    this.$socket.on("onceUpdate", () => {
      this.updateDataOnce();
    });

    // this.$watch("elements", this.updateData, { immediate: true, deep: true });
    clearInterval(this.update_timer);
    this.update_timer = null;
    console.log("Update timer load");
    this.update_timer = setInterval(() => {
      this.updateData();
      //console.log("Update timer");
    }, 100);

    // auto-keep
    // this.timer = setInterval(() => {
    //   this.exportJSON("auto save");
    // }, 120000);
  },
  beforeDestroy() {
    ROP.Leave();
    clearInterval(this.update_timer);
    this.update_timer = null;
  },
  computed: {
    menuitemClasses: () => {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    filterOfImg() {
      if (this.elements)
        return this.elements.filter(item => item.type == "img");
    },
    filterOfWord() {
      if (this.elements)
        return this.elements.filter(item => item.type == "word");
    },
    filterOfLayout() {
      if (this.elements)
        return this.elements.filter(item => item.type == "layout");
    }
  },
  methods: {
    drop(event) {
      let type = event.dataTransfer.getData("Type");
      if (type != "") {
        this.addElement(type, "component");
      } else {
        self.$Message.error("Drag Error");
      }
    },
    dragover(event) {
      event.preventDefault();
    },
    dragenter(event) {
      event.preventDefault();
    },
    changeTitleEditStatus() {
      this.isTitleEdit = !this.isTitleEdit;
    },
    newLayout(id) {
      this.clearElementSelected();

      this.layout.push({
        id: id,
        title: "新建场景",
        poster: "",
        elements: [],
        lastIndex: 1
      });
      this.title = this.layout[this.layout.length - 1].title;
      this.poster = this.layout[this.layout.length - 1].poster;
      this.elements = this.layout[this.layout.length - 1].elements;
      this.lastIndex = this.layout[this.layout.length - 1].lastIndex;
      this.layout_id = id;
    },
    loadLayout(id) {
      this.$nextTick(() => {
        this.clearElementSelected();

        id = Number(parseInt(id));

        let layoutArray = this.layout.filter(item => item.id == id);
        let layoutSelected = JSON.parse(JSON.stringify(layoutArray[0]));
        this.title = layoutSelected.title;
        this.poster = layoutSelected.poster;
        this.elements = layoutSelected.elements;
        this.lastIndex = layoutSelected.lastIndex;
        this.layout_id = id;
        layoutSelected = null;
      });
      console.log(this.layout);
    },
    selectToggleTest(id) {
      id = Number(parseInt(id));

      this.current_layout_id = id;
      this.saveData("toggle");
    },
    clearStageTest() {
      let self = this;
      this.$axios
        .post("https://editor.guangdianyun.tv:3006/clear", {
          appid: self.appid
        })
        .then(response => {
          if (response.data.code == 1) {
            self.$Message.success("Cleared");
            self.$Loading.finish();
          } else {
            self.$Message.error("Clear Failed");
            self.$Loading.error();
          }
        })
        .catch(err => {
          self.$Message.error("Clear Error");
        });
    },
    onceUpdataTest() {
      let self = this;
      this.$axios
        .post("https://editor.guangdianyun.tv:3006/apply", {
          appid: self.appid,
          uin: self.uin,
          layout_id: self.layout_id
        })
        .then(response => {
          if (response.data.code == 1) {
            self.$Message.success("Applied");
            self.$Loading.finish();
          } else {
            self.$Message.error("Apply Failed");
            self.$Loading.error();
          }
        })
        .catch(function(error) {
          self.$Message.error("Apply Error");
          self.$Loading.error();
        });
    },
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
      this.$axios.get("https://editor.guangdianyun.tv:3006/token").then(res => {
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
            this.addElement(this.imageUrl, "img");
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
    addWord() {
      if (this.newText != "") {
        this.addElement(this.newText, "word");
        this.newText = "";
      }
    },
    changeTextAlign(param) {
      this.eleSelected.textAlign = param;
    },
    changeFontSize(property, op, step, limit) {
      if (op == "reduce" && this.eleSelected[property] > 1) {
        this.eleSelected[property] = Number(
          Number(this.eleSelected[property]) - step
        ).toFixed(limit);
      } else if (op == "increase") {
        this.eleSelected[property] = Number(
          Number(this.eleSelected[property]) + step
        ).toFixed(limit);
      } else {
        this.$Message.warning("Wrong " + property);
      }
    },
    changeFontWeight(status) {
      if (status) {
        this.eleSelected.fontWeight = "bold";
      } else {
        this.eleSelected.fontWeight = "normal";
      }
      //console.log(this.elementSelected.lineWeight);
    },
    delElementSelected(ele) {
      this.elements.splice(
        this.elements.findIndex(item => item.id === ele.id),
        1
      );
    },
    getElementSelected(ele) {
      this.eleSelected = ele;
      console.log(this.eleSelected);
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
    delData() {
      if (this.layout == []) {
        return false;
      }
      this.isTitleEdit = false;
      this.clearElementSelected();
      this.saveData("del");

      this.layout_id = 0;
      this.elements = [];
    },
    saveNewData() {
      this.$Loading.start();
      this.isTitleEdit = false;
      this.layout.push({
        id: this.layout[this.layout.length - 1].id + 1,
        title: "新增场景",
        poster: "",
        elements: this.elements,
        lastIndex: this.lastIndex
      });
      let self = this;
      this.$axios
        .post("https://editor.guangdianyun.tv:3006/setData", {
          appid: self.appid,
          uin: self.uin,
          action: "update",
          data: { layout: self.layout },
          current_layout_id: self.current_layout_id
        })
        .then(response => {
          console.log(response);
          if (response.data.code == 1) {
            self.$Message.success("Save Success");
            self.$Loading.finish();
          } else {
            self.$Message.error("Save Failed");
            self.$Loading.error();
          }
        })
        .catch(function(error) {
          self.$Message.error("Save Error");
          self.$Loading.error();
        });
    },
    saveData(action) {
      this.$Loading.start();
      this.isTitleEdit = false;
      console.log(this.layout_id);
      // 加载失败时阻止提交
      if (this.layout == []) {
        this.$Loading.error();
        return false;
      }

      if (action == "update") {
        this.layout.splice(
          this.layout.findIndex(item => item.id == this.layout_id),
          1,
          {
            id: this.layout_id,
            title: this.title,
            poster: this.poster,
            elements: this.elements,
            lastIndex: this.lastIndex
          }
        );
      } else if (action == "del") {
        if (this.layout_id == this.current_layout_id) {
          this.$Loading.error("Layout Is Using");
          return false;
        } else {
          this.layout.splice(
            this.layout.findIndex(item => item.id == this.layout_id),
            1
          );
        }
      } else if (action == "toggle") {
      } else {
        this.$Loading.error("Update Action Error");
      }

      let self = this;
      this.$axios
        .post("https://editor.guangdianyun.tv:3006/setData", {
          appid: self.appid,
          uin: self.uin,
          action: action,
          data: { layout: self.layout },
          current_layout_id: self.current_layout_id
        })
        .then(response => {
          console.log(response);
          if (response.data.code == 1) {
            self.$Message.success("Save Success");
            self.$Loading.finish();
          } else {
            self.$Message.error("Save Failed");
            self.$Loading.error();
          }
        })
        .catch(function(error) {
          self.$Message.error("Save Error");
          self.$Loading.error();
        });
    },
    updateData() {
      // 输出至 Preview
      if (this.current_layout_id) {
        let socketData;

        if (this.current_layout_id == this.layout_id) {
          socketData = {
            Resolution: this.resolution,
            Mag: this.mag,
            Objs: this.elements
          };
        } else {
          socketData = {
            Resolution: this.resolution,
            Mag: this.mag,
            Objs: this.layout[
              this.layout.findIndex(item => item.id == this.current_layout_id)
            ].elements
          };
        }

        this.$socket.emit("sendMsgPre", {
          appid: this.appid,
          data: socketData
        });
      }
    },
    updateDataOnce() {
      // 输出至 Stage & Preview
      if (this.current_layout_id) {
        let socketData = {
          Resolution: this.resolution,
          Mag: this.mag,
          Objs: this.layout[
            this.layout.findIndex(item => item.id == this.current_layout_id)
          ].elements
        };
        this.$socket.emit("sendMsgPre", {
          appid: this.appid,
          data: socketData
        });
        this.$socket.emit("sendMsg", {
          appid: this.appid,
          data: socketData
        });
      }
    },
    addElement(param, type) {
      let newObj = {};
      if (type == "img") {
        let image = new Image();
        image.src = param;
        image.onload = () => {
          newObj = {
            id: this.lastIndex,
            width: image.width,
            height: image.height,
            top: 50,
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
          top: 50,
          left: 0,
          title: "",
          lineHeight: 1.5,
          type: type,
          text: param,
          color: "#ffffff",
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
        this.eleSelected = this.elements[this.elements.length - 1];
      } else if (type == "component") {
        if (param == "default_1") {
          newObj = {
            id: this.lastIndex,
            width: 880,
            height: 150,
            top: 550,
            left: 22,
            title: "",
            type: "layout",
            model: "sub",
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
                width: 550,
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
                width: 550,
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
          this.eleSelected = this.elements[this.elements.length - 1];
        } else if (param == "default_2") {
          newObj = {
            id: this.lastIndex,
            width: 880,
            height: 150,
            top: 550,
            left: 22,
            title: "",
            type: "layout",
            model: "sub",
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
                width: 750,
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
                width: 265,
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
          this.eleSelected = this.elements[this.elements.length - 1];
        } else if (param == "default_3") {
          newObj = {
            id: this.lastIndex,
            width: 880,
            height: 150,
            top: 550,
            left: 22,
            title: "",
            type: "layout",
            model: "sub",
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
                width: 695,
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
                width: 480,
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
          this.eleSelected = this.elements[this.elements.length - 1];
        } else if (param == "default_4") {
          newObj = {
            id: this.lastIndex,
            width: 880,
            height: 177,
            top: 541,
            left: 207,
            title: "",
            type: "layout",
            model: "score",
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
                width: 73,
                top: 61,
                left: 355,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "1",
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: "40",
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
                width: 73,
                top: 61,
                left: 448,
                title: "",
                lineHeight: 1.5,
                type: "word",
                text: "1",
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: "40",
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
                width: 267,
                top: 70,
                left: 59,
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
                width: 267,
                top: 70,
                left: 554,
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
          this.eleSelected = this.elements[this.elements.length - 1];
        }
      }
    }
  },
  watch: {
    "eleSelected.fontWeight": {
      handler(newValue, oldValue) {
        if (newValue == "bold") this.switchStatus = true;
        else this.switchStatus = false;
      },
      deep: true,
      immediate: true
    },
    selectData: {
      handler(newValue, oldValue) {
        if (newValue == "480P") {
          this.zoom = 1;
        } else if (newValue == "720P") {
          this.zoom = 0.66666666;
        } else if (newValue == "1080P") {
          this.zoom = 0.44444444;
        } else {
          this.zoom = 1;
        }
        this.resolution = newValue;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
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

.inside {
  width: 100%;
  height: 100%;
  font-size: 19px;
  font-family: "Microsoft YaHei", 微软雅黑, Tahoma, Geneva, sans-serif;
  color: white;
  background-color: #2f353b;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  .inside-header {
    width: 100%;
    height: 70px;
    position: relative;
    display: flex;
    align-items: center;
    background-color: #212326;
    box-shadow: 0 0px 15px #212326;
    border-bottom: 3px solid #1db5ad;
    z-index: 2;

    .inside-header-info {
      position: absolute;
      left: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;

      .inside-header-info-main {
        margin-right: 8px;
        font-size: 28px;
      }

      .inside-header-info-input {
        width: 200px;
        margin-right: 10px;
        margin-bottom: 5px;
      }

      .inside-header-info-icon {
        margin-right: 10px;
        margin-bottom: 5px;
        cursor: pointer;
      }

      .ivu-tag {
        width: 40px;
        height: 15px;
        margin-bottom: 7px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .inside-header-controller {
      position: absolute;
      right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      .inside-header-save {
        width: 100px;
        height: 35px;
        margin-left: 5px;
        margin-right: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #2f353b;
        cursor: pointer;

        span {
          font-size: 14px;
          //color: white;
          color: #1db5ad;
        }
      }
    }
  }

  .inside-content {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    background-color: #3f464d;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .inside-sidebar {
      width: 300px;
      min-width: 300px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      box-shadow: 0 0px 12px #2f353b;
      background-color: #2f353b;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      z-index: 1;

      &::-webkit-scrollbar {
        display: none;
      }

      .ivu-upload {
        height: 35px;
        margin-bottom: 8px;

        .inside-sidebar-button {
          width: 270px;
          height: 35px;
          //margin-bottom: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-left: 3px solid #1db5ad;
          background-color: #292c30;
          cursor: pointer;

          span {
            font-size: 14px;
          }
        }
      }

      .ivu-poptip {
        width: 100%;
        margin: 0;

        .ivu-poptip-rel {
          .inside-sidebar-button {
            width: 270px;
            height: 35px;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-left: 3px solid #1db5ad;
            background-color: #292c30;
            cursor: pointer;

            span {
              font-size: 14px;
            }
          }
        }
      }

      .inside-sidebar-divider {
        width: 100%;
        height: 30px;
        margin-bottom: 8px;
        font-size: 16px;
        background-color: #212326;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .inside-editor {
      flex-grow: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .inside-editor-toolbar {
        width: 100%;
        height: 80px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        background-color: #3f464d;
        //border-bottom: 1px solid #2123267e;

        .inside-editor-toolbar-tools {
          width: 853px;
          height: 60px;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 0;
          background: #212326;
          box-shadow: 0 0px 15px #212326;
          border-radius: 2px;

          .inside-editor-toolbar-tools-content {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .inside-editor-toolbar-tools-style {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin-left: 5px;
              margin-right: 5px;

              span {
                width: 60px;
                font-size: 14px;
              }
            }
          }
        }
      }

      .inside-editor-content {
        flex-grow: 1;
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 1;

        .canvas {
          margin: 0;
          padding: 0;
          border: 0;
          background: #212326;
          box-shadow: 0 0px 12px #212326;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
          z-index: 0;

          .element {
            position: absolute;
          }
        }
      }
    }

    .inside-controlbar {
      width: 150px;
      min-width: 100px;
      height: 100%;
      box-shadow: 0 0px 12px #2f353b;
      background-color: #2f353b;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      z-index: 1;

      .inside-controlbar-divider {
        width: 100%;
        height: 30px;
        font-size: 16px;
        background-color: #212326;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .inside-controlbar-layout {
        width: 100%;
        height: 200px;

        .inside-controlbar-layoutpicker {
          width: 100%;
          height: 40px;
          display: inline-block;

          span {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
