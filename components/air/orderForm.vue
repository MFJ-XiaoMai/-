<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in infoData.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handleInsurance(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入手机号码" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    <input type='hidden' :value="allPrice"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //用户数据
      users: [
        {
          username: "",
          id: ""
        }
      ],
      // 机票信息
      infoData: {
        insurances: [],
        seat_infos: {}
      },

      // 表单数据
      insurances: [], //选中的保险id
      contactName: "", //联系人
      contactPhone: "", //联系电话
      invoice: false, //不需要发票
      captcha: "" //手机验证码
    };
  },

  computed: {
    //计算总价格
    allPrice() {
      let price = 0;

      //机票单价
      price += this.infoData.seat_infos.org_settle_price;

      //添加燃油费
      price += this.infoData.airport_tax_audlet;

      //保险
      // price += this.insurances.length * this.infoData.insurances.price;
      price += this.insurances.length * 30;

      //总价格
      price *= this.users.length;

      //把总价格传递给父组件
      this.$emit("setAllPrice", price);

      // console.log(price);
      return price;
    }
  },

  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.users.push({
        username: "",
        id: ""
      });
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.users.splice(index, 1);
    },

    //选择的保险的时候触发，把保险的id添加到data的insurances中
    handleInsurance(id) {
      const index = this.insurances.indexOf(id);

      if (index === -1) {
        this.insurances.push(id);
      } else {
        this.insurances.splice(index, 1);
      }
      // console.log(this.insurances);
    },
    // 发送手机验证码
    handleSendCaptcha() {
      // 判断手机号不能为空
      if (this.contactPhone == "") {
        this.$confirm("手机号不能为空", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return;
      }

      //请求验证码
      this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: this.contactPhone
        }
      }).then(res => {
        // console.log(res.data);
        const { code } = res.data;
        this.$alert("手机验证码是：" + code, "提示", {
          confirmButtonText: "确定"
        });
      });
    },

    // 提交订单
    handleSubmit() {
      const data = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        captcha: this.captcha,
        invoice: this.invoice,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      };

      //获取token
      const token = this.$store.state.user.userInfo.token;

      //提交生成机票的订单
      this.$axios({
        url: "/airorders",
        method: "POST",
        data,
        //访问需要登录授权接口：需要添加头信息Authorization
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        // console.log(res);

        this.$message.success('正在生成订单，请稍后...')
        
        //订单id
        const {id} = res.data.data
        //跳转到订单页
        this.$router.push({
          path:'/air/pay',
          query:{
            id
          }
        })
      });
    }
  },

  mounted() {
    // 请求机票的信息
    this.$axios({
      url: `/airs/${this.$route.query.id}`,
      method: "GET",
      params: {
        seat_xid: this.$route.query.seat_xid
      }
    }).then(res => {
      // console.log(res.data);
      this.infoData = res.data;

      this.$emit("setInfoData", this.infoData);
    });
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>