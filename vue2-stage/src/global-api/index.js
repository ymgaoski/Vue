import {mergeOptions} from '../utils' 

/**
 * 初始化全局API
 */
export function initGlobalApi(Vue){
  Vue.options = {};

  // 混入
  Vue.mixin = function(options){

    // 合并options
    this.options = mergeOptions(this.options,options);
  }



  // 全局组件
  Vue.options._base = Vue;  // 无论后面创建多少个子类，都可以通过_base找到Vue大类
  Vue.options.components = {};

  Vue.component = function(id,definition){
     // 保证组件隔离，每个组件都创建一个新类，并去继承父类
     // this.options = Vue
     definition = this.options._base.extend(definition);
     // 保存组件映射关系
     this.options.components[id] = definition;
  }

  // 继承并创建新类
  Vue.extend = function(opts){
    // this = Vue
    const Super = this;
    const Sub = function VueComponent(options){
      this._init(options);
    }
    
    // Sub继承Vue
    Sub.prototype =  Object.create(Super.prototype);
    // 修复子类构造函数，默认是指向父类的
    Sub.prototype.constructor = Sub; 
    // 将Vue中的options与组件中的options合并
    Sub.options = mergeOptions(Super.options,opts);
    return Sub;
  }

}