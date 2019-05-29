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
            <FormItem label="Duration:">
              <Slider
                v-model="elementSelected.marquee_duration"
                :step="0.5"
                :min="0.5"
                :max="10"
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
      type: Array,
      default: null
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
        this.$Message.warning("Marquee Cancel");
      } else if (this.elementSelected.marquee_pattern == "once") {
        this.$Message.success("Marquee Applied Once");
        this.marquee(this.elementSelected, 10, false);
      } else if (this.elementSelected.marquee_pattern == "loop") {
        this.$Message.success("Marquee Applied Loop");
        this.marquee(this.elementSelected, 10, true);
      } else {
        this.$Message.error("Marquee Error");
      }
    },
    marquee(ele, delay, loop) {
      ele.left = 1280;
      let timer = setInterval(() => {
        this.$nextTick(() => {
          if (ele.left <= -ele.width) {
            if (!loop) {
              clearInterval(timer);
              timer = null;
            } else {
              ele.left = 1280;
            }
          }
          ele.left--;
          this.animate = !this.animate;
        });
      }, delay);
    },
    playAnimate() {
      this.elementSelected.playing = true;
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

        .layer-container {
          width: 90%;
          margin-top: 10px;
          padding: 2px;
          overflow-y: auto;
        }

        .control {
          margin-right: 0;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .animation-container {
          width: 90%;
          margin-top: 10px;
          padding: 2px;
          overflow-y: auto;

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
</style>
