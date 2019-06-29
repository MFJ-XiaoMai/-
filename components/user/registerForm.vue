<template>
  <el-form class="form" :model="form" ref="form" :rules="rules">
    <!-- 用户名 -->
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机号" v-model="form.username"></el-input>
    </el-form-item>

    <!-- 验证码 -->
    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <!-- 自定义模板 -->
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <!-- 昵称 -->
    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="昵称" v-model="form.nickname"></el-input>
    </el-form-item>

    <!-- 密码 -->
    <el-form-item class="form-item" prop="password">
      <el-input type="password" placeholder="密码" v-model="form.password"></el-input>
    </el-form-item>

    <!-- 确认密码 -->
    <el-form-item class="form-item" prop="checkPassword">
      <el-input type="password" placeholder="确认密码" v-model="form.checkPassword"></el-input>
    </el-form-item>

    <!-- 登录按钮 -->
    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {

    //验证两次输入的密码是否一致
    /**
     * rule:当前的规则对象
     * value：当前调用规则的字段值
     * callback：是回调函数 代表下一步的执行，必须要调用
     */
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if(value !== this.form.password){
        callback(new Error('两次输入的密码不一致！'))
      }else{
        callback()
      }

    };

    //表单数据
    return {
      form: {
        username: "", //用户名
        captcha: "", //验证码
        nickname: "", //昵称
        password: "", //密码
        checkPassword: "" //确认密码  只做前端的验证，不会发给后端
      },
      //表单规则
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ],
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        checkPassword: [
          // 自定义验证规则，validator自定义验证的函数
          {
            validator:validatePass,
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    //触发点击事件，发送验证码
    handleSendCaptcha() {
      //判断手机号码不能为空
      if(this.form.username===''){
        this.$confirm('手机号码不能为空', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return //跳出函数，不执行后面的代码
      }

      // 请求验证码
      this.$axios({
        url:'/captchas',
        method:'POSt',
        data:{
          tel:this.form.username
        }
      }).then(res =>{
        console.log(res);
        //模拟验证码的返回
        const {code} = res.data
        this.$alert('手机验证码是：'+ code, '提示', {
          confirmButtonText: '确定',
        });

      })
    },

    // 点击注册事件
    handleRegSubmit() {
      //调用注册的接口
      // console.log(this.form);

      //表单验证
      this.$refs.form.validate( valid => {

        if(valid){//如果valid为true时，向下执行

          // 结构并赋值
          // 下面的checkPassword：表示出去它以外
          //  ...props表示剩下属性(参数)
          //简单来说就是，解构this.form里面除去checkPassword外剩余的4个属性。
          const { checkPassword, ...props} = this.form

          this.$axios({
            url:'/accounts/register',
            method:'POST',
            // data:this.form //报500的错误，后台需要4个参数，而我们传过去的是5个参数，多传了checkPassword
            data:props
          }).then(res =>{
            // console.log(res); 

            //把用户数据设置给store(即store/user.js下的store)
            this.$store.commit('user/setUserInfo',res.data)

            this.$message.success('注册成功，正在登录中...')

            setTimeout(() => {
              this.$router.push('/')
            }, 1000);
          })
        }
      })
    }
  }
};
</script>

<style scoped lang='less'>
.form {
  padding: 25px;
  .form-item {
    margin-bottom: 20px;
  }
  .submit {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
