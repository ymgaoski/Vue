<template>
  <div class="com-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props:{
    value: {
      type: Object
    },
    rules: {
      type: Object
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