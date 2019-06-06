import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Stage from "./views/Stage.vue";
import Preview from "./views/Preview.vue";
import Error from "./views/Error.vue";
import Mini from "./views/Mini.vue";
import Inside from "./views/Inside.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: "Editor"
      }
    },
    {
      path: "/stage",
      name: "stage",
      component: Stage,
      meta: {
        title: "Stage"
      }
    },
    {
      path: "/preview",
      name: "preview",
      component: Preview,
      meta: {
        title: "Preview"
      }
    },
    {
      path: "/error",
      name: "error",
      component: Error,
      meta: {
        title: "Error"
      }
    },
    {
      path: "/mini",
      name: "mini",
      component: Mini,
      meta: {
        title: "Mini"
      }
    },
    {
      path: "/inside",
      name: "inside",
      component: Inside,
      meta: {
        title: "Inside"
      }
    }
  ]
});
