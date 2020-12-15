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
          console.log(attr.nodeValue,'是v-开头的');
          // 设置值
          const data = this.getExpValue(attr.nodeValue);
          console.log(data,'data');
          
          // 提取命令 text | html
          const command = attr.nodeName.slice(2);
          // 执行命令 textUpdater | htmlUpdater
          this[`${command}Updater`](node,data);
        }
      })
    }
  }

  // k-text指令更新函数
  textUpdater(node,data){
    node.innerText = data;
  }

  // k-text指令更新函数
  htmlUpdater(node,data){
    node.innerHTML = data;
  }

  // 文本内容编译
  textCompile(node){
    // 上次正则匹配中 {{name}} 获取name文本值
    const exp = RegExp.$1;
    node.textContent = this.getExpValue(exp);
  }

  // 获取表达式的值，支持获取子属性
  getExpValue(exp){
    // exp
    const exps = exp.split('.');

    let value;
    exps.forEach(exp => {
      if (!value){
        value = this.$vm[exp];
      }else{
        value = value[exp];
      }
    })
    return value;
  }

}