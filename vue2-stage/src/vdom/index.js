import {isReservedTag,isObject} from '../utils'

// 创建元素
export function createElement(vm,tag,data={},...children){

  // 判断是组件还是原生标签
  if (isReservedTag(tag)){
    // 原生标签
    return vnode(vm,tag,data,children,data.key,undefined);
  }else{
    // 组件
    // 获取组件构造函数 如：Sub
    const Ctor = vm.$options.components[tag];
    return createComponent(vm,tag,data,children,data.key,Ctor);
  }

}

// 创建文本元素
export function createTextElement(vm,text){
  
  return vnode(vm,undefined,undefined,undefined,undefined,text);
}

// 创建虚拟节点
function vnode(vm,tag,data,children,key,text,componentOptions){
  // 该节点可以扩展其它功能属性
  return {
    vm,tag,data,children,key,text,componentOptions
  }
}

// 创建组件虚拟节点
function createComponent(vm,tag,data,children,key,Ctor){
  // 组件的构造函数
  // 全局组件里面是对象，也需要转成函数
  if(isObject(Ctor)){
    // vm.$options._base = Vue
    Ctor = vm.$options._base.extend(Ctor); // Vue.extend
  }

  // 等会渲染组件时，需要调用该初始方法，也用于标识该虚拟节点是组件
  data.hook = {
    // init 方法作用：创建组件实例，并进行挂载
    init(vnode){
      let vm = vnode.componentInstance = new Ctor({_isComponent: true}) // new Sub 会用此选项和组件的配置进行合并
      console.log(vnode,'vnode component');
      // 手动挂载
      // 组件挂载完成后，会在 vm.$el => <button>
      vm.$mount(); 
    }
  }

  return vnode(vm,`vue-component-${tag}`,data,undefined,key,undefined,{Ctor,children});
}
