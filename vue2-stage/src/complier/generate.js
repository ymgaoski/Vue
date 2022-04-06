
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  // 模板变量值 {{name}} 

// 生成属性
function createProps(attrs){
  // id:'app',class:'test'
  let str='';
  for (let i=0; i < attrs.length; i++){
    let attr = attrs[i];
    if (attr.name === 'style'){
      // 样式需要转成对象 background: red;color:green;
      let styleObj = {};
      attr.value.split(';').forEach(item => {
        let style = item.split(':');
        styleObj[style[0]] = style[1];
      });
      attr.value = styleObj;
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }

  return str.length > 0 ? str.slice(0,-1) : str;
}

// 生成子元素
function createChildren(els){
  let code='';
  for(let i=0; i<els.length; i++){
    let el = els[i];

    if (el.type === 3){
      // 文本节点

      // hello {{name}} world
      if(!defaultTagRE.test(el.text)){
        // 普通文本，不含{{}}
        code += `_v('${el.text}')`;
      }else{
        // 匹配到{{}}
        // 'hello ' + name + ' world'
        // 重置lastIndex,不然exec就无法重新捕获
        defaultTagRE.lastIndex = 0;
        // console.log(el.text,'-------');

        let tokens = [];
        let match;
        let lastIndex = 0;
        while(match = defaultTagRE.exec(el.text)){
          let index = match.index; // 开始索引
          if (index > lastIndex){
            // 匹配到
            let token = el.text.slice(lastIndex,index);
            // console.log(token,'token');
            tokens.push(JSON.stringify(token));
          }
          tokens.push(`_s(${match[1].trim()})`);

          lastIndex = index + match[0].length; // 结束索引
        }
        if (lastIndex < el.text.length){
          let lastText = el.text.slice(lastIndex);
          tokens.push(`${JSON.stringify(lastText)}`);
        }
        // console.log(tokens,'tokens');
        return `_v(${tokens.join('+')})`
      }

    }else{
      // 元素节点
      if (code){
        code += ',' + generate(el);
      }else{
        code += generate(el);
      }
    }
  }
  return code;
}

// 生成器
// 目标数据： _c('div',{id:'app',a:1},'hello')
export function generate(el){
  // console.log(el,'el');

  // 遍历树，将村拼接成字符串
  let code = `_c('${el.tag}',{${
    createProps(el.attrs)
  }}${
    el.children ? (',' + createChildren(el.children)) : 'undefined'
  })`;
  return code;
}