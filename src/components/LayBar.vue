<template>
  <div class="laybar">
    <div class="container">
      <Divider>Layer</Divider>
      <LayerPicker
        v-for="element in sortEles"
        :key="element.id"
        :element="element"
        :elementSelected="elementSelected"
        @getElementSelected="getElementSelected"
        @clearElementSelected="clearElementSelected"
      ></LayerPicker>
    </div>
    <div class="control">
      <ButtonGroup>
        <Button type="primary" @click="indexUpward">
          <Icon type="ios-arrow-up"/>Up
        </Button>
        <Button type="primary" @click="indexDownward">
          Down
          <Icon type="ios-arrow-down"/>
        </Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<script>
//数组对象方法倒序排序
function sortByKey(array, key) {
  return array.sort((a, b) => {
    let x = a[key];
    let y = b[key];
    return x > y ? -1 : x < y ? 1 : 0;
  });
}

export default {
  name: "LayBar",
  props: {
    elements: {
      type: Array,
      default: null
    },
    elementSelected: Object
  },
  data() {
    return {
      selected: false,
      videoMag: 1
    };
  },
  computed: {
    sortEles: function() {
      return sortByKey(this.elements, "index");
    }
  },
  methods: {
    getElementSelected(ele) {
      this.$emit("getElementSelected", ele);
    },
    clearElementSelected() {
      this.$emit("clearElementSelected");
    },
    indexUpward() {
      let ele = this.elementSelected;
      if (ele.index >= 1) ele.index++;
    },
    indexDownward() {
      let ele = this.elementSelected;
      if (ele.index > 1) ele.index--;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.laybar {
  min-width: 180px;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-left: 1px solid #d7dde4;
  background: #fff;
  position: relative;

  .container {
    width: 90%;
    margin-top: 10px;
  }

  .control {
    width: 90%;
    position: absolute;
    bottom: 20px;
  }
}
</style>
