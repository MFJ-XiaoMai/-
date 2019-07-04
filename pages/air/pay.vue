<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{order.price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// 导入生成二维码的包
import QRCode from "qrcode";

export default {
  data() {
    return {
      order: {},
      //定时器的对象
      timer: null
    };
  },

  methods: {
    // 查询付款状态
    isPay() {
      return this.$axios({
        url: "/airorders/checkpay",
        method: "POST",
        data: {
          id: this.$route.query.id,
          nonce_str: this.order.price,
          out_trade_no: this.order.orderNo
        },
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        if (res.data.statusTxt === "订单未支付") {
          return false;
        } else {
          return true;
        }
      });
    },

    //当页面销毁之后清除定时器
    destroyed() {
      clearInterval(this.timer);
    }
  },

  mounted() {
    //因为页面加载比本地赋值个store还要快，所以打印结果为undefined
    // console.log(this.$store.state.user.userInfo.token,123 );//undefined

    //所以我们要用一个定时器来延后页面加载
    //需要时间擦把本地的值赋给store
    setTimeout(() => {
      // console.log(this.$store.state.user.userInfo.token,456);

      // 获取订单详情;
      return this.$axios({
        url: `/airorders/${this.$route.query.id}`,
        method: "GET",
        //访问需要登录授权接口：需要添加头信息Authorization
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        // console.log(res.data);
        this.order = res.data;

        // /获取dom元素
        const stage = document.querySelector("#qrcode-stage");

        //生成二维码
        //第一个参数是 canvas的dom对象，第二个参数是二维码飞；链接诶，第三个是宽高地配置、
        QRCode.toCanvas(stage, this.order.payInfo.code_url, {
          width: 200
        });

        //查询付款的结果
        // const pay = await this.isPay() //调用函数
        //三秒钟查询一次
        this.timer = setInterval(async () => {
          //接收的是resolve，也就是.then的返回值
          const pay = await this.isPay();

          //如果isPay函数返回的是true，则表示订单支付成功，支付成功后清除定时器
          if (pay) {
            this.$confirm("订单支付成功", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "success"
            });

            clearInterval(this.timer);
            // return;
          }
        }, 3000);
      });
    }, 100);
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>