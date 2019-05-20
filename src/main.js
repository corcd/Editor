import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuex from "vuex";
import VueSocketio from "vue-socket.io-extended";
import io from "socket.io-client";
import axios from "axios";
import VueAxios from "vue-axios";

// Vuex
Vue.use(Vuex);
// Socket.io
Vue.use(VueSocketio, io("http://localhost:3006"));
// axios
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
