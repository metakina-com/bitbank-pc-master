<template>
  <div class="orders marketRoader">
    <!-- 当前委托/历史委托 -->
    <div class="commission_total">
      <ul class="commission_tab">
        <li
          :class="{active:orderIndex === 0}"
          @click="_setOrderIndex(0)"
        >{{ $t('message.current_commission') }}</li>
        <li
          :class="{active:orderIndex === 1}"
          @click="_setOrderIndex(1)"
        >{{ $t('message.history_commission') }}</li>
      </ul>
      <!-- 当前委托 -->
      <div class="pad-l-r-20 hei400  overflow gundong" >
        <ul>
          <div v-if="orderIndex==1">
            <el-table :data="historyEntrust" :empty-text="$t('common.nodata')">
              <el-table-column fixed prop="date" :label="$t('message.time')">
                <template slot-scope="scope">
                  <span>{{scope.row.createTime|yndhms('M')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pairsName" :label="$t('message.pair')"></el-table-column>
              <el-table-column prop="province" :label="$t('message.type')">
                <template slot-scope="scope">
                  <span
                    :class="scope.row.entrustType=='BUY'?'green':'red'"
                  >{{scope.row.entrustType=='BUY'?$t('contract.buy'):$t('contract.sell')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="province" :label="$t('message.price')">
                <template slot-scope="scope">
                  <span v-if="scope.row.priceType === 'MARKET_PRICE'">{{$t('message.market_price')}}</span>
                  <span v-else>{{scope.row.price|toNumber(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.money')">
                <template slot-scope="scope">
                  <span>{{scope.row.matchCount|toNumber(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.total_balance')">
                <template slot-scope="scope">
                  <span>{{(scope.row.matchFee-scope.row.tradeFee)|toNumber(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.status')">
                <template slot-scope="scope">
                  <span>{{ scope.row.state=='CLOSE'?$t("message.order_status3"):scope.row.state=='FINAL'?$t('message.order_status2'):'' }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div
              v-if="historyEntrust.lenght<=0"
              style="border: none;text-align: center;line-height: 16;color: #999"
            >
              <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                  <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7" />
                  <g fill-rule="nonzero" stroke="#D9D9D9">
                    <path
                      d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
                    />
                    <path
                      d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                      fill="#FAFAFA"
                    />
                  </g>
                </g>
              </svg>
              <span
                style="position: relative;top:24px;left:-63px;text-align: center;color:#9bacbd"
              >NO DATA</span>
            </div>
          </div>
          <div v-else>
            <el-table :data="entrustList" :empty-text="$t('common.nodata')">
              <el-table-column fixed prop="date" :label="$t('message.time')">
                <template slot-scope="scope">
                  <span>{{scope.row.createTime|yndhms('M')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pairsName" :label="$t('message.pair')"></el-table-column>
              <el-table-column prop="province" :label="$t('message.type')">
                <template slot-scope="scope">
                  <span
                    :class="scope.row.entrustType=='BUY'?'green':'red'"
                  >{{scope.row.entrustType=='BUY'?$t('contract.buy'):$t('contract.sell')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="province" :label="$t('message.price')">
                <template slot-scope="scope">
                  <span v-if="scope.row.priceType === 'MARKET_PRICE'">{{$t('message.market_price')}}</span>
                  <span v-else>{{scope.row.price|toNumber(4)}}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('message.money')">
                <template slot-scope="scope">
                  <span>{{scope.row.count|toNumber(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.total_balance')">
                <template slot-scope="scope">
                  <span>{{(scope.row.matchFee-scope.row.tradeFee)|toNumber(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.order_status2')">
                <template slot-scope="scope">
                  <span>{{ Number(scope.row.matchCount).toFixed(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.action')" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="cancelorder(scope.row.id)"
                  >{{$t('message.cancel') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
export default {
  name: "market",
  data() {
    return {
      // 禁止点击
      noClick: false,
      // 当前选中
      orderIndex: 0,
      // 当前委托 历史委托
      orderList: [],
      // 总数 当前委托 历史委托
      totalList: [0, 0],
      timer1: null, //获取当前委托定时
      entrustList: [], //委托列表
      historyEntrust: [], //历史记录
    };
  },
  computed: {
    i18n() {
      return $t("message");
    },
    currentPairsName() {
      return this.$store.state.pairsName;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  watch: {
    currentPairsName: function (val) {
      if (this.timer1) {
        clearTimeout(this.timer1);
      }
      if (this.isLogin) {
        if (this.orderIndex == 0) {
          this.getEntrustList(1);
        } else {
          this.getHistoryEntrust(1);
        }
      }
    },
    isLogin(val) {
      this.isLogin = val;
    },
  },
  created() {
    if (this.$store.state.isLogin) {
      if (this.orderIndex == 0) {
        this.getEntrustList(1);
      } else {
        this.getHistoryEntrust(1);
      }
    } else {
      (this.entrustList = []), //委托列表
        (this.historyEntrust = []); //历史记录
    }
    this.$hub.$on("getList", (res) => {
      window.clearTimeout(this.timer1);
      window.clearTimeout(this.timer2);
      if (this.isLogin) {
        if (this.orderIndex == 0) {
          this.getEntrustList();
        } else {
          this.getHistoryEntrust();
        }
      }
    });
    // this._getOrderList();
  },
  methods: {
    //获取委托列表
    getEntrustList(type) {
      let pairsName = this.currentPairsName;
      var loading;
      if (type) {
        // loading = this.$util.showLoading();
      }
      this.$get("entrust/entrust/getEntrustList", {
        member: this.$store.state.userId,
        pairsName: pairsName,
      })
        .then((res) => {
          // if (loading) loading.close();
          if (res && res.status == "SUCCEED") {
            this.entrustList = res.result || [];
            if (this.isLogin) {
              this.timer1 = setTimeout((res) => {
                this.getEntrustList();
              }, 5000);
            }
          }
        })
        .catch((err) => {
          // if (loading) loading.close();
          if (this.isLogin) {
            this.getEntrustList();
          }
        });
    },
    //获取历史记录
    getHistoryEntrust(type) {
      let pairsName = this.currentPairsName;
      var loading;
      if (type) {
        // loading = this.$util.showLoading();
      }
      this.$get("entrust/entrust/getHistoryEntrust", {
        member: this.$store.state.userId,
        pairsName: "",
        // pairsName: pairsName
      })
        .then((res) => {
          // if (loading) loading.close();
          if (res && res.status == "SUCCEED") {
            this.historyEntrust = res.result || [];
            if (this.isLogin) {
              this.timer1 = setTimeout((res) => {
                this.getHistoryEntrust();
              }, 5000);
            }
          }
        })
        .catch((err) => {
          // if (loading) loading.close();
          if (this.isLogin) {
            this.getHistoryEntrust();
          }
        });
    },
    //撤单
    cancelorder(id) {
      if (!this.$util.isLogin()) {
        return;
      }
      this.$confirm("是否确认撤销订单?", "提醒")
        .then(() => {
          //   this.$util.showLoading();
          let loading = this.$util.showLoading();
          this.$post1("entrust/entrust/closeEntrust", {
            entrust: id,
          })
            .then((res) => {
              //   this.Toast.clear();
              loading.close();
              if (res && res.status == "SUCCEED") {
                if (res.result == true) {
                  this.$util.Toast("撤销订单成功", "success");
                  this.entrustList.forEach((item, i) => {
                    if (item.id == id) {
                      this.entrustList.splice(i, 1);
                    }
                  });
                }
              } else {
                this.$util.Toast(res.errorMessage);
              }
            })
            .catch((err) => {
              //   this.Toast.clear();
              loading.close();
            });
        })
        .catch(() => {});
    },

    // 取消委托 当前委托/历史委托
    _cancelOrder(index) {
      if (this.noClick) {
        return;
      }
      let order = this.orderList[this.orderIndex];
    },
    // 切换 当前委托/历史委托
    _setOrderIndex(index) {
      if (!this.$util.isLogin()) {
        return;
      }
      if (this.orderIndex !== index) {
        if (this.timer1) clearTimeout(this.timer1);
        this.orderIndex = index;
        if (index == 0) {
          this.getEntrustList(1); //委托列表
        } else {
          this.getHistoryEntrust(1); //历史列表
        }
      }
    },
  },
  destroyed() {
    if (this.timer1) {
      clearTimeout(this.timer1);
    }
  },
};
</script>
<style lang="less">
.marketRoader {
  .el-table,
  .el-table__expanded-cell {
    background: transparent !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #33363e;
  }
  .el-table {
    color: rgb(176, 184, 219);
  }
  .el-table th,
  .el-table tr {
    background: transparent !important;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: #606266 !important;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    background: #606266 !important;
  }
  .el-table tbody tr:hover > td {
    background-color: transparent !important;
  }
  .hover-row {
    background: transparent !important;
  }
  .el-table tbody tr.hover-row > td {
    background-color: transparent;
  }
}
</style>
<style lang="less" scoped>
.orders {
  //   background: #252732;

  // 当前委托 历史委托
  .commission_total {
    min-height: 280px;

    .commission_tab {
      //   background: #292d39;
      height: 46px;
      line-height: 46px;
      font-weight: 500;
      color: #9bacbd;
      font-size: 14px;
      cursor: pointer;

      li {
        display: inline-block;
        padding: 0 20px;

        &.active {
          color: #17a7f3;
          //   background-color: #252732;
        }
      }
    }

    .commTabalBar {
      height: 46px;
      line-height: 46px;
      font-weight: 500;
      color: #9bacbd;
      font-size: 14px;
      padding: 0 20px;
      display: flex;
    }

    .comm_last_child {
      width: 10%;
    }

    .comm_last_child:hover {
      cursor: pointer;
      color: #17a7f3;
    }

    .activeTab:hover {
      //   background: #292d39;
      //   color: #fff;
    }
  }
}
</style>
