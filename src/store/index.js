import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false
  },
  mutations: {
    toggleLoading (state, value) {
      state.loading = value;
    }
  },
  actions: {
    stopLoading(context){
      context.commit("toggleLoading", false);
    },
    startLoading(context){
      context.commit("toggleLoading", true);
    },
    isLoading(){
      return this.state.loading;
    }
  },
  modules: {
  }
})
