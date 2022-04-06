// 根据虚拟DOM替换真实DOM
export function patch(oldNode,vnode){

  if (!oldNode){
    // 是组件，直接将vnode进行生成元素
    return createEl(vnode);
  }

  if (oldNode.nodeType === 1){  // 真实元素
    // 根据vnode生成真实DOM
    let el = createEl(vnode);

    let parent = oldNode.parentNode;
    // 将生成后的DOM插入到oldNode的后面
    parent.insertBefore(el,oldNode);
    
    // 找到oldNode的父节点，再删除oldNode
    parent.removeChild(oldNode);

    // 将新节点返回出去，用于覆盖原来的旧节点
    return el;
  }else{ // 虚拟节点
    return null;
  }
  
}

// 生成元素
function createEl(vnode){
  let {tag,data,children,text,vm} = vnode;

  if (typeof vnode.tag === 'string'){
    // 判断是组件还是原生节点
    if (createComponent(vnode)){
      console.log('组件',tag);
      // 组件节点
      return vnode.componentInstance.$el;
    }

    console.log('原生',tag);
    // 原生节点
    vnode.el = document.createElement(tag);
    // 创建子元素
    children.forEach(child => {
      vnode.el.appendChild(createEl(child));
    })
  }else{
    // 文本元素
    vnode.el = document.createTextNode(text)
  }

  // 缓存真实dom到 vm上
  vm.el = vnode.el;

  return vm.el;
}

// 创建组件节点的真实Dom
function createComponent(vnode){

  let i = vnode.data;
  // i = vnode.data.hook.init
  if ((i = i.hook) && (i = i.init)){
    i(vnode); // 调用 init 方法
  }
  if (vnode.componentInstance){
    // 有属性说明子组件new完毕了，并且组件对应的真实DOM挂载到了componentInstance.$el上
    return true;
  }
}
