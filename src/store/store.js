import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {
    indexIncrement(state, obj) {
      state[obj.id].lastIndex = obj.index;
    },
    addElements(state, obj) {
      state[obj.id].elements.push(obj);
    },
    updateElements(state, obj) {
      state[obj.id].elements = obj.eles;
    },
    createNode(state, obj) {
      Vue.set(state, obj.id, {
        elements: [],
        lastIndex: 1
      });
    }
  },
  actions: {
    indexIncrement({ commit }, obj) {
      commit("indexIncrement", obj);
    },
    addElements({ commit }, obj) {
      commit("addElements", obj);
    },
    updateElements({ commit }, obj) {
      commit("updateElements", obj);
    },
    createNode({ commit }, obj) {
      commit("createNode", obj);
    }
  }
});

export default store;
