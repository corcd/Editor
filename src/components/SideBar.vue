<template>
  <div class="sidebar">
    <Form :label-width="50">
      <Divider>Profile</Divider>
      <FormItem label="Source:">
        <Input v-model="elementSelected.imgSrc" placeholder="N/A" readonly></Input>
      </FormItem>
      <Divider>Position</Divider>
      <FormItem label="Width:">
        <Input v-model="elementSelected.width" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="Height:">
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
      <FormItem label="Alpha:">
        <Slider v-model="elementSelected.alpha" show-input></Slider>
      </FormItem>
      <Divider>Export</Divider>
      <FormItem label="Display:">
        <Select v-model="selectData">
          <Option value="480P">480P (853*480)</Option>
          <Option value="720P">720P (1280*720)</Option>
          <Option value="1080P">1080P (1920*1080)</Option>
        </Select>
      </FormItem>
      <FormItem label="Export:">
        <i-switch v-model="exportData" size="large">
          <span slot="on">On</span>
          <span slot="off">Off</span>
        </i-switch>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { type } from "os";
export default {
  name: "SideBar",
  props: {
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
      selectData: "480P",
      exportData: this.exportable,
      videoMag: 1,
      realTop: 0.0,
      realLeft: 0.0
    };
  },
  methods: {},
  watch: {
    selectData: {
      handler(newValue, oldValue) {
        if (newValue == "480P") {
          this.$Message.success("480P");
          this.videoMag = 1;
        } else if (newValue == "720P") {
          this.$Message.success("720P");
          this.videoMag = 1.5;
        } else if (newValue == "1080P") {
          this.$Message.success("1080P");
          this.videoMag = 1.5 * 1.5;
        } else {
          this.$Message.error("Error");
          this.videoMag = 1;
        }
        let reso = newValue;
        let mag = this.videoMag;
        this.$emit("changeResolution", reso, mag);
      },
      immediate: true
    },
    exportData: {
      handler(newValue, oldValue) {
        if (newValue == true) {
          this.$emit("changeSocketExport", true);
          this.$Message.success({
            content: "Socket On",
            top: 10,
            duration: 10
          });
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
  width: 350px;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-right: 1px solid #d7dde4;
  //box-shadow: 0px 0px 6px #c2c2c2;
  background: #fff;

  form {
    width: 90%;
    margin-top: 10px;
  }
}
</style>
