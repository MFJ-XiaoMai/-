<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <!-- form表单 -->
    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 每次输入的时候都会执行，设置下拉菜单的数据 -->
        <!-- select 点击选中下拉菜单的值的时候触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- type：声明选择器是日期的选择器 -->
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 导入momentjs
import moment from "moment";

export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,

      // 表单数据，提交到下一个页面
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      }
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      if(index === 1){
        this.$confirm("目前暂不支持往返，请使用单程选票", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: 'warning'
      });
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是输入框的值，
    // callback调用时需要传入数据，这个数组就是下拉列表的数据
    queryDepartSearch(value, callback) {
      if (!value) {
        //如果value为空时，向下执行
        return; //跳出函数体
      }

      this.$axios({
        url:'/airs/city?name=' + value,
        method:'GET',
      }).then( res =>{
        // console.log(res.data);
        const {data} = res.data;
        const newData = data.map( v =>{
          return {
            ...v,
            value:v.name.replace('市','')
          }
        })
        callback(newData)
      })
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，callback是回调函数，接收要展示的列表
    queryDestSearch(value, callback) {
      if (!value) {
        //如果value为空时，向下执行
        return; //跳出函数体
      }

      this.$axios({
        url:'/airs/city?name=' + value,
        method:'GET',
      }).then( res =>{
        // console.log(res.data);
        const {data} = res.data;
        const newData = data.map( v =>{
          return {
            ...v,
            value:v.name.replace('市','')
          }
        })
        callback(newData)
      })

      
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      // console.log(item);
      this.form.departCity = item.value;
      this.form.departCode = item.sort
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCity = item.value;
      this.form.destCode = item.sort
    },

    // 确认选择日期时触发
    handleDate(value) {
      // console.log(value);
      // this.form.departDate=value
      this.form.departDate=moment(value).format('YYYY-MM-DD')
    },

    // 出发和目标城市切换时触发
    handleReverse() {
      const {departCity,departCode,destCity,destCode} = this.form
      // 将到达城市的值赋值给出发城市
      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单时触发
    handleSubmit() {
      // console.log(this.form);

      // 自定义规则验证(需要用户输入数据方可跳转)
      const rules={
        // 出发的城市数据
        depart:{
          value:this.form.departCity,
          message:'请输入出发城市'
        },
        // 到达的城市数据
        dest:{
          value:this.form.destCity,
          message:'请输入到达的城市'
        },
        // 出发的日期
        departDate:{
          value:this.form.departCity,
          message:'请输入出发日期'
        }
      };
      //验证的开关，如果是false代表不通过
      let valid = true;

      // 循环验证表单的数据
      //Object下的keys 方法可以返回一个对象数组,数组里面的对象由key组成
      // console.log(Object.keys(rules));
      // Object.keys(rules).map( v =>{
      Object.keys(rules).forEach( v =>{
        //只要一个表单的输入框中有一项为空，就停止执行后面的代码，弹出提示框
        if( !valid ) return;

        if(!rules[v].value){//若rules数组里面的任意一项为空，则弹出提示框提醒用户
          this.$message.warning(rules[v].message);
          // 因为map或forEach没有办法中断后面代码的执行，所以我们需要一个开关来控制
          valid = false;
        }
      })
      
      //若rules数组里面的任意一项为空，则阻止函数后面的代码执行
      if( !valid ){
        return;
      }

      // 跳转到列表页
      this.$router.push({
        path:'/air/flights',
        // query 获取地址栏的参数
        query:this.form
      })

      //将当前表单的值保存到本地
      const localAirs = JSON.parse(localStorage.getItem('airs') || `[]`)

      //存进去新的搜索记录：在数组的最前面追加一组数据
      //unshift
      localAirs.unshift(this.form);

      // 保存到本地
      localStorage.setItem('airs',JSON.stringify(localAirs));
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
