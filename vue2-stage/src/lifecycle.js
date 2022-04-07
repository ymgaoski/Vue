import { patch } from "./vdom/patch";
import Watcher from "./observer/watcher";
import { nextTick } from "./utils";

export function lifecycleMixin(Vue){

  Vue.prototype._update = function(vnode){
    let vm = this;
    let preVnode = vm._vnode;
    if (!preVnode){
      // 初次渲染
      // 根据虚拟DOM替换真实DOM
      vm.$el = patch(vm.$el,vnode);
    }else{
      // 更新渲染,拿上次的旧节点和当前新节点比较
      vm.$el = patch(preVnode,vnode);
    }
    vm._vnode = vnode;
  }

  // 扩展nextTick
  Vue.prototype.$nextTick = nextTick;
}

// 挂载组件
export function mountComponent(vm,el){

  // 更新函数 数据变化后 会再次调用此函数
  let updateComponent = () => {
    // 调用render函数生成虚拟DOM
    let vnode = vm._render();
    // _update函数将虚拟DOM内容进行比较后，再更新到真实DOM中
    vm._update(vnode);
  }

  // 默认挂载
  // updateComponent();

  let watcher = new Watcher(vm,updateComponent,function(){
    console.log('视图更新了');
  },{user: false});

}

/**
 * 调用生命周期钩子回调
 * @param {Vue实例} vm 
 * @param {生命周期钩子名} key 
 */
export function callHook(vm,hook){

  let handlers = vm && vm.$options[hook];
  if (handlers){
    handlers.forEach(handler => {
      handler.call(vm);
    });
  }
}