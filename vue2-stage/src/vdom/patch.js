// 根据虚拟DOM替换真实DOM
export function patch(oldVnode,vnode){

  if (!oldVnode){
    // 是组件，直接将vnode进行生成元素
    return createEl(vnode);
  }

  if (oldVnode.nodeType === 1){  // 真实元素
    // 根据vnode生成真实DOM
    let el = createEl(vnode);

    let parent = oldVnode.parentNode;
    // 将生成后的DOM插入到oldVnode的后面
    parent.insertBefore(el,oldVnode);
    
    // 找到oldVnode的父节点，再删除oldVnode
    parent.removeChild(oldVnode);

    // 将新节点返回出去，用于覆盖原来的旧节点
    return el;
  }else{ // 虚拟节点

    // diff算法处理
    // console.log(oldVnode,vnode,'patch');
    
    // 先判断两个标签名是否一样，不一样就将新的替换旧的
    if (oldVnode.tag != vnode.tag){
      // 通过vnode.el 获取现在真实的dom元素
      // 此时的vnode.el 还没有dom元素，需要 createEl 生成
      return oldVnode.el.parentNode.replaceChild(createEl(vnode),oldVnode.el);
    }

    // --- 标签一样
    

    // 复用老节点，因为此时新节点还没有dom
    let el = vnode.el = oldVnode.el;

    // 如果两个都是文本节点，比较文本内容,
    if (vnode.tag == undefined){ 
      // 新老都是文本
      if (oldVnode.text !== vnode.text){
        el.textContent = vnode.text;
      }
      return;
    }

    // 如果标签一样比较属性,传入新的虚拟节和老的属性，用新的属性更新老的 
    patchProps(vnode,oldVnode.data);
    
    // --- 开始比较儿子

    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];
    // console.log(oldChildren,newChildren);
    
    if(oldChildren.length > 0 && newChildren.length > 0){
      // 双方都有儿子
      
      // Vue使用双指针的方式来比对
      patchChildren(el,oldChildren,newChildren);

    }else if(newChildren.length > 0){
      // 新的有，老的没有，将新的儿子添加到老的子节点中
      for(let i = 0; i < newChildren.length; i++){
        // 将子节点生成真实节点
        let child = createEl(newChildren[i]);
        el.appendChild(child);
      }
    }else if(oldChildren.length > 0){
      // 老的有，新的没有，删除老的儿子
      el.innerHTML = '';
    }

  }
}

// 判断两个vNode是否是同一节点
function isSameVnode(oldVnode,newVnode){
  return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key;
}

// Diff核心 比较儿子
function patchChildren(el,oldChildren,newChildren){
  // 双指针
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];


  // 需要根据key和对应的索引将老的内容生成映射表
  const makeIndexByKey = (children) => {
    let map = {};
    children.forEach((item,index) => {
      if (item.key){
        map[item.key] = index;
      }
    })
    return map;
  }

  const keysMap = makeIndexByKey(oldChildren);
  // console.log(keysMap,'map');

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
    
    // 头头比较，尾尾比较，头尾比较，尾头比较： 优化了向后添加，向前添加，尾巴移动到头部，头部移动到尾巴，反转 的比较
    
    // 处理【乱序比较】中被移动的数据
    if (!oldStartVnode){
      // 已经被移走了，需要指针跳过
      oldStartVnode = oldChildren[++oldStartIndex];
    }else if(!oldEndVnode){
      oldEndVnode = oldChildren[--oldEndIndex];
    }

    // 同时循环新的，老的 节点，有一方循环完毕就结束
    if (isSameVnode(oldStartVnode,newStartVnode)){ // 头头比较
      // 标签一致，递归比较儿子
      patch(oldStartVnode,newStartVnode);
      // 指针往后移
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }else if(isSameVnode(oldEndVnode,newEndVnode)){ // 尾尾比较
      patch(oldEndVnode,newEndVnode);
      // 指针往前移
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if (isSameVnode(oldStartVnode,newEndVnode)){ //　头尾比较-交叉比较（老头，新尾）
      patch(oldStartVnode,newEndVnode);
      // 将老的节点移到老尾指针的后面，nextSibling为null就是往最后插入
      el.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling);

      // 老的头指针往后移
      oldStartVnode = oldChildren[++oldStartIndex];
      // 新的尾指针往前移
      newEndVnode = newChildren[--newEndIndex];
    }else if (isSameVnode(oldEndVnode,newStartVnode)){ //　尾头比较-交叉比较（老尾，新头）
      patch(oldEndVnode,newStartVnode);
      // 将老的节点移到老头指针的前面
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);

      // 老的尾指针往前移
      oldEndVnode = oldChildren[--oldEndIndex];
      // 新的头指针往后移
      newStartVnode = newChildren[++newStartIndex];
    }else{ // 乱序比较 （Diff核心）

      // 1、需要根据key和对应的索引将老的内容生成映射表
      // 用新的去老的映射表中去找，找到就是要移动的索引
      let moveIndex = keysMap[newStartVnode.key];
      if (moveIndex == undefined){
        // 说明没有找到匹配的，不能复用，直接创建新的插入到老节点开头处
        el.insertBefore(createEl(newStartVnode).el,oldStartVnode.el);
      }else{
        // 将需要移动的节点，移动到头指针前面
        let moveNode = oldChildren[moveIndex];
        // 此节点已经移动走了，设置为null，解决数组塌陷，因为上面映射表中的索引是固定的
        oldChildren[moveIndex] = null;
        el.insertBefore(moveNode.el,oldStartVnode.el);
        // 还需要再去递归比较儿子,比较两个节点
        patch(moveNode,newStartVnode);
      }

      newStartVnode = newChildren[++newStartIndex];
    }
  }

  // 处理剩下没有比对完的
   
  // 新的追加、向前插入的处理
  if (newStartIndex <= newEndIndex){
    for(let i=newStartIndex; i <= newEndIndex; i ++){
      let childEl = createEl(newChildren[i]);

      // 使用 insertBefore 实现 appendChild功能，insertBefore(节点,null) 和appendChild功能相同
      // 可能通过看尾指针的下一个元素是有元素，还是null，如果是null说明是最后一个,否则就是要往前面插入
      let anchor = newChildren[newEndIndex+1] == null ? null :  newChildren[newEndIndex+1].el;
      el.insertBefore(childEl,anchor)
    }
  }

  // 新的尾部被删除的处理
  if(oldStartIndex <= oldEndIndex){
    for(let i = oldStartIndex; i <= oldEndIndex; i++){
      // 老的多，将老节点删除，但有可能里面为 null 的情况
      if (oldChildren[i] != null){
        el.removeChild(oldChildren[i].el);
      } 
    }
  }

} 

// 生成属性，对比属性
// 初始化和更新都可以调用
// 只传第一个参数，说明是 初始化渲染，传两个表示对比属性
function patchProps(vnode,oldProps = {}){
  let newProps = vnode.data || {};
  let el = vnode.el;

  // 如果老的属性有，新的没有，直接删除属性
  for (const key in oldProps) {
    if (!newProps[key]){
      // 删除老的属性
      el.removeAttribute(key);
    }
  }

  // style的处理
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};
  for (const key in oldStyle) {
    // 新的里面没有这个样式属性，清空该属性
    if(!newStyle[key]){
      el.style[key] = '';
    }
  }

  for(let key in newProps){
    if(key === 'style'){
      for (let styleName in newProps.style){
        el.style[styleName] = newProps.style[styleName];
      }
    }else{
      el.setAttribute(key,newProps[key]);
    }
  }
}


// 生成元素
export function createEl(vnode){
  let {tag,data,children,text,vm} = vnode;

  if (typeof vnode.tag === 'string'){
    // 判断是组件还是原生节点
    if (createComponent(vnode)){
      // console.log('组件',tag);
      // 组件节点
      return vnode.componentInstance.$el;
    }

    // console.log('原生',tag);
    // 原生节点
    vnode.el = document.createElement(tag);
    // 创建属性
    patchProps(vnode);

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
