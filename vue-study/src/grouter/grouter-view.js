export default {
  render(h){
    
    //　this.$router 是因为之前有对 Vue.prototype.$router 进行了挂载,所以能取到
    const {routerMap,current} = this.$router;
    console.log(this,'grouterView');

    // 获取路由映射表里面的组件
    let com = routerMap[current].component || null;
    console.log(com,'com');
    return h(com);
  }
}