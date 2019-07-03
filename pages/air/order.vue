<template>
  <div class="container1">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
        <OrderForm 
        @setInfoData="setInfoData" 
        @setAllPrice='setAllPrice'/>
        <!-- <OrderForm :data='infoData'/> -->
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <OrderAside :data="infoData" :allPrice='allPrice'/>
      </div>
    </el-row>
  </div>
</template>

<script>
import OrderForm from "@/components/air/orderForm";
import OrderAside from "@/components/air/orderAside.vue";

export default {
  data() {
    return {
      //机票信息的初始值
      infoData: {
        seat_infos: {}
      },
      //总价格
      allPrice:0,
    };
  },

  // 注册组件
  components: {
    OrderForm,
    OrderAside
  },

  methods: {
    //给表单组件设置机票信息
    setInfoData(data) {
      this.infoData = data;
    },

    //总价格
    setAllPrice(price){
        this.allPrice = price;
    }
  }
};
</script>

<style lang="less" scoped>
.container1 {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>