import { isObject } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer{
  
  constructor(data){
    // 用于数组操作时能够使用Dep去通知更新，下面还得收集watcher
    this.dep = new Dep();

    // 将当前Observe缓存到 data 中
    Object.defineProperty(data,'__obs__',{
      value: this,
      enumerable: false // 不可枚举
    })
    
    if (Array.isArray(data)){
      // 数组处理
      // arrayMethods 是做了原型方法覆盖的原型对象
      data.__proto__ = arrayMethods;

      // 如果数组中的数据也是对象，也需要监控对象的变化
      this.observeArray(data);
    }else{
      this.week(data);
    }
  }


  // 监控数组中的对象
  observeArray(data){

    data.forEach(item => {
      observe(item);
    })
  }

  // 引用劫持
  week(data){

    // 遍历属性，进行劫持
    Object.keys(data).forEach(key => {
      
      // 定义属性
      definePropertive(data,key,data[key]);
    })
  }
}

// 数组依赖收集
function dependArray(array){
  for(let i=0; i<array.length; i ++){
    let cur = array[i];
    // 通过数组中的__obs__再找到dep进行收集
    cur.__obs__ && cur.__obs__.dep.depend();
    
    // 如果还是数组，递归收集
    if (Array.isArray(cur)){
      dependArray(cur);
    }
  }
}

// 定义属性
function definePropertive(data,key,value){
  
  // 如果属性也是对象，需要递归去劫持
  let childObs = observe(value);
  
  // 闭包实现后面的通知更新
  let dep  = new Dep();

  // 注意 get 和 set 的值，如果返回或设置 data 中的会造成死循环
  Object.defineProperty(data,key,{
    get(){
      
      // console.log(dep,key,'dep');

      // 依赖收集,取值时将 watcher与dep对应起来
      if (Dep.target){
        //console.log(dep,'dep');
        dep.depend();  // 将dep记住watcher

        if (childObs){ // 可能是数组，也可能是对象，对象也需要收集watcher，后续 $set 也会用到
          // 让数组中的对象也去收集
          childObs.dep.depend();

          if (Array.isArray(value)){ // 如果value也是数组，[[1,2,3],[4,5,6]]
            // 对数组里面的数组 也需要收集
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newVal){
      // 更新数据
      if (value !== newVal){
        value = newVal;

        // 通知更新，函数内引用函数外的参数，会形成闭包，外面变量不会被销毁
        dep.notify();
      }
    }
  })
}

export function observe(data){
  
  // 对象才观测
  if (!isObject(data)){
    return;
  }
  
  if (data.__obs__){
    // 已经被观测过了
    return data.__obs__;
  }

  return new Observer(data);
}