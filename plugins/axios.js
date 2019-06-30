//这只是axios 的插件，用来做拦截

import { Message } from "element-ui";

//在nuxt js中写插件只需要暴露一个函数
// export default  ({ Object })  => {
  //Object是nuxtjs环境的大对象
// console.log(Object);
export default  ({ $axios })  => {
  //$axios是nuxtjs环境的对象

  //拦截所有的错误请求
  $axios.onError(res => {
    console.log(res.response,123);
    const { statusCode, message } = res.response.data;

    // 还未使用
    // if(statusCode === 401 || statusCode === 403){
    //     Message.warning({message: "请先登录"});
    //     redirect("/user/login");
    // }

    if (statusCode === 400) {
      Message.warning({ message });
    }
  })
}
