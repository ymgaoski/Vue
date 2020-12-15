// 1、实现 Vuex 插件化
// 2、挂载$store
// 3、添加响应式 state
// 4、实现 commit、dispatch 方法

let Vue;
class Store{
    constructor(options){
        this.$opitons = options;
        this._mutations = options.mutations;
        this._actions = options.actions;
        
        console.log(options,'options');

        // 设置state数据为响应式的
        // 使用 $$ 符号,Vue不做代理,外面是不可访问的
        this._vm = new Vue({
            data: {
              $$state: options.state
            },
        })

        // 指定函数调用里面始终使用 绑定的this做为上下文
        // 解决下面commit在使用dispatch中调用时this指向问题
        this.commit = this.commit.bind(this);
        this.dispatch = this.dispatch.bind(this);
    }

    get state(){
      return this._vm._data.$$state;
    }

    set state(val){
      console.error('谁告诉你 state可以直接改的？');
    }

    // 用于mutations提交到state
    // type: mutation的类型
    // payload：载荷，是参数
    commit(type,payload){
        // 注：当外部使用dispatch中的commit调用的时候，此时的 this 将会为undifiend，所以需要做上面的this绑定
        console.log(this,'this commit');
        
        // 获取指定函数
        const entry = this._mutations[type];
        if (entry){
            entry(this.state,payload);
        }
    }

    // 用于actions提交到mutations
    // type: action的类型
    // payload：载荷，是参数
    dispatch(type,payload){
        // 获取指定函数
        const entry = this._actions[type];
        if (entry){
            entry(this,payload);
        }
    }
}

function install(_Vue){
    // 缓存Vue实例，是为了不使用 import Vue，那种会实得打包后代码很大，因为它引入了很多包
    Vue = _Vue;

    // 使用混入实现，根实例的$store 挂载
    Vue.mixin({
        beforeCreate(){

            // 判断是否是根实例，只有根实例的options才有store属性
            if(this.$options.store){
                Vue.prototype.$store = this.$options.store;
            }
        }
    })
}

export default {
    Store,
    install
}