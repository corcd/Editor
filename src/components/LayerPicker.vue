<template>
  <div
    class="layerpicker"
    :class="{'layer-selected':(element.id == elementSelected.id)}"
    @click.stop="layerSelect"
  >
    <!-- <img alt="layer" :src="element.imgSrc"> -->
    <div class="layerpicker-ele">
      <img alt="img" draggable="false" :src="element.imgSrc">
    </div>
    <div class="layerpicker-info">
      <div class="layerpicker-indicator">
        <Icon type="ios-browsers" size="14"/>
        <h3>Layer {{element.id}}</h3>
      </div>
      <span>Z-Index: {{element.index}}</span>
    </div>
    <div class="layerpicker-controller" v-show="element.id == elementSelected.id">
      <a @click="delElement">
        <Icon type="md-close" size="15" color="black"/>
      </a>
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
  methods: {
    layerSelect() {
      let click = () => {
        //ele.edit = false;
        this.$emit("clearElementSelected");
        document
          .querySelector(".inside-container")
          .removeEventListener("click", click);
        document
          .querySelector(".dragCanvas")
          .removeEventListener("click", click);
      };

      if (this.element.id == this.elementSelected.id) {
        this.$emit("clearElementSelected");
      } else {
        this.$emit("getElementSelected", this.element);
        document
          .querySelector(".inside-container")
          .addEventListener("click", click);
        document.querySelector(".dragCanvas").addEventListener("click", click);
      }
    },
    delElement() {
      this.$emit("delElementSelected", this.element);
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
  background-color: #fff;
  cursor: pointer;

  .layerpicker-ele {
    width: 60px;
    min-width: 60px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 50px;
      max-height: 50px;
      margin-left: 5px;
    }
  }

  .layerpicker-info {
    width: 100%;
    height: 45px;
    padding-right: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .layerpicker-indicator {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      h3 {
        margin-left: 5px;
      }
    }
  }

  .layerpicker-controller {
    width: 15px;
    height: 100%;
    margin-right: 5px;
    position: absolute;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.6;

    i {
    }
  }
}
</style>

