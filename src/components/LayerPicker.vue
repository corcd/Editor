<template>
  <div
    class="layerpicker"
    :class="{'layer-selected':(element.id == elementSelected.id)}"
    @click="layerSelect"
  >
    <!-- <img alt="layer" :src="element.imgSrc"> -->
    <div class="layerpicker-ele">
      <img alt="img" draggable="false" :src="element.imgSrc">
    </div>
    <div class="layerpicker-info">
      <h4>Layer {{element.id}}</h4>
      <span>Index: {{element.index}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayerPicker",
  props: {
    element: Object,
    elementSelected: Object
  },
  data() {},
  methods: {
    layerSelect() {
      if (this.element.id == this.elementSelected.id) {
        this.$emit("clearElementSelected");
      } else {
        this.$emit("getElementSelected", this.element);
      }
    }
  }
};
</script>

<style lang="scss">
.layer-selected {
  border: 1px solid #2c8df0 !important;
  box-shadow: 0px 0px 5px #2c8df0;
}

.layerpicker {
  width: 100%;
  height: 60px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #d7dde4;
  cursor: pointer;

  .layerpicker-ele {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 45px;
      height: 45px;
    }
  }

  .layerpicker-info {
    width: 100%;
    height: 45px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>

