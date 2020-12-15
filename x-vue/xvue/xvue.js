
class XVue{
  constructor(options){
    this.$options = options;
    this.$data = options.data;

    // 添加响应式数据
    observe(this.$data);

    // 创建代理，将 data属性挂载到 this 上，方便外面直接使用vue实例能直接访问
    this.proxy(this,this.$data);

    // 创建编译器
    new Compiler(options.el,this);
  }

  // 代理
  proxy(vm,data){

    Object.keys(data).forEach(key => {
      Object.defineProperty(vm,key,{
        get(){
          return vm.$data[key];
        },
        set(val){
          vm.$data[key] = val;
        }
      })
    })
    // console.log(vm,'vm');
  }

}

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

      // update(key,newVal);
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
