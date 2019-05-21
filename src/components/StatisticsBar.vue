<template>
  <div class="statisticsbar">
    <span class="time">{{nowTime}}</span>
    <span class="type">{{elementSelected.type}}</span>
  </div>
</template>

<script>
export default {
  name: "StatisticsBar",
  props: {
    elementSelected: Object
  },
  data() {
    return {
      nowTime: "",
      timer: null
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
  }
};
</script>

<style lang="scss" scoped>
.statisticsbar {
  width: 100%;
  height: 20px;
  background: #515a6e;
  display: flex;
  align-items: center;
  position: relative;

  .time {
    position: absolute;
    left: 20px;
    color: #fff;
  }

  .type {
    position: absolute;
    right: 20px;
    color: #fff;
  }
}
</style>
