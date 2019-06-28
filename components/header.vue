<template>
  <header class="header">
    <el-row type="flex" justify="space-between" class="main">
      <!-- 网页logo -->
      <div class="logo">
        <nuxt-link to="/">
          <img src="http://157.122.54.189:9093/images/logo.jpg">
        </nuxt-link>
      </div>
      <!-- 导航菜单栏 -->
      <el-row type="flex" class="navs">
        <nuxt-link to="/">首页</nuxt-link>
        <nuxt-link to="/post">旅游攻略</nuxt-link>
        <nuxt-link to="/hotel">酒店</nuxt-link>
        <nuxt-link to="/air">国内机票</nuxt-link>
      </el-row>

      <!-- 用户信息/登录注册 -->
      <el-row type="flex" align="middle">
        <!-- 如果用户已登录则显示用户信息，用户数据来自store -->
        <!-- v-if="$store.state.user.userInfo.token"  
        判断user下的userInfo对象里的token是否有值，若有则为true，显示用户头像
        否则显示登录/注册 -->
        <el-dropdown v-if="$store.state.user.userInfo.token">
          <el-row type="flex" align="middle" class="el-dropdown-link">
            <nuxt-link to="#">
              <!-- <img src="http://157.122.54.189:9093/images/pic_sea.jpeg"> -->
              <img :src="$axios.defaults.baseURL+
              $store.state.user.userInfo.user.defaultAvatar">
              <!-- 动态获取用户名 -->
              <span>{{$store.state.user.userInfo.user.nickname}}</span>
            </nuxt-link>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-row>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <nuxt-link to="#">个人中心</nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="handleLogout">退出</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 当用户处于未登录状态时，显示登录注册链接 -->
        <nuxt-link to="/user/login" class="account-link" v-else>登录/注册</nuxt-link>

        <!-- <div v-else class="login-link">
          <nuxt-link to='/user/login'>
            显示store的token：
          </nuxt-link>
        </div> -->
      </el-row>
    </el-row>
  </header>
</template>
<script>
export default {
  mounted(){
    console.log(this.$store);
    // console.log(this.$store.state.user.userInfo.token);//user是store/user.js中的文件名
  },
  methods: {
    // 用户退出
    handleLogout() {
      //调用user文件里store下的mutations的方法来清空store的user/state下的数据
      this.$store.commit('user/clearUserInfo')
    }
  }
};
</script>
<style scoped lang="less">
.header {
  height: 60px;
  line-height: 60px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 3px 0 #f5f5f5;
  box-sizing: border-box;
  .main {
    width: 1000px;
    margin: 0 auto;
    .logo {
      width: 156px;
      padding-top: 8px;
      img {
        display: block;
        width: 100%;
      }
    }
    .navs {
      margin: 0 20px;
      flex: 1;
      a {
        display: block;
        padding: 0 20px;
        height: 60px;
        box-sizing: border-box;

        &:hover,
        &:focus,
        &:active {
          color: #409eff;
          border-bottom: 5px solid #409eff;
        }
      }
      // 菜单高亮时的颜色
      /deep/.nuxt-link-exact-active {
        background: #409eff;
        color: #fff !important;
      }
    }
    .el-dropdown-link{
       margin-left:20px;
        &:hover{
          img{
              border-color: #409eff;
          }
        }
      a{
        display:block;
        img{
          width:32px;
          height:32px;
          vertical-align: middle;
          border:2px #fff solid;
          border-radius:50px;
        }
      }
    }
    .account-link {
      font-size: 14px;
      margin-left: 10px;
      color: #666;
      &:hover {
        color: #409eff;
        text-decoration: underline;
      }
    }
  }
}
</style>