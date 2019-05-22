import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import Vuex from "vuex";
import VueSocketio from "vue-socket.io-extended";
import io from "socket.io-client";
import iView from "iview";
import Axios from "axios";
import Vcomp from "./components/index";

import "iview/dist/styles/iview.css";
import "./assets/css/global.scss";

// Vuex
Vue.use(Vuex);
// Socket.io
Vue.use(VueSocketio, io("http://139.196.92.199:3006"));
// iView
Vue.use(iView);
// vcomp
Vue.use(Vcomp);

Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  Axios.get("data.json")
    .then(response => {
      let res = JSON.parse(JSON.stringify(response));
      if (res.status == 200) {
        console.log(res.data);
        store.state.elements = [];
        store.state.elements.push(...res.data.elements);
        store.state.lastIndex = res.data.lastIndex;
      }
      next();
    })
    .catch(err => {
      console.log(err.message);
    });
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
