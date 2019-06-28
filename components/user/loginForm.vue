<template>
  <el-form 
  class="form" 
  :model="form" 
  ref="form"
  :rules="rules">
    <!-- 用户名 -->
    <el-form-item 
    class="form-item" 
    prop='username'>
      <el-input 
      placeholder="用户名/手机号"
      v-model='form.username'></el-input>
    </el-form-item>

    <!-- 密码 -->
    <el-form-item 
    class="form-item" 
    prop='password'>
      <el-input 
      type="password" 
      placeholder="密码"
      v-model="form.password"></el-input>
    </el-form-item>

    <!-- 忘记密码 -->
    <p class="form-text">
      <nuxt-link to='#'>忘记密码</nuxt-link>
    </p>

    <!-- 登录按钮 -->
    <el-button class="submit" 
    type="primary"
    @click="handleLoginSubmit">登录</el-button>
  </el-form>
</template>

<script>
export default {
  data(){
    return{
      // 表单数据
      form:{
        username:'',    //用户名/手机号
        password:''     //登录密码
      },
      // 表单验证规则
      rules:{
        username:[
          {
            //required：必须的，返回boolean类型的值，必填，如不设置，则会根据校验规则自动生成
            //trigger：引发/触发的事件 blur:失去焦点
            required:true,
            message:'请输入用户名',
            trigger:'blur'
          }
        ],
        password:[
          {
            required:true,
            message:'请输入密码',
            trigger:'blur'
          }
        ]
      }
    }
  },
  methods:{
    // 登录事件
    handleLoginSubmit(){
      // console.log(this.form);
      // 验证表单
      //validate:对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs['form'].validate((valid) => {
        //valid为true时，表示没有错误，可以向登录接口发送请求
        if(valid){
          // this.$axios({
          //   url:'/accounts/login',
          //   method:'POST',
          //   data:this.form
          // }).then(res =>{
          //   // console.log(res.data);
          //   /**
          //    * $store下的方法commit设置仓库的数据
          //    * commit方法可调用仓库中mutations的方法，第一个参数是方法名，第二个参数是传递的数据对象
          //    */
          //   //调用user文件里store下的mutations的方法
          //   this.$store.commit('user/setUserInfo',res.data)

          //   //提示用户(优化，提高用户体验)
          //   this.$message.success('登录成功，正在跳转...')

          //   setTimeout(() => {
          //     // 登录成功后跳转到首页
          //   this.$router.push('/')
          //   }, 1000);
            
          // })

          //调用actions方法
          this.$store.dispatch('user/login',this.form).then(v =>{
            //提示用户(优化，提高用户体验)
            this.$message.success('登录成功，正在跳转...')

            setTimeout(() => {
              // 登录成功后跳转到首页
            this.$router.push('/')
            }, 1000);
          })
        }
      })
    }
  },

  mounted(){
    // this.$store.commit()
    // this.$store.dispatch('/user/login',{})
  }

};
</script>

<style scoped lang='less'>
.form {
  padding: 25px;
  .form-item {
    margin-bottom: 20px;
  }
  .form-text {
    font-size: 14px;
    color: #409EFF;
    text-align: center;
    line-height: 1;
  }
  .submit {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
