<template>
  <div class v-if="initInfo">
    <div v-if="(!nickName||!isRenzheng)" class="tips">
      <!-- 在开始交易之前，您需要完善必要的交易信息。 -->
      {{ $t('otc.otc_tip3') }}
      <span class="blue pointer" @click="toFill">{{ $t('otc.otc_tip4') }}</span>
    </div>
    <div class="menu">
      <el-tabs v-model="type" :before-leave="switchTab">
        <el-tab-pane :label="$t('otc.buy')"></el-tab-pane>
        <el-tab-pane :label="$t('otc.sell')"></el-tab-pane>
      </el-tabs>
      <el-tabs v-model="subTabType">
        <el-tab-pane :label="item.currency" v-for="(item,i) in tabList" :key="i"></el-tab-pane>
      </el-tabs>
    </div>
    <el-table :data="orderList" style="width: 100%" :empty-text="$t('common.nodata')">
      <el-table-column :label="$t('otc.nickname')" width="180">
        <template slot-scope="scope">
          <span class="leftIcon">{{ scope.row.memberFbName|subStrings(1) }}</span>
          <span class="c222">{{scope.row.memberFbName}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.num')" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.num|SubString(8)}}{{scope.row.currency}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('otc.xiane')" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.minPrice|SubString(2)}}-{{(scope.row.nowPrice*scope.row.num)|SubString(2)}} CNY</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('otc.danjia')" width="180">
        <template slot-scope="scope">
          <span class="blue size16">{{scope.row.nowPrice|SubString(2)}} CNY</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('otc.pay_way')" width="180">
        <template slot-scope="scope">
          <img
            src="../../assets/images/bankCard.png"
            alt
            srcset
            class="wid24 hei24 mar-r-6"
            v-if="scope.row.payType.indexOf('BANKCARD')>=0"
          />
          <img
            src="../../assets/images/weixin.png"
            alt
            srcset
            class="wid24 hei24 mar-r-6"
            v-if="scope.row.payType.indexOf('WECHAT')>=0"
          />
          <img
            src="../../assets/images/zhifubao.png"
            alt
            srcset
            class="wid24 hei24 mar-r-6"
            v-if="scope.row.payType.indexOf('ALIAY')>=0"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('contract.caocuo')">
        <template slot-scope="scope">
          <el-button type="primary" @click="goBuy(scope.row)" v-if="type==0">{{ $t('otc.buy') }}</el-button>
          <el-button type="primary" @click="goBuy(scope.row)" v-if="type==1">{{ $t('otc.sell') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="v-right mar-t-20"
      v-if="orderList.length>0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 15]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog
      :visible.sync="dialogTableVisible"
      class="transactionPoup"
      @close="close"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <span class="size18 font1 c222">{{type==0?$t('otc.buy'):$t('otc.sell')}} USDT</span>
        <p class="size14 c999 pad-t-3">{{ $t('otc.danjia') }} ￥{{list.nowPrice|SubString(2)}}</p>
      </div>
      <div>
        <div class="tabList size16 mar-t-10 c222">
          <div class="items" @click="operateEvent(1)" :class="{'cur':payType==1}">
            <p class="span">{{type==0?$t('otc.buyTip1'):$t('otc.sellTip1')}}</p>
            <span class="borders"></span>
          </div>
          <div class="items" @click="operateEvent(2)" :class="{'cur':payType==2}">
            <p class="span">{{type==0?$t('otc.buyTip2'):$t('otc.sellTip2')}}</p>
            <span class="borders"></span>
          </div>
        </div>
        <div id="inputBox">
          <div class="inputBox flex align_center" v-if="payType==1">
            <el-input v-model="number" :placeholder="$t('otc.srjg')" class="flex1 size15 c222" type="number"></el-input>
            <span class="size15 c222 font1">CNY</span>
          </div>
          <div class="inputBox flex align_center" v-else>
            <el-input
              v-model="number"
              :placeholder="$t('otc.srsl')"
              class="flex1 size15 c222"
              type="number"
            ></el-input>
            <span class="size15 c222 font1">{{list.current}}</span>
          </div>
        </div>
        <div class="flex bet align_center size14 c999 mar-t-8 font1">
          <span>{{ $t('otc.xiane') }} {{list.minPrice|SubString(2)}}-{{(list.nowPrice*list.num)|SubString(2)}}CNY</span>
          <span class="blue pointer" @click="allPay" v-if="type==0">{{type==0?$t('otc.all_buy'):$t('otc.all_sell')}}</span>
          <span class="blue pointer" @click="allPay" v-if="type==1&&payType==2">{{ $t('otc.all_sell') }}</span>
        </div>
        <div class="flex bet align_center size14 c999 mar-t-15 font1">
          <div>
            <p>{{ $t('otc.jy_num') }}</p>
            <div class="c222 mar-t-2">{{list.num|SubString(4)}} USDT</div>
          </div>
          <div>
            <p>{{ $t('otc.jy_ze') }}</p>
            <div class="c222 mar-t-2">￥{{(list.num*list.nowPrice)|SubString(2)}}</div>
          </div>
        </div>
        <div class="btnBox">
          <div class="btn cancel flex align_center" @click="close">
            {{ $t('common.cancel') }}(
            <count-down :time="time" class="blue" ref="countDown" @finish="countDownFinish" />)
          </div>
          <el-button type="primary" :loading="loading" class="btn" @click="goPay">{{ $t('otc.trade') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import countDown from "../../components/common/countDown";
import { mapActions } from "vuex";
export default {
  name: "trade",
  components: {
    countDown,
  },
  props: ["userInfo"],
  data() {
    return {
      curType: "self", //self 自选交易
      subTabType: 0,
      payType: 1, //1按价格，2按数量
      tabList: [
        {
          currency: "USDT",
        },
      ],
      nowPrice: 0, //当前币种价格
      orderList: [],
      pageNum: 1,
      pageSize: 10,
      nickName: "", //用户昵称
      storeState: "", //商户申请状态
      isRenzheng: false,
      total: 0,
      dialogTableVisible: false,
      list: {},
      type: 0, //0买1卖
      number: null,
      set: null, //资产定时器
      set1: null, //获取下单信息定时
      fabiBalance: {
        fbBalance: 0,
        fbBlockedBalance: 0,
      }, //账户
      time: 60,
      loading: false, //加载中
      index: 0,
      initInfo: this.$store.state.isLogin ? false : true,
    };
  },
  computed: {
    resetUserinfo() {
      return this.$store.state.resetUserinfo;
    },
  },
  watch: {
    userInfo(val) {
      this.initInfo = true;
      if (!val) return;
      this.storeState = val.storeState;
      this.nickName = val.nickName;
      if (val.cardNo == "") {
        this.isRenzheng = false;
      } else {
        this.isRenzheng = true;
      }
    },
    number(val) {
      if (!val) {
        this.number = null;
        return;
      }
      let max = this.getMaxNum();
      let min = this.list.minPrice;
      val = val - max > 0 ? max : val;

      if (this.payType == 1) {
        // console.log(11);
        this.number = this.$util.SubString(val, 2);
      } else {
        this.number = this.$util.SubString(val, 4);
      }
    },
  },
  methods: {
    ...mapActions(["setResetUserinfo", "setOrderId"]),
    switchTab(active, old) {
      if (old == undefined || old == active) return;
      this.pageNum = 1;
      this.orderList = [];
      this.type = active;
      this.getOrderList(); //订单列表
    },
    //完成实名认证
    toFill() {
      if (!this.$util.isLogin()) {
        return;
      }
      if (!this.$util.isNickname(this, this.nickName)) {
        return;
      }
      if (!this.$util.isRenZhengs(this, this.isRenzheng)) {
        return;
      }
    },
    getUserInfo() {
      this.$get("member/member/getMember", {
        member: this.$store.state.userId,
      }).then((res) => {
        if (res.status == "FAILED") {
          this.Toast(res.errorMessage);
        } else if (res.status == "SUCCEED" && res.result) {
          // this.initInfo = true;
          this.storeState = res.result.storeState;
          this.nickName = res.result.nickName;
          this.userInfo = res.result;
          if (res.result.cardNo == "") {
            this.isRenzheng = false;
          } else {
            this.isRenzheng = true;
          }
        }
      });
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
    close() {
      if (this.$refs.countDown) {
        this.$refs.countDown.stop();
      }
      this.loading = false;
      this.dialogTableVisible = false;
      this.number = null;
    },
    handleClose(done) {
      this.$confirm(this.$t('otc.otc_tip5'))
        .then((_) => {
          this.close();
          done();
        })
        .catch((_) => {});
    },
    //倒计时结束时间
    countDownFinish() {
      this.dialogTableVisible = false;
    },
    getBalances() {
      let data = {
        member: this.$store.state.userId,
        currency: this.tabList[this.subTabType].currency,
        coinType: "FB",
      };
      let obj = {
        fbBalance: 0,
        fbBlockedBalance: 0,
      };
      // this.$get("member/balance/getBalances", data).then(res => {
      this.$get("member/balance/getBalanceList", data).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.fabiBalance = res.result.balances[0] || obj;
          this.set = setTimeout(() => {
            this.getBalances();
          }, 5000);
        }
      });
    },
    //交易方式切换
    operateEvent(n) {
      if (n == this.payType) {
        return;
      }
      this.payType = n;
      this.number = null;
    },
    //全部购买
    allPay() {
      this.number = this.getMaxNum();
    },
    getMaxNum() {
      if (this.type == 0) {
        if (this.payType == 1) {
          return this.list.num * this.list.nowPrice;
        } else {
          return this.list.num;
        }
      } else {
        let scaleFbCny = this.fabiBalance.scaleFbCny;
        let fbBalance = this.fabiBalance.fbBalance;
        let minPrice = this.list.minPrice;
        let maxPrice = this.list.num * this.list.nowPrice;
        if (this.payType == 1) {
          return scaleFbCny - minPrice < 0
            ? "0"
            : scaleFbCny - maxPrice > 0
            ? maxPrice
            : scaleFbCny;
        } else {
          return fbBalance - this.list.num > 0 ? this.list.num : fbBalance;
        }
      }
    },
    async goBuy(list) {
      var _this = this;
      if (!this.$util.isLogin()) {
        return;
      }
      if (this.$store.state.userId == list.member) {
        this.$util.Toast(this.$t('otc.otc_tip6'), "warning");
        return;
      }
      if (!this.$util.isNickname(this, this.nickName)) {
        return;
      }

      let res = await this.$post1("otc/order/ownOrderList", {
        priceOrderStatus: "NONPAYMENT",
        userId: this.$store.state.userId,
        page: this.pageNum,
        size: this.pageSize,
      });
      if (res.result && res.result.data && res.result.data.length > 0) {
        this.$confirm(this.$t('otc.otc_tip7'), this.$t('contract.tx'))
          .then(() => {
            _this.$router.push({
              name: "otcOrder",
              params: {
                active: 1,
              },
            });
          })
          .catch(() => {});
        return;
      }
      this.list = list;
      clearTimeout(this.set);
      this.set = null;
      this.getBalances();
      if (this.$refs.countDown) {
        this.$refs.countDown.reset();
      }
      this.dialogTableVisible = true;
    },
    //下单
    goPay() {
      if (!(this.number - 0)) {
        if (this.payType == 1) {
          this.$util.Toast(this.$t('otc.srjg'), "warning");
          return;
        }
        if (this.payType == 2) {
          this.$util.Toast(this.$t('otc.srsl'), "warning");
          return;
        }
      }
      var data = {
        userId: this.$store.state.userId,
        orderId: this.list.id,
        type: this.payType == 1 ? "PRICE" : "NUM",
        num: this.number,
      };
      this.loading = true;
      this.$post1("otc/order/placeAnOrder", data).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          var orderPriceId = res.result.orderPriceId;

          this.getInfo(orderPriceId);
        } else {
          this.loading = false;
          this.$util.Toast(res.errorMessage);
        }
      });
    },
    getInfo(id) {
      this.index = this.index + 1;
      this.$post1("otc/order/orderDetails", {
        priceOrderId: id,
        userId: this.$store.state.userId,
      })
        .then((res) => {
          this.loading = false;
          if (res && res.status == "SUCCEED" && res.result) {
            if (res.result.id) {
              this.close();
              clearTimeout(this.set1);
              setTimeout((ret) => {
                this.setOrderId(res.result.id);
                this.$router.push({
                  path: `/transactionDetail`,
                });
              }, 300);

              return;
            }
          } else {
            if (this.index >= 3) {
              this.loading = false;
              this.close();
              clearTimeout(this.set1);
              this.$util.Toast(this.$t('otc.otc_tip8'), "warning");
            }
          }
          if (this.index >= 3) {
            clearTimeout(this.set1);
            return;
          }
          this.set1 = setTimeout((ret) => {
            this.getInfo(id);
          }, 1000);
        })
        .catch((err) => {
          console.log(this.loading);
          this.loading = false;
        });
    },
    //获取当前价
    getPrice() {
      this.$post1("otc/order/getPrice", {
        currency: this.tabList[this.subTabType].currency,
      }).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.nowPrice = res.result;
        }
      });
    },
    getTabList() {
      this.$post("otc/order/currencyList", {}).then((res) => {
        if (res && res.status == "SUCCEED") {
          this.tabList = res.result;
          this.getPrice(); //当前币种价格
          this.getOrderList(1); //订单列表
          // if (this.$store.state.isLogin) {
          //   clearTimeout(this.set);
          //   this.set = null;
          //   this.getBalances();
          // }
        }
      });
    },
    //获取otc订单记录
    getOrderList(type) {
      var data = {
        page: this.pageNum,
        size: this.pageSize,
        currency: this.tabList[this.subTabType].currency,
        direction: this.type == 0 ? "BUY" : this.type == 1 ? "SELL" : "",
      };
      this.$post1("otc/order/orderList", data)
        .then((res) => {
          if (res && res.status == "SUCCEED" && res.result) {
            this.orderList = res.result.data || [];
            this.total = res.result.total;
            this.pageNum = this.pageNum + 1;
          }
        })
        .catch((err) => {});
    },
  },
  activated() {
    //商户信息
    // this.$store.state.isLogin && this.getUserInfo();
    this.getTabList();
  },
  deactivated() {
    this.pageNum = 1;
    this.initInfo = false;
    clearTimeout(this.set);
    this.set = null;
    this.close();
  },
};
</script>
<style lang="less">
.menu {
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__item {
    font-size: 16px;
  }
}
.transactionPoup {
  .el-dialog__body {
    padding-top: 0;
  }
}
.transactionPoup {
  #inputBox {
    .el-input__inner {
      border: none;
      padding-left: 0;
    }
  }
  .el-dialog {
    width: 500px;
  }
}
</style>
<style lang="less" scoped>
.headers {
  background: #1b2945;
}
.otcHeader {
  width: 1200px;
  margin: 0 auto;
  height: 82px;
  span {
    color: #87a2cd;
    display: block;
    padding-bottom: 10px;
    margin-right: 40px;
    border-bottom: 3px solid transparent;
    &:last-of-type {
      margin-right: 0;
    }
    &:hover {
      color: #fff;
      cursor: pointer;
    }
    &.cur {
      color: #fff;
      border-color: #357ce1;
    }
  }
}
.transactionPoup {
  .tabList {
    height: 40px;
    display: flex;
    align-items: center;
    box-shadow: 0px 0px 10px 0px rgba(121, 121, 121, 0.1);
    .items {
      flex: 1;
      line-height: 40px;
      display: flex;
      justify-content: center;
      position: relative;
      &.cur {
        color: #3d77e0;
        .borders {
          background: #3d77e0;
          transition: all 0.5s;
        }
      }
      .borders {
        position: absolute;
        bottom: 0;
        width: 74px;
        height: 1px;
        background: transparent;
      }
    }
  }
  .inputBox {
    margin-top: 15px;
    height: 45px;
    // background: rgba(246, 249, 254, 1);
    border: 1px solid rgba(192, 215, 253, 1);
    border-radius: 5px;
    padding: 0 10px;
  }
  .btnBox {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    .btn {
      width: 160px;
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      &.cancel {
        background: rgba(226, 237, 255, 1);
        color: #3c78e1;
      }
    }
  }
}
.otc_container {
  width: 1200px;
  margin: 0 auto;
}
.tips {
  margin-top: 40px;
  background: #fff8e3;
  padding: 8px 18px 8px 24px;
  border-radius: 2px;
}
.menu {
  margin-top: 28px;
  margin-bottom: 30px;
}
.leftIcon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-block;
  background: #3c78e1;
  color: #fff;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
}
</style>
