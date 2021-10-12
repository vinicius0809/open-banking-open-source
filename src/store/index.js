import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    participants: [],
    colorMap: [],
    participantsLoaded: false,
  },
  mutations: {
    updateState(state, obj) {
      state[obj.property] = obj.value;
    },
  },
  actions: {
    stopLoading(context) {
      context.commit("updateState", { property: "loading", value: false });
    },
    startLoading(context) {
      context.commit("updateState", { property: "loading", value: true });
    },
    setParticipants(context, participants) {
      context.commit("updateState", {
        property: "participants",
        value: participants,
      });
      context.commit("updateState", {
        property: "participantsLoaded",
        value: true,
      });
    },
    setColorMap(context, colorMap) {
      context.commit("updateState", { property: "colorMap", value: colorMap });
    },
  },
  modules: {},
});
