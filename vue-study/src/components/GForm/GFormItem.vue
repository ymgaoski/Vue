<template>
  <div class="com-container">
    <label v-if="label">{{label}}</label>
    <slot></slot>
    <p class="error" v-if="error">{{error}}</p>
  </div>
</template>

<script>
import ValidSchema from 'async-validator'

export default {
  props:{
    label:{
      type: String
    },
    prop:{
      type: String
    }
  },
  // 注入祖先中提供的 form 属性
  inject:['form'],
  data(){
    return{
      error:''
    }
  },
  mounted(){

    this.$on('validate', () => {
      this.validate();
    })
  },

  methods: {

    // 校验
    validate(){
      
      // 获取需要校验的 值 
      const rule = this.form.rules[this.prop];
      // 获取校验值 指定的规则
      const value = this.form.model[this.prop];

      // 定义校验描述对象
      const desc = {[this.prop]: rule};
      // 创建校验架构对象
      const valid = new ValidSchema(desc);

      // 使用async-validate进行校验
      return valid.validate({[this.prop]: value},(errors) => {
        if (errors){
          // 校验失败
          this.error = errors[0].message;
        }else{
          // 校验成功
          this.error = '';
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.com-container{

  .error{
    color:red;
  }
}
</style>