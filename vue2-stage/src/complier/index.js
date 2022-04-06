import { parseHTML } from "./parser";
import { generate } from "./generate";


// 模板转函数
export function compileToFunction(html){

  // HTML => AST对象村
  // <div id="app"><span>{{name}}</span></div>
  // {type:1,tag:'div',attrs:[{id:'app}],children:[{type:1,tag:'span',children:[{type:3,text:'{{name}}'}]]}
  let root = parseHTML(html);

  // AST对象村 => render字符串
  // 生成代码
  let code = generate(root);
  // console.log(code,'code');

  // render字符串 => render函数
  // code中的数据都在 vm 上
  
  // ======= 模板引擎 ======= new Function + with 实现
  // eval 性能太低不推荐，会有作用域问题 
  // new Function 创建的是一个沙箱模式，会创建和全局作用域相平行的作用域，不会影响全局作用域
  // console.log('准备生成');
  let render = new Function(`with(this){return  ${code}}`);
  // console.log('生成完毕');
  return render;
}