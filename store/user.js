// 用户管理---使用store管理数据
//在nuxt中不用创建store的实例，每个js 模块nuxt会自动创建实例
// 只需要关注state，mutations,action

// export在nuxt中是固定写法
//state是不能修改的，类似于vue组件中的data，用于声明仓库数据
// 因为nuxt是运行在服务器的，localStorage是浏览器中的方法，所以得依赖一个第三方的库来调用localStorage,它会自动判断是浏览器还是服务器
export const state = () =>({
  //采用接口返回数据结构
  userInfo:{
    token:'',
    user:{ }
  },
})

//同步修改state
export const mutations = {
  // 保存用户信息到state(设置用户数据)
  setUserInfo(state, data) {//state指向上面的const state 
    state.userInfo = data  //date 是第二个参数即传递过来的数据
    // console.log(data);
  },

  //设置用户的数据为空，相当于退出登录状态
  clearUserInfo(state,data){
    state.userInfo = {
      token: '',
      user: {}
    }
  }
};

//异步修改state的数据
export const actions = {
  //登录的异步操作
  login({commit},data){
    return this.$axios({
      url:'/accounts/login',
      method:'POST',
      data
    }).then(res =>{
      const data = res.data;
      // 调用store下的mutations的方法
      commit('setUserInfo',data);
      // return data;

      //调用login的方法传入成功的回调函数
      Promise.resolve();
    })
  }
}