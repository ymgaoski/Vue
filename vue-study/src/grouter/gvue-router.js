import RouterLink from './grouter-link'
import RouterView from './grouter-view'

let Vue;

class GVueRouter{
  constructor(options){
    // 缓存options
    this.$options = options;

    // 设置响应式数据current属性,默认为 / 
    // current 表示当前路由路径
    Vue.util.defineReactive(this,'current','/');

    // 监听浏览器hash值变更
    window.addEventListener('hashchange',onHashCahnge.bind(this));
    window.addEventListener('load',onHashCahnge.bind(this));

    // 缓存路由表配置
    this.routerMap = {};
    options.routes.forEach(route => {
      this.routerMap[route.path] = route;
    })
    console.log(this.routerMap,'routerMap');
  }
}

// 浏览器hash值改变事件 
function onHashCahnge(e){

  console.log(window.location,'onHashCahnge');

  // 去掉第一个#号,更新 current
  if (window.location.hash){
    this.current = window.location.hash.slice(1);
  }
}

GVueRouter.install = function(_Vue){
  // 缓存Vue实例是因为如果使用 import Vue 就会引入很多模块,打包后文件会变的很大
  Vue = _Vue;

  // 挂载 $router (获取根实例中的router选项)
  Vue.mixin({
    beforeCreate() {

      // 判断是否是在根实例中,只有根实例的options中才有 router属性
      if (this.$options.router){
        // 在mxins中可以获取到Vue的实例对象
        // 注意: this.$options.router 取的是外面 Vue 创建时存入进入的 router 而不是当前 GVueRouter 的$options
        Vue.prototype.$router = this.$options.router;
      }
    }
  })

  // 注册组件
  Vue.component('router-link',RouterLink);
  Vue.component('router-view',RouterView);
}


export default GVueRouter;