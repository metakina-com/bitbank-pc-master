<template>
  <div class="otcOrder">
    <el-tabs v-model="type" class="pad-t-30 pad-b-30" :before-leave="switchTab">
      <el-tab-pane label="未完成"></el-tab-pane>
      <el-tab-pane label="已完成"></el-tab-pane>
      <el-tab-pane label="已取消"></el-tab-pane>
    </el-tabs>
    <div v-if="isLoading">
      <span class="el-icon-loading loading"></span>
    </div>
    <div v-else>
      <el-table :data="orderList" style="width: 100%" @row-click='goDetail' :empty-text="$t('common.nodata')">
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
            <span class>{{scope.row.price|SubString(2)}} CNY</span>
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
            <span v-else>{{scope.row.storeDirection=='SELL'?'卖出':'买入'}}{{scope.row.currency}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span class>{{scope.row.createTime|yndhms('M')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="orderList.length>0"
        class="v-right mar-t-20 pad-b-20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  components: {},
  data() {
    return {
      type: 0,
      pageNum: 1,
      pageSize: 10,
      orderList: [],
      total: 0,
      isLoading: false,
    };
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
  },
  watch: {
    // type(val) {
    //   this.pageNum = 1;
    //   this.getOrderList();
    // }
  },
  activated() {
    this.getOrderList(1);
  },
  methods: {
     ...mapActions(["setOrderId"]),
    //去详情
    goDetail(row) {
      this.setOrderId(row.id);
      this.$router.push({
        path: `/transactionDetail`
      });
    },
    switchTab(active, old) {
      if (old == undefined || old == active) return;
      this.pageNum = 1;
      this.type = active;
      this.getOrderList(1);
    },
    getOrderList(type) {
      if (type) this.isLoading = true;
      this.$post1("otc/order/ownOrderList", {
        priceOrderStatus:
          this.type == 0 ? "NONPAYMENT" : this.type == 1 ? "FINISH" : "CALLOFF",
        userId: this.$store.state.userId,
        page: this.pageNum,
        size: this.pageSize,
      })
        .then((res) => {
          this.isLoading = false;
          if (res && res.status == "SUCCEED" && res.result) {
            this.orderList = res.result.data || [];
            this.total = res.result.total;
            this.pageNum = this.pageNum + 1;
          }
        })
        .catch((err) => {
          this.isLoading = false;
        });
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
      this.pageNum = 1;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getOrderList();
    },
  },
  deactivated() {
    this.pageNum = 1;
  },
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