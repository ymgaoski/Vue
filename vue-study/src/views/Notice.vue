<template>
  <div>
      <button @click="pushNotice">弹出</button>
  </div>
</template>

<script>
import GNotice from '@/components/GNotice'
export default {
    components: {
        GNotice,
    },
    data(){
        return{

        }
    },
    methods: {
        pushNotice() {
            this.$notice({
                title: '标题',
                desc: '这是一些内容'
            });
        }
    },
}
</script>

<style scoped>

</style>