// const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  lintOnSave: false,  // 禁用ESLint
  // devtool: 'source-map',//默认是：cheap-module-eval-source-map
  chainWebpack: config => {
    config.resolve.alias.set('@', require('path').join(__dirname, 'src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
    config.resolve.alias.set('~', require('path').join(__dirname, '/')) // key,value自行定义，比如.set('@@', resolve('src/components'))

     // 生产环境，开启js\css压缩
    //  if (process.env.NODE_ENV === 'production') {
    //   config.plugin('compressionPlugin').use(new CompressionPlugin({
    //     test: /\.(js|css|less|scss)$/, // 匹配文件名
    //     threshold: 10240, // 对超过10k的数据压缩
    //     minRatio: 0.8,
    //     deleteOriginalAssets: true // 删除源文件
    //   }))
    // }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.devtool = 'source-map';
    }else{
      // config.devtool = 'cheap-module-eval-source-map';
    }
  },
  // 代理配置
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  }
}
