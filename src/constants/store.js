export default new Vuex.Store({
    state: {
      loading: false
    },
    mutations: {
      stopLoading (state) {
        state.loading = false;
      },
      startLoading(state){
        state.loading = true;
      }
    }
  })