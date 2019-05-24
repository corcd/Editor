<template>
  <div class="statisticsbar">
    <span class="time">{{nowTime}}</span>
    <div class="scaleBar">
      <span>Scale: {{valueScale}}%</span>
      <Slider class="scaleSlider" :min="1" v-model="valueScale" @on-input="changeScaleValue"></Slider>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatisticsBar",
  props: {
    zoom: Number,
    elementSelected: Object
  },
  data() {
    return {
      nowTime: "",
      timer: null,
      valueScale: 100
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getNowFormatDate();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    changeScaleValue() {
      //console.log(this.valueScale / 100.0);
      this.$emit("changeScaleValue", (this.valueScale / 100.0));
    },
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      this.nowTime = currentdate;
    }
  },
  watch: {
    zoom: {
      handler(newValue, oldValue) {
        if (newValue != oldValue) this.valueScale = this.zoom * 100;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.statisticsbar {
  width: 100%;
  height: 30px;
  background: #515a6e;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 9999;

  .time {
    position: absolute;
    left: 10px;
    font: 14px bold;
    color: #fff;
  }

  .scaleBar {
    min-width: 200px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 20px;

    span {
      font: 14px bold;
      color: #fff;
    }

    .scaleSlider {
      width: 100px;
      margin-left: 5px;
      position: absolute;
      right: 0;
    }
  }
}
</style>
