import { nextTick } from "../utils";

let queue = []; // 需要更新的队列 watcher队列
let has = {}; // 用于watcher去重
let waiting = false; // 待更新中

// 计划更新
// 防抖处理，异步更新，让多次修改只执行一次渲染
// 要等待同步代码执行完毕后，才会执行异步逻辑
export function queueWatcher(watcher){

  // 去重，多次加入同一个watcher，只保留一个 watcher
  let id = watcher.id;
  if (has[id] == null){
    // 加入队列
    queue.push(watcher);
    // 缓存id 
    has[id] = true;
    
    // 批处理 防抖，开启一次更新操作
    if (!waiting){
      waiting = true;
      // 统一使用nextTick来处理
      nextTick(() => {
        // 执行队列任务
        flushSchedulerQueue();
      });
    }
  }

}

// 执行队列任务
function flushSchedulerQueue(){

  for(let i = 0; i < queue.length; i++){
    // 执行更新
    queue[i].run();
  }

  // 清空队列
  queue = [];
  has = {};
  // 重置更新中的状态
  waiting = false;
}