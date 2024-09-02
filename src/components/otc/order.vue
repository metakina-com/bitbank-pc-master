<template>
  <div class="otcOrder">
    <el-tabs v-model="type" class="pad-t-60 pad-b-35">
      <el-tab-pane label="未完成"></el-tab-pane>
      <el-tab-pane label="已完成"></el-tab-pane>
      <el-tab-pane label="已取消"></el-tab-pane>
    </el-tabs>
    <el-table :data="orderList" style="width: 100%" :empty-text="$t('common.nodata')">
      <el-table-column label="订单号" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='NONPAYMENT'">未付款</span>
          <span v-if="scope.row.status=='PAYMENT'">已付款</span>
          <span v-if="scope.row.status=='FINISH'">已完成</span>
          <span v-if="scope.row.status=='CALLOFF'">已取消</span>
        </template>
      </el-table-column>
      <el-table-column label="总价">
        <template slot-scope="scope">
          <span>{{scope.row.totalPrice|SubString(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价">
        <template slot-scope="scope">
          <span class="">{{scope.row.price|SubString(2)}} CNY</span>
        </template>
      </el-table-column>
      <el-table-column label="交易数量">
        <template slot-scope="scope">
          <span class>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易方向">
        <template slot-scope="scope">
          <span
            v-if="userId==scope.row.userId"
          >{{scope.row.userDirection=='SELL'?'卖出':'买入'}}{{scope.row.currency}}</span>
          <span
            v-else
          >{{scope.row.storeDirection=='SELL'?'卖出':'买入'}}{{scope.row.currency}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span class>{{scope.row.createTime|yndhms('M')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="v-right mar-t-20 pad-b-20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 15]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      type: 0,
      pageNum: 1,
      pageSize: 10,
      orderList: [],
      total: 0
    };
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },
  watch: {
    type(val) {
      this.pageNum = 1;
      this.getOrderList();
    }
  },
  mounted() {},
  methods: {
    getOrderList() {
      this.$post1("otc/order/ownOrderList", {
        priceOrderStatus:
          this.type == 0 ? "NONPAYMENT" : this.type == 1 ? "FINISH" : "CALLOFF",
        userId: this.$store.state.userId,
        page: this.pageNum,
        size: this.pageSize
      })
        .then(res => {
          if (res && res.status == "SUCCEED" && res.result) {
            this.orderList = res.result.data || [];
            this.total = res.result.total;
            this.pageNum = this.pageNum + 1;
          }
        })
        .catch(err => {});
    },
    //撤单
    cancelorder(e) {
      for (var i = 0; i < this.entrustList.length; i++) {
        var item = this.entrustList[i];
        if (item.id == e) {
          this.entrustList.splice(i, 1);
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang='scss'>
.otcOrder {
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__item {
    font-size: 16px;
  }
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 0 15px;
  }
}
</style>
<style lang="less" scoped>
</style>