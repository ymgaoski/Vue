export default {
  props:{
    to:{
      type: String
    }
  },
  render(h){
    // 此时的 this 是组件实例
    // console.log(this,'link');
    
    // 参数: tagName,data,children
    return h('a',
                {attrs:{href: '#'+ this.to}},
                this.$slots.default
            );
  }
}