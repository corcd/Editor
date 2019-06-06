<template>
  <div class="laybar">
    <Tabs size="small">
      <TabPane label="Layer">
        <div class="layer-container">
          <LayerPicker
            v-for="element in sortEles"
            :key="element.id"
            :element="element"
            :elementSelected="elementSelected"
            @getElementSelected="getElementSelected"
            @clearElementSelected="clearElementSelected"
            @delElementSelected="delElementSelected"
          ></LayerPicker>
        </div>
        <!-- <div class="layer-control">
          <ButtonGroup>
            <Button type="primary" @click="indexUpward">
              <Icon type="ios-arrow-up"/>Up
            </Button>
            <Button type="primary" @click="indexDownward">
              Down
              <Icon type="ios-arrow-down"/>
            </Button>
          </ButtonGroup>
        </div>-->
      </TabPane>
      <TabPane label="Layout">
        <div class="layout-container">
          <Button type="primary" style="width: 90%">Custom</Button>
          <Divider>Default</Divider>
          <Divider orientation="left" style="font-size: 12px; color:#878E9B">Title Bar</Divider>
          <LayoutPicker
            :imgSrc="'http://prvz33yaw.bkt.clouddn.com/images-oss_title_1.png'"
            :title="'预设标题样式 1'"
            :type="'default_1'"
            @elementAdd="elementAdd"
          ></LayoutPicker>
          <LayoutPicker
            :imgSrc="'http://prvz33yaw.bkt.clouddn.com/images-oss_title_2.png'"
            :adaptivePreview="true"
            :title="'预设标题样式 2'"
            :type="'default_2'"
            @elementAdd="elementAdd"
          ></LayoutPicker>
          <LayoutPicker
            :imgSrc="'http://prvz33yaw.bkt.clouddn.com/images-oss_title_3.png'"
            :title="'预设标题样式 3'"
            :type="'default_3'"
            @elementAdd="elementAdd"
          ></LayoutPicker>
          <Divider orientation="left" style="font-size: 12px; color:#878E9B">Score Panel</Divider>
          <LayoutPicker
            :imgSrc="'http://prvz33yaw.bkt.clouddn.com/images-oss_1559528456000.png'"
            :title="'预设比分样式 1'"
            :type="'default_4'"
            @elementAdd="elementAdd"
          ></LayoutPicker>
          <Divider>Custom</Divider>
        </div>
      </TabPane>
      <TabPane label="Animation">
        <div class="animation-container">
          <Form :label-width="60">
            <FormItem label="Animation:">
              <Select v-model="elementSelected.animation" placeholder="animate.css">
                <Option
                  v-for="item in animateList"
                  :key="item"
                  :label="item"
                  :value="item"
                  clearable
                ></Option>
              </Select>
            </FormItem>
            <FormItem label="Animate:">
              <Button style="width: 100%" @click="playAnimate">Play</Button>
            </FormItem>
            <FormItem label="Loop:">
              <i-switch size="large" v-model="elementSelected.loop">
                <span slot="open">ON</span>
                <span slot="close">OFF</span>
              </i-switch>
            </FormItem>
            <FormItem label="Duration:">
              <Slider
                v-model="elementSelected.duration"
                :step="0.1"
                :min="0.1"
                :max="10"
                show-input
              ></Slider>
            </FormItem>
            <FormItem label="Delay:">
              <Slider v-model="elementSelected.delay" :step="0.1" :min="0" :max="10"></Slider>
            </FormItem>
            <Divider>Marquee</Divider>
            <FormItem label="Pattern:">
              <RadioGroup
                v-model="elementSelected.marquee_pattern"
                @on-change="changeMarquee"
                vertical
              >
                <Radio label="normal"></Radio>
                <Radio label="once"></Radio>
                <Radio label="loop"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              label="Duration:"
              v-show="elementSelected.marquee_pattern == 'once' || elementSelected.marquee_pattern == 'loop'"
            >
              <Slider
                v-model="elementSelected.marquee_duration"
                :step="1"
                :min="1"
                :max="20"
                show-input
              ></Slider>
            </FormItem>
          </Form>
        </div>
      </TabPane>
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
      type: Array
    },
    elementSelected: Object
  },
  data() {
    return {
      selected: false,
      videoMag: 1,
      animateList: [
        "bounce",
        "flash",
        "pulse",
        "rubberBand",
        "shake",
        "swing",
        "tada",
        "wobble",
        "jello",
        "bounceIn",
        "bounceInDown",
        "bounceInLeft",
        "bounceInRight",
        "bounceInUp",
        "bounceOut",
        "bounceOutDown",
        "bounceOutLeft",
        "bounceOutRight",
        "bounceOutUp",
        "fadeIn",
        "fadeInDown",
        "fadeInDownBig",
        "fadeInLeft",
        "fadeInLeftBig",
        "fadeInRight",
        "fadeInRightBig",
        "fadeInUp",
        "fadeInUpBig",
        "fadeOut",
        "fadeOutDown",
        "fadeOutDownBig",
        "fadeOutLeft",
        "fadeOutLeftBig",
        "fadeOutRight",
        "fadeOutRightBig",
        "fadeOutUp",
        "fadeOutUpBig",
        "flip",
        "flipInX",
        "flipInY",
        "flipOutX",
        "flipOutY",
        "lightSpeedIn",
        "lightSpeedOut",
        "rotateIn",
        "rotateInDownLeft",
        "rotateInDownRight",
        "rotateInUpLeft",
        "rotateInUpRight",
        "rotateOut",
        "rotateOutDownLeft",
        "rotateOutDownRight",
        "rotateOutUpLeft",
        "rotateOutUpRight",
        "slideInUp",
        "slideInDown",
        "slideInLeft",
        "slideInRight",
        "slideOutUp",
        "slideOutDown",
        "slideOutLeft",
        "slideOutRight",
        "zoomIn",
        "zoomInDown",
        "zoomInLeft",
        "zoomInRight",
        "zoomInUp",
        "zoomOut",
        "zoomOutDown",
        "zoomOutLeft",
        "zoomOutRight",
        "zoomOutUp",
        "hinge",
        "rollIn",
        "rollOut"
      ]
    };
  },
  computed: {
    sortEles: function() {
      return sortByKey(this.elements, "index");
    }
  },
  methods: {
    changeMarquee() {
      if (this.elementSelected.marquee_pattern == "normal") {
        //this.$Message.warning("Marquee Cancel");
      } else if (this.elementSelected.marquee_pattern == "once") {
        this.$Message.success("Marquee Applied Once");
        //this.marquee(this.elementSelected, 10, false);
      } else if (this.elementSelected.marquee_pattern == "loop") {
        this.$Message.success("Marquee Applied Loop");
        //this.marquee(this.elementSelected, 10, true);
      } else {
        this.$Message.error("Marquee Error");
      }
    },
    playAnimate() {
      this.elementSelected.playing = true;
    },
    elementAdd(param, type) {
      this.$emit("elementAdd", param, type);
    },
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

  .ivu-tabs,
  .ivu-tabs-mini {
    width: 100%;
    height: 100%;

    // .ivu-tabs-bar[style] {
    //   width: 100%;
    //   margin-bottom: 10px !important;
    // }

    .ivu-tabs-content,
    .ivu-tabs-content-animated {
      width: 100%;
      max-height: 100%;
      //overflow-y: auto;

      .ivu-tabs-tabpane {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;

        .layer-container {
          width: 90%;
          max-height: 80vh;
          margin-top: 0px;
          padding: 2px;
          //padding-bottom: 150px;
          overflow-x: hidden;
          overflow-y: scroll;

          &::-webkit-scrollbar {
            display: none;
          }
        }

        .layer-control {
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .layout-container {
          width: 90%;
          margin-top: 0px;
          overflow-y: auto;
        }

        .animation-container {
          width: 90%;
          margin-top: 10px;
          padding: 2px;
          overflow-y: auto;

          form {
            width: 100%;

            .ivu-radio-group {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
            }
          }
        }
      }
    }
  }
}
</style>
