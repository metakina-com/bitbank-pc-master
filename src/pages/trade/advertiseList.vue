<template>
  <div class>
    <div v-if="storeState=='WAIT'" class="flex flex-column align_center">
      <img src="../../assets/images/examine.png" alt srcset class="mar-t-60 wid160 hei160" />
      <div class="size20 c222 bold mar-t-40">商户认证审核中</div>
    </div>
    <div v-if="storeState=='PASS'" class="mar-b-140">
      <!-- <el-tabs v-model="subTabType" class="mar-t-30">
        <el-tab-pane :label="item.currency" v-for="(item,i) in tabList" :key="i"></el-tab-pane>
      </el-tabs>-->
      <div class>
        <div class="recharge-table mar-t-30">
          <div class="table-title flex size14 pad-t-b-15">
            <p class="tb_items wids">交易方向</p>

            <p class="tb_items wids">单价</p>
            <p class="tb_items wids">数量</p>
            <p class="tb_items wids">已成交金额</p>
            <p class="tb_items wids">未成交金额</p>
            <p class="tb_items wids">状态</p>
            <p class="flex1 wids">发布时间</p>
            <p class="flex1 wids">操作</p>
          </div>

          <ul class="table_ul">
            <div v-if="isLoading">
              <span class="el-icon-loading loading"></span>
            </div>
            <div>
              <div v-if="orderList.length>0">
                <li
                  class="brColor_1 state_li flex pad-t-b-15"
                  v-for="(item,i) of orderList"
                  :key="i"
                >
                  <!-- 币种 -->
                  <div class="tb_items wids">
                    <span class="" v-if="item.direction=='SELL'">卖出{{item.currency}}</span>
                    <span class="" v-else>买入{{item.currency}}</span>
                  </div>
                  <!-- 单价 -->
                  <div class="tb_items wids">
                    <span class="blue font1">￥{{item.nowPrice|SubString(2)}}</span>
                  </div>
                  <!-- 数量 -->
                  <div class="tb_items wids">
                    <span>{{item.num|SubString(4)}}</span>
                  </div>
                  <!-- 已成交金额 -->
                  <div class="tb_items wids">
                    <span>{{item.dealNum|SubString(4)}}</span>
                  </div>
                  <!-- 未成交金额 -->
                  <div class="tb_items wids">
                    <span>{{(item.num*item.nowPrice)|SubString(2)}}</span>
                  </div>
                  <!-- 状态 -->
                  <div class="tb_items wids">
                    <span class="blue font1" v-if="item.status=='NORMAL'">生效中</span>
                    <span class="c666 font1" v-if="item.status=='BACKOUT'">已撤销</span>
                  </div>
                  <!-- 发布时间 -->
                  <div class="flex1 wids">
                    <span>{{item.createTime|yndhms('M')}}</span>
                  </div>
                  <!-- 操作 -->
                  <div class="flex1 flex wids">
                    <div
                      class="flex align_center mar-r-15 pointer"
                      @click.stop="goaAvertisement('edit',item)"
                      v-if="item.status=='NORMAL'"
                    >
                      <img
                        src="../../assets/images/edit1.png"
                        alt
                        srcset
                        class="wid16 hei16 mar-r-4"
                      />
                      <span class="size13">编辑</span>
                    </div>
                    <div
                      class="flex align_center pointer"
                      v-if="item.status=='NORMAL'"
                      @click.stop="revokeEvent(item.id,i)"
                    >
                      <img
                        src="../../assets/images/reset.png"
                        alt
                        srcset
                        class="wid16 hei16 mar-r-4"
                      />
                      <span class="size13">撤销</span>
                    </div>
                  </div>
                </li>
              </div>
              <li v-else class="li_sty">
                <nodata class="mar-t-50" />
              </li>
            </div>
          </ul>
        </div>
        <el-pagination
          v-show="orderList.length>0"
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "advertiseList",
  components: {},
  props: ["userInfo"],
  data() {
    return {
      orderList: [],
      pageNum: 1,
      pageSize: 10,
      storeState: "", //商户申请状态
      total: 0,
      type: 0, //0够买广告1出售广告
      currency: "",
      balance: "",

      chooseArr: [],
      isLoading: false,
    };
  },
  computed: {
    chooseCurrency() {
      return this.$store.state.chooseCurrency;
    },
    payType() {
      this.chooseArr = this.$store.state.payType;
      return this.$store.state.payType;
    },
    // userInfo(val) {
    //   if (!val) return;
    //   this.storeState = val.storeState;
    // },
  },
  watch: {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getOrderList();
    },
    //撤销广告
    revokeEvent(id, index) {
      var _this = this;
      if (!id) {
        return;
      }
      this.$confirm("是否确认撤销广告?")
        .then(() => {
          _this
            .$post1("otc/order/orderBack", {
              userId: _this.$store.state.userId,
              orderId: id,
            })
            .then((res) => {
              if (res.status == "FAILED") {
                _this.Toast(res.errorMessage);
              } else if (res.status == "SUCCEED" && res.result) {
                _this.$util.Toast("撤销广告成功", "success");
                // _this.orderList.splice(index, 1);
                _this.orderList[index].status = "BACKOUT";
              }
            });
        })
        .catch(() => {});
    },
    //获取otc订单记录
    getOrderList() {
      var data = {
        page: this.pageNum,
        size: this.pageSize,
        userId: this.$store.state.userId,
      };
      this.$post1("otc/order/merchantsOrders", data)
        .then((res) => {
          if (res && res.status == "SUCCEED" && res.result) {
            this.orderList = res.result.data || [];
            this.total = res.result.total;
            this.pageNum = this.pageNum + 1;
          }
        })
        .catch((err) => {});
    },
    //广告
    goaAvertisement(type, item) {
      if (type == "edit") {
        this.$GLOBAL.setAdvertiseDetail(item);
        this.$router.push({
          path: `/trade/merchantAudit`,
        });
      }
    },
  },
  activated() {
    setTimeout((res) => {
      this.storeState = this.userInfo ? this.userInfo.storeState : "";
      if (this.storeState != "WAIT" && this.storeState != "PASS") {
        this.$util.Toast("您当前还不是商户，请先申请成为商户", "warning");
        setTimeout((res) => {
          this.$router.go(-1);
        }, 1000);
      }
    }, 300);
    this.getOrderList();
  },
  deactivated() {
    this.pageNum = 1;
  },
};
</script>
<style lang="less">
</style>
<style lang="less" scoped>
/deep/.el-tabs__nav-wrap::after {
  display: none;
}
/deep/.el-tabs__item {
  font-size: 16px;
}
/deep/.el-input__suffix {
  height: 100%;
}
/deep/.el-input__suffix-inner {
  display: flex;
  align-items: center;
  margin-right: 5px;
  height: 100%;
  color: #333;
}
.tb_items {
  padding: 0 10px;
  &.wids {
    width: 12%;
  }
}
.table-title {
  border-bottom: 1px solid #ebeef5;
}
.state_li {
  border-bottom: 1px solid #ebeef5;
  &:last-of-type {
    border: none;
  }
  &:hover {
    background: #f5f7fa;
  }
}
</style>
