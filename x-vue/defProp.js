
// 用于定义响应式属性
function defineReactive(obj,key,data){

  // 实现递归子属性
  observe(data);

  // 使用闭包特性返回|更新数据
  Object.defineProperty(obj,key,{
    get(){
      // console.log('get');
      return data;
    },
    set(newVal){
      // console.log(newVal,'set');
      data = newVal;

      update(key,newVal);
    }
  });
}

// 将指定对象的属性设置为响应式
function observe(obj){

  if (typeof obj !== 'object' || obj == null){
    // 只能对象处理
    return;
  }

  Object.keys(obj).forEach(key => {
    // 定义响应式属性
    defineReactive(obj,key,obj[key]);
  })
}

// 更新函数
function update(key,val){
  console.log(key + '已更新，val:' + val);
}


// 6大数组操作函数： push,pop,shift,unshift,splice,slice
// 实现数组响应式，缓存原型方法
Array.prototype.xpush = Array.prototype.push;
// 重写原型方法
Array.prototype.push = function(val){
  // 先调用旧的原型方法
  this.xpush(val);
  console.log(val,'push');

  // 调用更新函数
  update(this,val);
}

// 定义对象
const dataObj = { name: 'foo', bar: 'bar', baz: { a: 1 }, arr: [1,2,3] }
// 设置对象为响应式属性
observe(dataObj)

console.log(dataObj.name);

dataObj.name = 'qiang';

dataObj.baz.a = 360;

// 数组操作是不具备响应式的，实现思路：重写数组6大操作函数，在原生函数执行完后再执行我们的钩子，然后通知外面
dataObj.arr.push(4);

console.log(dataObj.arr,'arr');
