
// 是否是对象
export  function isObject(val){
  return typeof val === 'object' && val !== null;
}

// 是否是函数
export function isFunction(val){
  return typeof val === 'function';
}



// 刷新列队并执行
function flushCallBacks(){
  // 执行
  callbacks.forEach((cb) => cb());
  // 清空队列
  callbacks = [];
  // 重置执行状态
  running = false;
}

// 浏览器渲染后再处理
// 兼容性处理，优化 setTimeout
function timer(execFn){

  if(Promise){ // 支持Promise，微任务
    Promise.resolve().then(() => {
      // console.log('使用 Promise');
      execFn();
    })
  }else if(MutationObserver){  // 支持MutationObserver，微任务
    // console.log('使用 MutationObserver');
    let textNode = document.createTextNode('1');
    // 创建监听对象，并设置回调
    let obs = new MutationObserver(execFn);
    // 监听DOM
    // characterData: 监控文本内容
    obs.observe(textNode,{
      characterData: true
    });

    // 更新DOM
    textNode.textContent = '2';
  // @ts-ignore
  }else if(typeof setImmediate === 'function') {  // 稍微比setTimeout性能好些，不是微任务，只支持IE
    // console.log('使用 setImmediate');
    // @ts-ignore
    setImmediate(execFn);
  }else{ // 实在不行再用 setTimeout
    setTimeout(() => {
      // console.log('使用 setTimeout');
      execFn();
    }, 0);
  }
}

// 数据UI更新完后的回调
let callbacks = []; // 回调队列
let running = false;  // 是否正在执行中
export function nextTick(cb){
  
  // 加入队列
  callbacks.push(cb);
  
  // 防抖，批处理
  if(!running){
    running = true;

    timer(flushCallBacks);
  }
}



// 使用策略模式解决多个 if else
let lifecycleHooks = [
  "beforeCreate",
  "created",
  "beforeUpdate",
  "updated",
  "beforeMounte",
  "mounted",
  "beforeDestroy",
  "destroyed"
]

function mergeHook(parentVal,childVal){
  if (childVal){
    if (parentVal){
      // 父类有值，后续的执行,此时aprentVal肯定是数组
      return parentVal.concat(childVal);
    }else{
      // 父类没值，默认第一次
      return [childVal];
    }
  }else{
    // 子类没值，就直接用父类的
    return parentVal;
  }
}

// 存放各种策略
let strats = {};
lifecycleHooks.forEach(hook => {
  strats[hook] = mergeHook;
})

// 处理组件合并策略
strats.components = function(parentVal,childVal){

  // 根据父类对象创建一个新对象
  let options = Object.create(parentVal);
  if (childVal){
    // 拷贝值，不能直接继承新的，会改原始对象，所以将新对象的值拷贝到旧对象中
    for (const key in childVal) {
      options[key] = childVal[key];
    }
  }
  return options;
}

/**
 * 合并Options
 * @param {父数据} parent 
 * @param {子数据} child 
 */
export function mergeOptions(parent,child){
  let options = {}; // 合并后的结果

  for(let key in parent){
    mergeField(key);
  }

  for(let key in child){
    if (parent.hasOwnProperty(key)){
      // 父类，子类都有，不需要处理，上面已经处理过
      continue;
    }

    // 父类没有，子类有,再次合并
    mergeField(key);
  }

  function mergeField(key){
    let parentVal = parent[key];
    let childVal = child[key];

    // 策略模式的判断
    if(strats[key]){
      // 生命周期函数
      options[key] = strats[key](parentVal,childVal);
    }else{
      if (isObject(parentVal) && isObject(childVal)){
        // 两边都是对象，进行对象合并
        options[key] = {...parentVal,...childVal};
      }else{
        // 普通函数、父类没有子类有，直接子类覆盖父类
        // 或者 父类有，子类没有
        options[key] = child[key] || parent[key]; 
      }
    }
    
  }

  return options;
}

// 判断标签名是否是原生标签
export function isReservedTag(tag){
  let reservedTag = 'a,div,span,p,img,button,ul,li,ol,storng,textarea,input,select,option,link,video,pre,font';
  return reservedTag.split(',').includes(tag);
}