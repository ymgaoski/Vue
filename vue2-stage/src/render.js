import { createElement, createTextElement } from "./vdom/index";

export function renderMixin(Vue){
  
  // 创建元素
  Vue.prototype._c = function(tag,data,...children){
    return createElement(this,...arguments);
  }
  // 创建文本
  Vue.prototype._v = function(text){
    return createTextElement(this,text);
  }
  // 变量模板
  Vue.prototype._s = function(data){
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data);
    }else{
      return data;
    }
  }

  // 渲染
  Vue.prototype._render = function(){
    let vm = this;
    let render = vm.$options.render;
    // 执行渲染函数
    let vnode = render.call(vm);
    // console.log(vnode,'vnode');
    // console.log('执行了渲染');
    return vnode;
  }
}
