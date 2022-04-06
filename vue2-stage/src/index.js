import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import { stateMixin } from "./state";
import { initGlobalApi } from "./global-api/index.js"

function Vue(options){
  // 初始化
  this._init(options);
}

// 初始化方法混入 - 原型方法扩展
initMixin(Vue);
// 渲染相关扩展
renderMixin(Vue);
// 生命周期相关扩展
lifecycleMixin(Vue);
// 状态相关扩展
stateMixin(Vue);

// 全局API混入 - Vue状态方法
initGlobalApi(Vue);

export default Vue;

/**
 *  --- Vue数据流
 *  初始化Vue混入相关方法 -> 属性劫持（数组也会被劫持，重写了几个会修改数组数据的方法） -> get中依赖收集（dep收集watcher，watcher也会收集dep） 
 *     -> 属性更新  -> 触发劫持属性的回调  -> set中调用闭包dep的notity通知watcher更新  -> 将更新操作加入到队列中，下一次一起执行
 *  
 *  --- Vue模板编译
 *  获取需要挂载的元素 -> 通过正则获取token -> 转换成树结构数据(VNode) -> 再将树结构转换成 render 函数方法 -> 数据一更新只需要重新调用render函数即可
 * 
 *  --- Vue Watcher
 *  直接用的就是Vue中的 Watcher类，对数据进行劫持
 *  
 *  --- Vue Computed
 *  底层用的也是 watcher来实现监听劫持，另外加上了缓存功能，Computed底层就是一个 defineProperty
 *    1、缓存实现： 
 *        给watcher上添加了一个 dirty 是否为脏数据的标识（标识数据是否需要需要重新调用getter去获取），数据是缓存在watcher的value属性中
 * 
 *    2、Computed中的属性变化会重新渲染的实现：
 *        2.1、重置 dirty：
 *              在watcher的update函数中判断当前watcher如果是 计算属性watcher，那就只设置dirty为true，这样属性更新后，下次再获取值就能重新获取最新的值，但是还没解决更新渲染watcher，页面不会被刷新
 *              fullName不会收集渲染Watcher，因为它没有dep，没有收集功能，fullName是不能改的，只能获取
 *              fristName和lastName收集的是 计算属性Watcher,需要将fristName和lastName收集 渲染Watcher才行
 *        2.2、更新渲染watcher：
 *              让计算属性watcher中的dep也去收集渲染watcher
 *              步骤：
 *                  1、在Dep中需要将 pushTarget 保存在stack中，popTarget 的时候需要移除最上面的那个
 *                  2、先调用fullName的get就会将渲染watcher push到stack中，
 *                  3、然后调用这个get的时候又会去调用计算属性中的值，它又会去调用get，又将计算属性的watcher添加到statck中，此时stack中已经有了 渲染watcher 和 计算属性watcher
 *                  4、计算属性get调用完后，还需要判断 Dep.target是否还有值，还有值就说明该 target是对应的渲染watcher
 *                    4.1、然后再让计算属性watcher中的dep去收集 渲染watcher
 *                  5、此时计算属性中的dep就已经有了 渲染watcher和计算属性watcher两个watcher，只要值一改就能通过两个watcher，也能实现页面重新渲染
 *              
 *  --- 生命周期的实现
 *  在不同的时期，触发不同的回调
 *   Mixin对生命周期相关函数的混入会将函数保存到一个数组中，依次调用，和普通对象的混入有区另，普通对象是直接合并成一个对象，后面的属性会覆盖前面的属性
 *    Mixin混入流程:
 *     Vue.options = {}   => Vue.options = {beforeCreate:[fn1]}  =>  Vue.options = {beforeCreate:[fn1,fn2]}
 *     将所有的生命周期相关的函数保存到 Vue.options 中
 *     最后在处理 vm.$options （里面也会有定义的生命周期函数），将 Vue.opitons = [fn1,fn2] 与 vm.$options 再次合并 => Vue.opitons = [fn1,fn2,fn3]
 *     定义一个 callHook(Vue,key) 函数用于遍历调用指定的回调，key 为生命周期函数名（如：beforeCreate）
 *     在不同的位置分别调用 callHook 来实现生命周期函数的调用
 * 
 * 
 * 
 * --- 组件的实现
 * 
 * 1. 给组件创建一个构造函数（VueComponent类），继承于Vue
 * 2. 开始生成虚拟节点，对组件进行特殊处理，加上 data.hook = {init(){}} 标识是组件
 * 3. 生成真实dom元素，如果当前虚拟节点有 hook.init 属性，说明是组件
 * 4. 对组件进行 new 组件().$mount() 操作，会自动将dom元素挂载到 vm.$el 上
 * 5. 将组件的$el 插入到父容器中（父组件）
 * 
 * 组件渲染流程
 *  创建虚拟节点时： parent => child
 *  挂载到真实DOM时： child => parent
 *  
 */