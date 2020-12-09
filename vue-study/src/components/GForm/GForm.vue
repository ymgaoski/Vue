<template>
  <div class="com-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props:{
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object
    }
  },
  // 为子级，子子级 提供form对象的访问
  provide(){
    return {
      form : this
    }
  },
  data(){
    return{

    }
  }
}
</script>

<style lang="scss" scoped>

</style>