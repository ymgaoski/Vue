
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

  const dep = new Dep();

  // 使用闭包特性返回|更新数据
  Object.defineProperty(obj,key,{
    get(){
      // console.log('get');

      // 添加当前watcher到dep中
      Dep.target && dep.addWatcher(Dep.target);
      return data;
    },
    set(newVal){
      // console.log(newVal,'set');

      // 值不一样时，触发通知
      if (newVal !== data){
        data = newVal;

        // 通知更新
        dep.notify(newVal);
      }
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



// 依赖收集，用于管理 某个key相关所有的watcher
// 一个key对应一个Dep
class Dep{
  constructor(){
    this.watchers = [];
  }

  // 增加观察者
  addWatcher(watcher){
    this.watchers.push(watcher);
  }

  // 通知所有观察者
  notify(data){
    this.watchers.forEach(item => {
      item.update(data);
    })
  }
}

// 观察者
class Watcher{
  constructor(vm,exp,fn){
    this.$vm = vm;
    this.exp = exp;
    this.fn = fn;

    // 缓存当前watcher到 Dep的静态变量中
    Dep.target = this;
    // 触发get,实现将 this 添加到 Dep中
    Compiler.getExpValue(this.$vm,exp);
    // 清空缓存
    Dep.target = null;
  }

  // 更新事件
  update(data){
    this.fn && this.fn(data);
  }
}
