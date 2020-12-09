<template>
  <div class="com-container">
    <input class="g-input" :type="type" :value="value" v-bind="$attrs" @input="onInput" @blur="onBlur"/>
  </div>
</template>

<script>
export default {
  props: {
    value:{
      type: String
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  data(){
    return{

    }
  },
  methods: {

    // 输入框改变
    onInput(e){
      
      // 值改变的回调
      this.$emit('input',e.target.value);

      // 调用父级，GFormItem 来进行 校验，TODO: $parent 耦合性太强，需要优化
      this.$parent.$emit('validate');
    },

    // 失去焦点
    onBlur(){
      this.$parent.$emit('validate');
    }
  }
}
</script>

<style lang="scss" scoped>
.com-container{
  .g-input{
    height: 24px;
    line-height: 24px;
    outline: none;
    border: 1px solid rgb(182, 182, 182);
    border-radius: 4px;
    padding: 0 5px;
  }
}
</style>