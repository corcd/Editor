<template>
  <div class="sidebar">
    <Form :label-width="60">
      <Divider>Profile</Divider>
      <FormItem label="Source:" v-show="elementSelected.type=='img'">
        <Input v-model="elementSelected.imgSrc" placeholder="N/A" readonly></Input>
      </FormItem>
      <FormItem label="Text:" v-show="elementSelected.type=='word'">
        <Input v-model="elementSelected.text" placeholder="N/A"></Input>
      </FormItem>
      <Divider>Position</Divider>
      <FormItem label="Width:" style="margin-bottom: 0 !important;">
        <Input v-model="elementSelected.width" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <div class="form-item-lock">
        <a @click="changeProportional">
          <Icon type="md-lock" size="16" v-show="isProportional"/>
          <Icon type="md-unlock" size="16" color="#96a9d3" v-show="!isProportional"/>
        </a>
      </div>
      <FormItem label="Height:" style="margin-top: 0 !important;">
        <Input v-model="elementSelected.height" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="Top:">
        <Input v-model="elementSelected.top" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="Left:">
        <Input v-model="elementSelected.left" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="Font:" v-show="elementSelected.type=='word'">
        <Select v-model="elementSelected.fontFamily">
          <Option v-for="item in fontFamily" :key="item" :label="item" :value="item"></Option>
        </Select>
      </FormItem>
      <FormItem label="FontSize:" v-show="elementSelected.type=='word'">
        <Input v-model="elementSelected.fontSize" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="LineHeight:" v-show="elementSelected.type=='word'">
        <Input v-model="elementSelected.lineHeight" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="FontWeight:" v-show="elementSelected.type=='word'">
        <i-switch size="large" v-model="switchStatus" @on-change="changeLineWeight">
          <span slot="open">Bold</span>
          <span slot="close">Norm</span>
        </i-switch>
      </FormItem>
      <FormItem label="Alpha:">
        <Slider v-model="elementSelected.alpha" show-input></Slider>
      </FormItem>
      <Divider>Export</Divider>
      <FormItem label="Clear:">
        <Button type="warning" style="width: 100%" @click="clearStage" ghost>Stage Clear</Button>
      </FormItem>
      <FormItem label="Display:">
        <Select v-model="selectData">
          <Option value="480P">480P (853*480)</Option>
          <Option value="720P">720P (1280*720)</Option>
          <Option value="1080P">1080P (1920*1080)</Option>
        </Select>
      </FormItem>
      <FormItem label="Apply:">
        <Button style="width: 100%" @click="applyLayout">Apply Layout</Button>
      </FormItem>
      <FormItem label="Export:">
        <i-switch v-model="exportData" size="large">
          <span slot="open">On</span>
          <span slot="close">Off</span>
        </i-switch>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { type } from "os";
import { setTimeout } from "timers";
export default {
  name: "SideBar",
  props: {
    appid: String,
    elementSelected: {
      type: Object,
      default: null
    },
    exportable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectData: "720P",
      zoom: 1,
      exportData: this.exportable,
      isProportional: true,
      videoMag: 1,
      realTop: 0.0,
      realLeft: 0.0,
      fontFamily: [
        "Helvetica",
        "SimSun",
        "SumHei",
        "Microsoft YaHei",
        "YouYuan",
        "sans-serif"
      ],
      switchStatus: false
    };
  },
  created() {
    if (this.elementSelected.lineWeight == "bold") this.switchStatus = true;
    else this.switchStatus = false;
  },
  methods: {
    changeLineWeight(status) {
      if (status) {
        this.elementSelected.lineWeight = "bold";
      } else {
        this.elementSelected.lineWeight = "normal";
      }
      console.log(this.elementSelected.lineWeight);
    },
    changeProportional() {
      if (this.isProportional) this.isProportional = false;
      else this.isProportional = true;
    },
    applyLayout() {
      this.$emit("applyLayout");
    },
    clearStage() {
      let _this = this;
      this.$emit("changeSocketExport", false);
      this.exportData = false;

      this.$axios
        .post("http://139.196.92.199:3006/clear", { appid: this.appid })
        .then()
        .catch(err => {
          _this.$Message.error("Stage Error");
        });
    }
  },
  watch: {
    selectData: {
      handler(newValue, oldValue) {
        if (newValue == "480P") {
          //this.$Message.success("480P");
          //this.$emit("setResolution", "480P");
          this.zoom = 1;
          this.videoMag = 1;
        } else if (newValue == "720P") {
          //this.$Message.success("720P");
          //this.$emit("setResolution", "720P");
          this.zoom = 0.66666666;
          this.videoMag = 1.5;
        } else if (newValue == "1080P") {
          //this.$Message.success("1080P");
          //this.$emit("setResolution", "1080P");
          this.zoom = 0.44444444;
          this.videoMag = 1.5 * 1.5;
        } else {
          //this.$emit("setResolution", "480P");
          this.$Message.error("Error");
          this.videoMag = 1;
        }
        let reso = newValue;
        let mag = this.videoMag;
        let zoom = this.zoom;
        this.$emit("changeResolution", reso, mag, zoom);
      },
      immediate: true
    },
    exportData: {
      handler(newValue, oldValue) {
        if (newValue == true) {
          this.$emit("changeSocketExport", true);
          this.$Message.success("Socket On");
        } else if (newValue == false) {
          this.$emit("changeSocketExport", false);
          this.$Message.warning("Socket Off");
        } else {
          this.$emit("changeSocketExport", false);
          this.$Message.error("Error");
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 280px;
  min-width: 280px;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-right: 1px solid #d7dde4;
  //box-shadow: 0px 0px 6px #c2c2c2;
  background: #fff;
  overflow-y: auto;

  form {
    width: 90%;
    margin-top: 5px;
    margin-bottom: 5px;

    .form-item-lock {
      width: 100%;
      margin-top: 0;
      margin-bottom: 0;
      padding-right: 82%;
    }

    .ivu-form-item {
      margin-bottom: 15px;
    }
  }
}
</style>
