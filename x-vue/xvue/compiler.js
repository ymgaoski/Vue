
// 编译器
class Compiler{

  constructor(el,vm){
    this.$vm = vm;

    this.$el = document.querySelector(el);
    console.log(this.$el,'dom');

    if (this.$el){
      // 开始编译
      this.compile(this.$el);
    }
  }

  // 编译
  compile(el){

    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {

      // nodeType: 1:元素节点 2:属性节点 3:文本内容节点
      // console.log(node.nodeType,node);

      if (this.isElementNode(node)){
        // 元素节点
        this.elementCompile(node);
      }else if(this.isTextNode(node)){
        // 文本内容节点
        this.textCompile(node);
      }

      // 递归遍历子级
      if (node.childNodes && node.childNodes.length > 0){
        this.compile(node);
      }
    })
  }

  // 是否是元素节点
  isElementNode(node){
    return node.nodeType === 1;
  }

  // 是否是文本内容节点
  isTextNode(node){
    return node.nodeType === 3 && /\{\{(.+)\}\}/.test(node.textContent);
  }

  // 元素编译
  elementCompile(node){

    if (node.attributes && node.attributes.length > 0){
      
      Array.from(node.attributes).forEach(attr => {
        if (attr.nodeName.startsWith('v-')){
          const exp = attr.nodeValue;
          console.log(exp,'是v-开头的');
          // 设置值
          const data = Compiler.getExpValue(this.$vm,exp);
          console.log(data,'data');
          
          // 提取命令 text | html
          const command = attr.nodeName.slice(2);
          // 执行命令 textUpdater | htmlUpdater
          this.update(node,exp,command);
        }
      })

    }
  }

  // 文本内容编译
  textCompile(node){

    // 上次正则匹配中 {{name}} 获取name文本值
    const exp = RegExp.$1;
    
    // 更新文本
    this.update(node,exp,'text');
  }

  // 更新函数作用：
  // 1.初始化
  // 2.创建Watcher实例
  update(node,exp,command){
    
    const data = Compiler.getExpValue(this.$vm,exp);

    // 更新
    const fn = this[`${command}Updater`];
    fn && fn(node,data);
    
    // 创建观察者，并添加到 Dep列队中
    new Watcher(this.$vm,exp,(newVal) => {
      // 执行命令
      fn && fn(node,newVal);
    });
  }

  // v-text指令更新函数
  textUpdater(node,data){
    node.textContent = data;
  }

  // v-text指令更新函数
  htmlUpdater(node,data){
    node.innerHTML = data;
  }

  // v-model指令更新函数
  modelUpdater(node,data){
    
    node.value = data;
  }
}

// ---------- 静态方法 ----------

// 获取表达式的值，支持获取子属性
Compiler.getExpValue = function(vm,exp){
  
  // exp
  const exps = exp.split('.');

  let value;
  exps.forEach(exp => {
    if (!value){
      value = vm[exp];
    }else{
      value = value[exp];
    }
  })
  return value;
}