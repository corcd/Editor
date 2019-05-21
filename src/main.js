import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuex from "vuex";
import VueSocketio from "vue-socket.io-extended";
import io from "socket.io-client";
import iView from "iview";
import axios from "axios";
import VueAxios from "vue-axios";
import Vcomp from "./components/index";

import "iview/dist/styles/iview.css";
import './assets/css/global.scss'

// Vuex
Vue.use(Vuex);
// Socket.io
Vue.use(VueSocketio, io("http://localhost:3006"));
// iView
Vue.use(iView);
// axios
Vue.use(VueAxios, axios);
// vcomp
Vue.use(Vcomp);

Vue.config.productionTip = false;


router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");