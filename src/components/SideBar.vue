<template>
  <div class="sidebar">
    <Form :model="formItem" :label-width="50">
      <Divider>Profile</Divider>
      <FormItem label="Source:">
        <Input v-model="ele.imgSrc" placeholder="N/A" readonly></Input>
      </FormItem>
      <Divider>Position</Divider>
      <FormItem label="Width:">
        <Input v-model="ele.width" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="Height:">
        <Input v-model="ele.height" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="Top:">
        <Input v-model="ele.top" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="Left:">
        <Input v-model="ele.left" placeholder="0">
          <span slot="append">px</span>
        </Input>
      </FormItem>
      <FormItem label="Alpha:">
        <Slider v-model="ele.alpha" show-input></Slider>
      </FormItem>
      <Divider>Export</Divider>
      <FormItem label="Display:">
        <Select v-model="formItem.select">
          <Option value="480P">480P (853*480)</Option>
          <Option value="720P">720P (1280*720)</Option>
          <Option value="1080P">1080P (1920*1080)</Option>
        </Select>
      </FormItem>
      <FormItem label="Export:">
        <i-switch v-model="formItem.switch" size="large">
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
    element: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formItem: {
        select: "480P",
        switch: true,
        alpha: 0
      },
      ele: {},
      videoMag: 1
    };
  },
  methods: {},
  watch: {
    "formItem.select": {
      handler(newValue, oldValue) {
        if (newValue == "480P") {
          this.$Message.success("480P");
          this.videoMag = 1;
        } else if (newValue == "720P") {
          this.$Message.success("720P");
          this.videoMag = 16.0 / 9.0;
        } else if (newValue == "1080P") {
          this.$Message.success("1080P");
          this.videoMag = ((16.0 / 9.0) * 16.0) / 9.0;
        } else {
          this.$Message.error("Error");
          this.videoMag = 1;
        }
        let reso = newValue;
        let mag = this.videoMag;
        this.$emit("changeResolution", reso, mag);
      },
      deep: true,
      immediate: true
    },
    "formItem.switch": {
      handler(newValue, oldValue) {
        if (newValue == true) {
          this.$Message.success("Socket On");
        } else if (newValue == false) {
          this.$Message.success("Socket Off");
        } else {
          this.$Message.error("Error");
        }
      },
      deep: true,
      immediate: true
    },
    element: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.ele = newValue;
        } else {
          this.ele = {
            id: 0,
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            type: null,
            imgSrc: "N/A",
            index: 1,
            edit: false
          };
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 350px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-right: 1px solid #d7dde4;
  background: #fff;

  form {
    width: 90%;
    margin-top: 10px;
  }
}
</style>
