<template>
  <div class="com-container">
    <label v-if="label">{{label}}</label>
    <slot></slot>
    <p class="error" v-if="error">{{error}}</p>
  </div>
</template>

<script>
export default {
  props:{
    label:{
      type: String
    },
    prop:{
      type: String
    }
  },
  data(){
    return{
      error:''
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