// Watcher与Dep是多对多
// 一个组件就是一个 Watcher

import Dep from "./dep";
import { queueWatcher } from "./scheduler";

// 一个访问属性就是一个Dep，同组件同属性，只有一个Dep
let id = 0;
class Watcher{
  constructor(vm,exprOrFn,cb,options){
    this.id = id++;
    this.vm = vm;
    this.cb = cb;
    this.options = options;
    this.user = !!options.user; // 是否是用户自定义的Watcher !! 强转成bool
    this.lazy = !!options.lazy; // 是否懒加载，是计算属性才需要懒加载
    this.dirty = options.lazy; // 默认是懒加载，就是计算属性，默认就是脏的

    // 对应的 Dep列表
    this.deps = [];

    // 判断 exprOrFn是函数还是字符串
    if (typeof exprOrFn === 'string'){
      // 处理 a.b.c => a['b']['c'] 这种表达式
      // 表达式 转 函数
      this.getter = function(){
        let path = exprOrFn.split('.');
        let obj = vm;
        for(let i=0; i < path.length; i++){
          obj = obj[path[i]];
        }
        return obj;
      }
    }else{
      this.getter = exprOrFn;
    }

    // 默认初始化更新
    // 第一次的value
    this.value = this.lazy ? undefined : this.get();
  }

  // 准备更新组件
  get(){
    
    // 缓存当前watcher
    Dep.pushTarget(this)
    
    // 执行渲染与取值操作（回调），里面会进行收集依赖
    // 调用get需要重新设置this指向，不然里面属性某些情况可能取不到值，如：计算属性调的时候
    const value = this.getter.call(this.vm);

    // 清空当前watcher
    Dep.popTarget();

    return value;
  }

  // 更新组件
  update(){
    
    if (this.lazy){
      // lazy为true表示是计算属性Watcher
      // 只需要将 dirty 设置为 脏的，这样下次再去获取的时候就重新调用get
      this.dirty = true;
    }else{
      // 执行 重新渲染=>更新DOM 的回调
      // 防抖处理，异步更新，让多次修改只执行一次渲染
      queueWatcher(this);
    }
  }

  // 执行更新
  run(){

    const newVal = this.get();

    // 触发用户自定义 watch 的回调
    if (this.user){
      let oldVal = this.value;
      // 执行回调
      this.cb.call(this.vm,newVal,oldVal);
    }
    // 将当前新value变成旧value
    this.value = newVal;
  }

  // 添加Dep
  // 计算属性会用到（需要用计算属性对应的多个dep去收集渲染watcher，这样才能实现改变计算属性中的值，页面也能刷新）
  addDep(dep){
    if(this.deps.includes(dep)){
      //console.log('已存在该dep');
      return;
    }
    this.deps.push(dep);
  }

  // 执行get取值操作，重置dirty属性，并更新value 
  evaluate(){
    // 设置为不是脏的，说明，数据已经被缓存，下次获取不需要重新获取
    this.dirty = false;
    this.value = this.get();
  }

  // 收集渲染watcher
  depend(){

    // 如：firstName,lastName
    let i = this.deps.length;
    while(i--){
      // 此时的 Dep.target 是渲染watcher，当前的 watcher 为计算属性watcher
      // 让计算属性中的 dep（firstName，lastName） 再去收集 渲染watcher
      // 一个取值属性对应一个dep
      this.deps[i].depend();
    }
  }
}

export default Watcher;