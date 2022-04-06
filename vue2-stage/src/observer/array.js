// 使用面向切面编程，处理Array的原始方法

// 原始数组的原型对象
const oldArrayPrototype = Array.prototype;
// arrayMethods.__proto__ = Array.prototype 继承
export let arrayMethods = Object.create(oldArrayPrototype);

// 目前只有这7个方法会修改原数组数据
const methods = ['push','pop','shift','unshift','splice','reverse','sort'];

methods.forEach(method => {
  // 先调用自定义的方法
  arrayMethods[method] = function(...args){
    // 处理需要劫持的数据
    // 再调用原始数组的方法
    oldArrayPrototype[method].call(this,...args);

    // 添加到数组的对象也需要进行监控
    let inserted;
    switch(method){
      case 'push':
      case 'unshift':
        inserted = args; // 新增的内容
        break;
      case 'splice':
        inserted = args.slice(2); // splice 中的第2个参数后面的数据是新增数据
      default:
          break;
    }
    //　监控数组数据
    this.__obs__.observeArray(inserted);

    // 通知更新
    this.__obs__.dep.notify();
  }
})

