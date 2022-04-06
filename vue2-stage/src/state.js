import {isFunction,isObject} from './utils'
import { observe } from './observer/index';
import Watcher from './observer/watcher';
import Dep from './observer/dep'

export function stateMixin(Vue){

  Vue.prototype.$watch = function(key,handler,options = {}){
    // 表示为用户自定义的Watcher
    options.user = true;
    let value = new Watcher(this,key,handler,options);

    // 立刻执行回调
    if (options.immediate){
      handler.call(this,value);
    }
  }
}

// 初始化状态，劫持属性
export function initState(vm){
  const opts = vm.$options;
  // 属性劫持
  if (opts.data){
    initData(vm);
  }

  // 初始化watch
  if (opts.watch){
    initWatch(vm,opts.watch);
  }

  // 初始化computed
  if (opts.computed){
    initComputed(vm,opts.computed);
  }
}

// 初始化数据属性
function initData(vm){
  let data = vm._data =  vm.$options.data;
   
  // 如果data是函数
  if (isFunction(data)){
    data = data.call(vm);
  }

  // 属性代理  vm.xxx => vm._data.xxx
  for(let key in data){
    proxy(vm,'_data',key);
  }

  // 属性劫持
  observe(data);
}

// 属性代理
function proxy(vm,source,key){

  Object.defineProperty(vm,key,{
    get(){
      return vm[source][key];
    },
    set(val){
      vm[source][key] = val;
    }
  })

}

// 初始化watch
function initWatch(vm,watch){
  for(let key in watch){
    let handle = watch[key];
    if (Array.isArray(handle)){
      handle.forEach(fn => {
        createWatcher(vm,key,fn);
      })
    }else{
      createWatcher(vm,key,handle);
    }
  }
}

// 创建 Watcher
function createWatcher(vm,key,handler){
  vm.$watch(key,handler);
}

// 初始化计算属性
function initComputed(vm,computed){

  // 将watcher挂载到vm上,里面包含所有的计算属性
  let watchers = vm._computedWatchers = {};

  for (const key in computed) {
    let getter;
    if(typeof computed[key] === 'function'){
      getter = computed[key];
    }else{
      getter = computed[key].get;
    }

    // 创建Watcher，lazy为懒加载，默认不执行get,本质上每一个计算属性就是一个 Watcher
    // 将watcher与属性做一个映射，下面computedGetter中会用到，用于判断是否是脏数据
    watchers[key] = new Watcher(vm,getter,()=>{},{lazy:true})

    // 定义计算属性,将key挂载到vm上
    defineComputed(vm,key,getter);
  }
}

// 定义计算属性
function defineComputed(vm,key,userDef){
  let sharedProperty = {};
  if(typeof userDef === 'function'){
    sharedProperty.get = createComputedGetter(key);
  }else{
    sharedProperty.get = createComputedGetter(key);
    sharedProperty.set = userDef.set;
  }

  // 将key挂载到vm上
  // computed 就是一个 defineProperty
  Object.defineProperty(vm,key,sharedProperty);
}

// 创建高阶函数（函数返回函数）用于包装 get方法
function createComputedGetter(key){
  // 使用了闭包，子函数里用到了外部的变量
  return function computedGetter(){

    let watcher = this._computedWatchers[key];
    if (watcher.dirty){
      // 脏的，需要重新获取,里面重新获取后，会将值更新到 value 中
      watcher.evaluate();
    }else{
      // 不脏，不需要重新获取，直接返回watcher中缓存的值
    }
    
    // 如果Dep.target还有值，那就是对应的 渲染watcher
    if (Dep.target){
      // console.log(Dep.target,'Dep.target');
      // 此时的watcher为计算属性watcher，需要让该watcher里面的dep也去收集 Dep.target 这个渲染watcher
      // 收集完后，只要该属性一改也能对应的通知渲染watcher去更新页面
      watcher.depend();
    }
    return watcher.value;
  }
}