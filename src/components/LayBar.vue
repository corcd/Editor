<template>
  <div class="laybar">
    <Tabs size="small">
      <TabPane label="Layer">
        <div class="container">
          <LayerPicker
            v-for="element in sortEles"
            :key="element.id"
            :element="element"
            :elementSelected="elementSelected"
            @getElementSelected="getElementSelected"
            @clearElementSelected="clearElementSelected"
            @delElementSelected="delElementSelected"
          ></LayerPicker>
          <div class="control">
            <Affix :offset-bottom="40">
              <ButtonGroup>
                <Button type="primary" @click="indexUpward">
                  <Icon type="ios-arrow-up"/>Up
                </Button>
                <Button type="primary" @click="indexDownward">
                  Down
                  <Icon type="ios-arrow-down"/>
                </Button>
              </ButtonGroup>
            </Affix>
          </div>
        </div>
      </TabPane>
      <TabPane label="Layout">场景</TabPane>
      <TabPane label="Animation">动画窗格</TabPane>
    </Tabs>
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
    delElementSelected(ele) {
      this.$emit("delElementSelected", ele);
    },
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
  width: 220px;
  min-width: 220px;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-left: 1px solid #d7dde4;
  background: #fff;
  position: relative;

  .ivu-tabs {
    width: 100%;
    height: 100%;

    .ivu-tabs-bar {
      width: 100%;
    }

    .ivu-tabs-content {
      width: 100%;
      height: 100%;

      .ivu-tabs-tabpane {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .container {
          width: 90%;
          margin-top: 10px;
          overflow-y: auto;
        }

        .control {
          margin-right: 0;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
