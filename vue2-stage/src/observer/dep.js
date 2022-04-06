// Watcher与Dep是多对多
// 一个组件就是一个 Watcher
// 一个访问属性就是一个Dep，同组件同属性，只有一个Dep

let id = 0;
class Dep{
  constructor(){
    this.id = id++;
    // 对应的 watcher列表
    this.subs = [];
    this.watcherIds = [];
  }

  // 依赖收集
  depend(){
    if (Dep.target){
      // 判断是否收集过
      if (this.watcherIds.indexOf(Dep.target.id) === -1){
        this.watcherIds.push(Dep.target.id);
        // 收集watcher
        this.subs.push(Dep.target);
        // 让watcher关联Dep
        Dep.target.addDep(this);
      }else{
        // console.log('收集过了');
      }
    }
  }

  // 通知更新
  notify(){
    this.subs.forEach(watcher => {
      watcher.update();
    })
  }

}

// 用于全局缓存当前的watcher
Dep.target = null;

// Watcher栈，保存多个watcher，当获取计算属性的时候会有 渲染watcher和计算属性watcher
let watcherStack = [];

// 设置当前全局watcher
Dep.pushTarget = function(watcher){
  Dep.target = watcher;
  watcherStack.push(watcher);
}
// 移除当前全局Watcher
Dep.popTarget = function(){
  watcherStack.pop();
  Dep.target = watcherStack[watcherStack.length - 1];
}

export default Dep;