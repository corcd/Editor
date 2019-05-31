<template>
  <div class="layerpicker">
    <div
      class="layerpicker-father"
      :class="{'layer-selected':(element.id == elementSelected.id)}"
      @click.stop="layerSelect"
    >
      <!-- <img alt="layer" :src="element.imgSrc"> -->
      <div class="layerpicker-ele">
        <img alt="img" draggable="false" v-if="element.type=='img'" :src="element.imgSrc">
        <span draggable="false" v-if="element.type=='word'">T</span>
        <span draggable="false" v-if="element.type=='layout'">L</span>
      </div>
      <div class="layerpicker-info">
        <div class="layerpicker-indicator">
          <Icon type="ios-browsers" size="14"/>
          <h3 v-if="element.type=='img'">Img {{ element.id }}</h3>
          <h3 v-if="element.type=='word'">Text {{ element.id }}</h3>
          <h3 v-if="element.type=='layout'">Layout {{ element.id }}</h3>
        </div>
        <span>Z-Index: {{ element.index }}</span>
      </div>
      <div class="layerpicker-controller" v-show="element.id == elementSelected.id">
        <a @click.stop="delElement">
          <Icon type="md-close" size="15" color="#96a9d3"/>
        </a>

        <a @click.stop="hideElement(element)" v-show="element.visible">
          <Icon type="md-eye" size="15" color="#96a9d3"/>
        </a>
        <a @click.stop="showElement(element)" v-show="!element.visible">
          <Icon type="md-eye-off" size="15" color="#2c8df0"/>
        </a>

        <a @click.stop="lockLayout(element)" v-if="element.type=='layout'">
          <Icon type="md-lock" size="16" color="#96a9d3" v-show="element.locked"/>
          <Icon type="md-unlock" size="16" color="#2c8df0" v-show="!element.locked"/>
        </a>
      </div>
    </div>

    <div
      class="layerpicker-children"
      v-show="element.type=='layout'"
      v-for="item in element.children"
      :key="item.id"
      :class="{'layer-children-selected':(item.id == elementSelected.id)}"
      @click.stop="layerChildrenSelect(item)"
    >
      <div class="layerpicker-children-ele">
        <img alt="img" draggable="false" v-if="item.type=='img'" :src="item.imgSrc">
        <span draggable="false" v-if="item.type=='word'">T</span>
      </div>
      <div class="layerpicker-children-info">
        <div class="layerpicker-children-indicator">
          <h4 v-if="item.type=='img'">Img {{ item.id }}</h4>
          <h4 v-if="item.type=='word'">Text {{ item.id }}</h4>
        </div>
        <span>Z-Index: {{ item.index }}</span>
      </div>
      <div class="layerpicker-children-controller" v-show="item.id == elementSelected.id">
        <a @click.stop="delChildrenElement">
          <Icon type="md-close" size="15" color="black"/>
        </a>
        <a @click.stop="hideElement(item)" v-show="item.visible" :disabled="!element.visible">
          <Icon type="md-eye" size="15" color="#96a9d3"/>
        </a>
        <a @click.stop="showElement(item)" v-show="!item.visible" :disabled="!element.visible">
          <Icon type="md-eye-off" size="15" color="#2c8df0"/>
        </a>
      </div>
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
  data() {
    return {
      isShow: true
    };
  },
  methods: {
    lockLayout(ele) {
      if (ele.type == "layout") {
        if (ele.locked) {
          ele.locked = false;
        } else {
          ele.locked = true;
        }
        //this.$emit("getElementSelected", ele);
      }
    },
    hideElement(ele) {
      //this.isShow = false;
      ele.visible = false;
    },
    showElement(ele) {
      //this.isShow = true;
      ele.visible = true;
    },
    layerChildrenSelect(item) {
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

      if (item.id == this.elementSelected.id) {
        this.$emit("clearElementSelected");
      } else {
        this.$emit("getElementSelected", item);
        document
          .querySelector(".inside-container")
          .addEventListener("click", click);
        document.querySelector(".dragCanvas").addEventListener("click", click);
      }
    },
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
    delChildrenElement() {
      this.element.children.splice(
        this.element.children.findIndex(
          item => item.id === this.elementSelected.id
        ),
        1
      );
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

.layer-children-selected {
  border: 1px solid #515a6e !important;
  box-shadow: 0px 0px 5px #515a6e;
}

.layerpicker {
  width: 100%;

  .layerpicker-father {
    width: 100%;
    height: 60px;
    margin-bottom: 10px;
    position: relative;
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

      span {
        margin-left: 5px;
        font-size: 45px;
        text-align: center;
        vertical-align: middle;
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

      span {
        font-size: 12px;
      }
    }

    .layerpicker-controller {
      width: 15px;
      height: 100%;
      margin-right: 5px;
      position: absolute;
      right: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0.8;

      i {
      }
    }
  }

  .layerpicker-children {
    width: 70%;
    height: 40px;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    border: 1px solid #d7dde4;
    background-color: #fff;
    opacity: 0.8;
    cursor: pointer;

    .layerpicker-children-ele {
      width: 40px;
      min-width: 40px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        max-width: 30px;
        max-height: 30px;
        margin-left: 5px;
      }

      span {
        margin-left: 5px;
        font-size: 35px;
        text-align: center;
        vertical-align: middle;
      }
    }

    .layerpicker-children-info {
      width: 100%;
      height: 40px;
      padding-right: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .layerpicker-children-indicator {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        h4 {
          margin-left: 5px;
        }
      }
    }

    .layerpicker-children-controller {
      width: 15px;
      height: 40px;
      margin-right: 5px;
      position: absolute;
      right: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0.6;

      i {
      }
    }
  }
}
</style>

