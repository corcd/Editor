<template>
  <div class="error">
    <h1>Error</h1>
    <div class="divider"></div>
    <span>{{errorMsg}}</span>
  </div>
</template>

<script>
export default {
  name: "error",
  data() {
    return {
      errorMsg: "Error"
    };
  },
  mounted() {
    this.errorMsg = this.$route.query.msg;
  }
};
</script>

<style lang="scss" scoped>
.error {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
  color: #7d828f;

h1{
    font: 78px bold solid;
    color: #7d828f;
}

.divider {
    display: none;
    width: 90%;
    margin: 20px;
    border: 1px rgb(70, 69, 69) solid;
    transform: scaleY(0.2);
}

  span {
    font: 32px bold;
    color: #7d828f;
  }
}
</style>
