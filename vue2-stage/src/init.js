import { initState } from "./state";
import { compileToFunction } from "./complier/index";
import { mountComponent,callHook } from "./lifecycle";
import { mergeOptions } from "./utils"

// 将init方法混入到 Vue中
export function initMixin(Vue){

  // 初始化
  Vue.prototype._init = function(options){
    // console.log(options,'init');
    
    let vm = this;
    // 缓存options，合并之前 Vue.mixin 混入的数据
    vm.$options = mergeOptions(vm.constructor.options,options);
    
    // console.log(this.$options,'options');

    // 调用生命周期的钩子
    callHook(vm,'beforeCreate');

    // 劫持属性 watch computed props data...
    initState(vm);

    // 调用生命周期的钩子
    callHook(vm,'created');

    // 页面挂载
    // HTML => AST对象 => 生成AST树结构 => render函数字符串 => 虚拟DOM => 生成真实DOM
    if (vm.$options.el){
      vm.$mount(vm.$options.el);
    }
  }

  // 挂载
  Vue.prototype.$mount = function(el){
    let vm = this;
    let options = vm.$options;
    el = document.querySelector(el);
    // 缓存 el
    vm.$el = el;
    // console.log(app,'app');

    if (!options.render){
      let template = options.template;
      if (!template && el){
        // 没有template，没有render,只配置了 el
        template = app.outerHTML;
      }

      // 模板 => render函数
      let render = compileToFunction(template);
      
      // 将渲染函数设置到vm的options上，方便后续操作
      options.render = render;

      //console.log(options.render,'options.render');
    }
    
    // 组件挂载流程
    mountComponent(vm,el);
  }
  
}