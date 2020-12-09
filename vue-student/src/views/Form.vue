<template>
  <div class="container">
    <h1>表单组件</h1>

    <GFormItem label="用户名：" prop="username">
      <GInput type="text" v-model="user.username" placeholder="请输入用户名"></GInput>
    </GFormItem>
    
    <GFormItem label="密码：" prop="username">
      <GInput type="password" v-model="user.password" placeholder="请输入密码"></GInput>
    </GFormItem>
    
  </div>
</template>

<script>
import GInput from '@/components/GInput'
import GFormItem from '@/components/GFormItem'

export default {
  components:{
    GInput,
    GFormItem
  },
  data(){
    return{
      user:{
        username:'xgao',
        password:''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>