const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 用来获取标签名  

const startTagOpen = new RegExp(`^<${qnameCapture}`);         // 匹配开始标签  <div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);      // 匹配结束标签  </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;   // 匹配属性 a="xxx" | a='xxx' | a=xxx 3种方式
const startTagClose = /^\s*(\/?)>/;   // 开始并结束标签 <div/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  // 模板变量值 {{name}} 

let root = null; 
let stack = [];

// 创建AST元素
function createAstElement(tagName,attrs){
  return {
    type: 1,
    tag:tagName,
    children: [],
    parent: null,
    attrs
  }
}

// 匹配到开始标签的处理
function start(tagName,attrs){
  // console.log('start',tagName,attrs);

  let statckTop = stack[stack.length - 1];
  let node = createAstElement(tagName,attrs);

  if (!root){
    // 第一个要节点
    root = node;
  }else{
    // 添加新节点
    if (statckTop){
      statckTop.children.push(node);
    }
    // 设置父节点
    node.parent = statckTop;
  }
  stack.push(node);
}

// 匹配到结束标签的处理
function end(tagName){
  // console.log('end',tagName);

  let statckTop = stack.pop();
  if (statckTop.tag !== tagName){
    // 开始与结束标签不匹配
    throw '标签不匹配';
  }
}

// 匹配到文本的处理
function chars(text){
  // console.log('chars',text);
  text = text.replace(/\s/g,"");
  if (text){
    let statckTop = stack[stack.length - 1];
    statckTop.children.push({
      type: 3,
      text: text,
      parent: statckTop
    })
  }
}

// 解析HTML
export function parseHTML(html){

  root = null; 
  stack = [];

  // 移除匹配成功的数据
  function advance(len){
    html = html.substring(len);
  }

  // 解析开始标签与属性
 function parseStartTag(){
    const start = html.match(startTagOpen);
    if (start){
      // 是开始标签
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length);
      
      // 匹配属性
      // 如果没有遇到标签结尾就不停去解析
      let end;
      let attr;
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute)) ){
        let name = attr[1];
        let value = attr[3] || attr[4] || attr[5];
        match.attrs.push({name,value});

        advance(attr[0].length);
      }
      if (end){
        advance(end[0].length);
      }
      return match;
    }
    return false;
  }

  // 循环处理 html
  while(html){
    let textEnd = html.indexOf('<');

    if (textEnd === 0){
      // 解析标签与属性
      const startTagMatch = parseStartTag();
      if (startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs);
        continue;
      }

      // 结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch){
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }

    // 解析文本
    let text;
    if (textEnd > 0){
      text = html.substring(0,textEnd);
    }
    if (text){
      chars(text);
      advance(text.length);
    }
  }

  return root;
}

