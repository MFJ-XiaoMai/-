<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <!-- 因为机票条件过滤和数据列表不是同一个组件，条件过滤（FlightsFilters）是一个子组件，所以我们得新建一个方法，并且这个方法是要修改dataList（子组件修改父组件中的数据） -->
        <!-- <FlightsFilters 
        :data='flightsDate' @setDataList='setDataList'/>-->
        <FlightsFilters :data="cacheflightsDate" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <div>
          <!-- 航班列表 -->
          <!-- flightsDate是机票列表的总数据，而分页列表在单前显示的条数是根据pageSize来决定的，他是课表的，所以把它放在另一个数组里面 -->
          <!-- <FlightsItem v-for="(item,index) in flightsDate
          .flights" :key="index" :data="item" />-->
          <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item" />
        </div>
        <!-- 分页信息 -->
        <!-- size-change：切换条数的时候触发   current-change：页数切换的时候触发   current-page：当前页数
        total ：总数-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5,10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside/>
      </div>
    </el-row>
  </section>
</template>

<script>
import moment from "moment";
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from "@/components/air/flightsAside.vue";

export default {
  data() {
    return {
      // 默认机票列表总数据，会被修改
      flightsDate: {
        // 默认机票列表
        flights: [],
        info:{},
        options:{},
      },

      pageIndex: 1, //默认显示第一页
      pageSize: 5, //默认显示多少条数据
      total: 0, //总条数
      //总数据，用于循环flightsItem组件，单独出来是因为要分页，
      dataList: [] ,//分页之后的数据列表

      //总数据，一旦赋值后不会被修改
      cacheflightsDate: {//缓存一份数据，只会修改一次
        // 默认机票列表
        flights: [],
        info:{},
        options:{},
      },
    };
  },
  // 注册组件
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },

  watch:{
    //监听url的变化
    $route(){
      //请求机票列表数据
      this.getData()
    }
  },

  methods: {
    //分页切换条数的时候触发
    handleSizeChange(value) {
       this.pageSize = value; 
    },
    // 页数切换的时候触发
    //handleCurrentChange方法默认接收一个参数表示当前页
    handleCurrentChange(value) {
    //   this.pageIndex += 1;
      this.pageIndex = value;
    //   //计算截取列表的数据
    //   this.dataList = this.flightsDate.flights.slice(
    //     (this.pageIndex - 1) * this.pageSize,
    //     this.pageIndex * this.pageSize
    //   );

    this.setDataList(); //调用函数
    },
    // 修改dataList
    setDataList(arr){//既是个方法，也是一个事件，可传给FlightsFilters组件

        // 接收子组件通过$emi触发事件通过参数传递过来的数据
        if(arr){//若传递过来则赋值给this.flightsDate.flights进行切割
            this.flightsDate.flights = arr ;

            //初始化分页变量
            this.total = arr.length;
            this.pageIndex = 1;
        }

        //计算截取列表的数据
      this.dataList = this.flightsDate.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
    },

    getData(){
      //获取航班总数据
      this.$axios({
        url: "/airs",
        method: "GET",
        //来自url的5个参数
        params: this.$route.query
      }).then(res => {
        // console.log(res.data);
        this.flightsDate = res.data;

      //   缓存总数据，值和flightsData是相等的，一旦赋值之后不得修改
      this.cacheflightsDate = {...res.data}; //用解构的方式来克隆一个新的技术

        //总条数
        this.total = res.data.total;

        // 初始化数据
        this.pageIndex = 1;

        //   获取第一到第五条的数据
        this.dataList = res.data.flights.slice(0, 5);
      });
    }
  },

  mounted() {
    //请求机票列表数据
    this.getData()
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>