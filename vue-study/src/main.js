import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import router from './grouter'
import store from './store'
// 通知插件
import NoticePlugin from './plugins/noticePlugin'

Vue.config.productionTip = false

// 使用插件
Vue.use(NoticePlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

