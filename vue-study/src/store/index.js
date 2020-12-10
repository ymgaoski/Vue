import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state,num){
      state.count += num;
    }
  },
  actions: {
    add({commit,dispatch},num){
      // 模拟异步请求调用
      setTimeout(() => {
        commit('add',num);
      }, 1000);
    }
  },
  modules: {
  }
})
