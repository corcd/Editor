import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    elements: [],
    lastIndex: 1
  },
  mutations: {
    indexIncrement(state, n) {
      state.lastIndex = n;
    },
    addElements(state, obj) {
      state.elements.push(obj);
    },
    updateElements(state, arr) {
      state.elements = arr;
    }
  },
  actions: {
    // indexIncrement({ commit }, n) {
    //   commit("indexIncrement", n);
    // },
    addElements({ commit }, obj) {
      commit("addElements", obj);
    },
    updateElements({ commit }, arr) {
      commit("updateElements", arr);
    }
  }
});

export default store;
