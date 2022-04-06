// babel与rollup关联插件
import babel from 'rollup-plugin-babel'

export default {
  // 输入
  input: './src/index.js',
  // 输出
  output: {
    format: 'umd', // 统一模块规范协议，支持amd和commonJs规范，会自己选择所支持的协议
    name: 'Vue',  // 全局挂载变量名，window.Vue
    file: './dist/vue.js',  // 输出文件目录与文件名
    sourcemap: true,  // 开启源码映射，通过ES5 能找到ES6
  },
  // 插件
  plugins: [
    babel({
      // 打包排除 node_modules 中的代码
      exclude: 'node_modules/**'
    })
  ]
}