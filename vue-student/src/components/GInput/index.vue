<template>
  <div class="com-container">
    <input class="g-input" :value="value" v-bind="$attrs" @input="onInput"/>
  </div>
</template>

<script>
export default {
  props: {
    value:{
      type: String
    }
  },
  data(){
    return{

    }
  },
  methods: {

    // 输入框改变
    onInput(e){
      this.$emit('input',e.target.value);
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