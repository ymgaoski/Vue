<template>
  <div class="container">
    <h1>表单组件</h1>

    <GForm :model="user" :rules="rules">
      <GFormItem label="用户名：" prop="username">
        <GInput type="text" v-model="user.username" placeholder="请输入用户名"></GInput>
      </GFormItem>
      
      <GFormItem label="密码：" prop="password">
        <GInput type="password" v-model="user.password" placeholder="请输入密码"></GInput>
      </GFormItem>

      <GFormItem>
        <button>提交</button>
      </GFormItem>
    </GForm>
    
  </div>
</template>

<script>
import GInput from '@/components/GForm/GInput'
import GFormItem from '@/components/GForm/GFormItem'
import GForm from '@/components/GForm/GForm'

export default {
  components:{
    GInput,
    GFormItem,
    GForm
  },
  data(){
    return{
      user:{
        username:'xgao',
        password:''
      },
      rules:{
        username:[{required: true, message: '请输入用户名'}],
        password:[{required: true, message: '请输入密码'}]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>