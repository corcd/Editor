<template>
  <div
    class="componentpicker"
    draggable="true"
    @dragstart="dragstart($event)"
    @click.stop="addComponent"
  >
    <img alt="component" :src="imgSrc" draggable="false">
    <div class="componentpicker-controller">
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentPicker",
  props: {
    imgSrc: String,
    title: String,
    type: String
  },
  methods: {
    dragstart(event) {
      // 存储拖拽数据和拖拽效果...
      event.dataTransfer.setData("Type", this.type);
      console.log(event.target);
    },
    addComponent() {
      this.$emit("addElement", this.type, "component");
    }
  }
};
</script>

<style lang="scss" scoped>
.adaptiveBackgoundColor {
  background-color: #c1c1c252 !important;
}

.componentpicker {
  width: 90%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-left: 3px solid #1db5ad;
  background-color: #292c30;
  cursor: pointer;

  img {
    width: 90%;
    margin: 5px;
    margin-top: 15px;
  }

  .componentpicker-controller {
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;

    span {
      width: 100%;
      font-size: 14px;
      color: #fff;
      text-align: center;
    }
  }
}
</style>
