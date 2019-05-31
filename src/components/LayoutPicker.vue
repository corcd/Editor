<template>
  <div class="layoutpicker" @click.stop="addLayout">
    <img alt="layout" :src="imgSrc">
    <div class="layout-control">
      <h4>{{ title }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayoutPicker",
  props: {
    imgSrc: String,
    title: String,
    type: String
  },
  methods: {
    addLayout() {
      if (this.type == "default") {
        this.$emit("elementAdd", "default", "layout");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.layoutpicker {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #d7dde4;
  background-color: #fff;
  cursor: pointer;

  img {
    width: 90%;
    margin: 5px;
  }

  .layout-control {
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;

    h4 {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
