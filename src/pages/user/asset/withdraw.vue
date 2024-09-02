<template>
  <div class="margin-right-bar" style="overflow: hidden;">
    <h2 class="recharge-header">
      <!-- <router-link to="/user/assets/balances" class="pointer blue" style="color: #357ce1;">资产 ></router-link>
      <span class="size16">{{ $t('message.withdraw') }}</span>-->
      <el-page-header @back="goBack" :content="$t('message.withdraw')" title></el-page-header>
    </h2>
    <div class="recharge-details bg-fff min-hei400 mar-b-20">
      <div v-if="isLoading" class="flex1">
        <span class="el-icon-loading loading"></span>
      </div>
      <div class="details-left mar-b-20" v-else>
        <p class="flex_bet align-center pointer" @click="switchCurrency">
          币种
          <!-- <span class="mar-l-15 mar-r-15 flex1 v-right">{{currency}}</span> -->
          <chooseCoin
            @input="chooseCoins"
            :balanceList="tabList"
            :currency="currency"
            class="flex1 mar-l-30"
            v-if="currency"
          ></chooseCoin>
          <!-- <i class="el-icon-arrow-right"></i> -->
        </p>
        <div v-if="currency=='USDT'">
          <p class="size12 mar-t-20 c999">链名称</p>
          <div class="flex align-center mar-t-20">
            <span
              v-for="(item,i) in actions"
              :key="i"
              class="radios"
              :class="{'cur':item.name==names}"
              @click="switchName(item.name)"
            >{{item.name}}</span>
          </div>
        </div>
        <div>
          <p class="size12 mar-t-20 c999">提币地址</p>
          <div class="flex align-center mar-t-10">
            <el-input placeholder v-model="address" clearable type="text"></el-input>
          </div>
        </div>
        <div>
          <p class="size12 mar-t-20 c999 flex_bet">
            数量
            <span>
              可用：
              <span class="blue">{{wallets.money+currency}}</span>
            </span>
          </p>
          <div class="flex align-center mar-t-10">
            <el-input placeholder v-model="coinNum" clearable type="number"></el-input>
          </div>
        </div>
        <div>
          <div class="size12 mar-t-20 c999 flex">
            <div class="flex1 flex_bet mar-r-20">
              <span>手续费</span>
            </div>
            <div class="flex1 flex_bet">
              <span>到账数量</span>
            </div>
          </div>
          <div class="flex align-center mar-t-10">
            <div class="flex1 flex_bet mar-r-20 group">
              <span>{{wallets.fee|SubString(4)}}</span>
              <span>{{currency}}</span>
            </div>
            <div class="flex1 flex_bet group">
              <span>{{wallets.actuals|SubString(4)}}</span>
              <span>{{currency}}</span>
            </div>
          </div>
        </div>
        <div class="flex mar-t-20 pad-t-10">
          <div class="flex1">
            <p class="size12 c999">温馨提示</p>
            <div class="mask-info">
              <!-- v-if="names=='OMNI'" -->
              <p>
                <i class="el-icon-warning"></i>
                提现手续费：{{wallets.fee+currency}}。
              </p>
              <!-- <p v-else>* 最小充值金额：10.0USDT,小于最小金额的充值将不会到账。</p> -->
              <p>
                <i class="el-icon-warning"></i>
                最小提现金额：{{ disableWithdrawCoin ? "0.00" : min_withdraw_value+currency }}。
              </p>
              <p>
                <i class="el-icon-warning"></i> 为保障资金安全，当您账户安全策略变更，密码修改，我们会对提币进行人工审核，请耐心等待。请务必确认电脑及浏览器安全，防止信息被篡改或泄露。
              </p>
            </div>
          </div>
          <div class="pad-l-100">
            <el-button
              type="primary"
              class="wid200 hei48 size16"
              v-if="disableWithdrawCoin"
              disabled
            >禁止提币</el-button>
            <el-button
              type="primary"
              class="wid200 hei48 size16"
              @click="submit"
              v-else
              :loading="loading"
            >提币</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueQr from "vue-qr";

import chooseCoin from "../../../components/common/chooseCoin";
export default {
  name: "recharge",
  components: {
    vueQr,
    chooseCoin,
  },
  data() {
    return {
      currency: "", //当前币种
      actions: [
        {
          name: "ERC20",
        },
        {
          name: "OMNI",
        },
      ],
      rechangeList: [
        {
          name: "BTC",
          value: 0.001,
        },
        {
          name: "ETH",
          value: 0.01,
        },
        {
          name: "EOS",
          value: 0.5,
        },
        {
          name: "BCH",
          value: 0.01,
        },
        {
          name: "LTC",
          value: 0.01,
        },
        {
          name: "DASH",
          value: 0.01,
        },
        {
          name: "XRP",
          value: 10,
        },
      ],
      min_withdraw_value: 0, //最小提币数
      copyAddress: "",
      names: "ERC20",
      address: "", //地址
      coinNum: "", //数量
      wallets: {
        money: 0, //最大提币数
        fee: 0,
        actuals: 0, //实际到账金额
      },
      loading: false,
      isRenzhang: false, //是否实名
      tabList: [],
      isLoading: false,
    };
  },
  computed: {
    disableWithdrawCoin() {
      return this.min_withdraw_value < 0 ? true : false;
    },
    userId() {
      return this.$store.state.userId;
    },
    chooseCurrency() {
      return this.$store.state.chooseCurrency;
    },
  },
  activated() {
    this.getBalances(1);
    this.getUserInfo();
    this.isLoading = true;
  },
  deactivated() {
    this.address = ""; //地址
    this.coinNum = ""; //数量
    this.currency = "";
    this.isLoading = false;
  },
  watch: {
    coinNum: function (val) {
      val = val + "";
      if (!val) {
        this.wallets.actuals = 0;
        return;
      }
      if (parseFloat(val) < 0) {
        return (this.coinNum = 0);
      }
      this.coinNum = this.$util.SubString(val, 4);
      if (this.coinNum - this.wallets.fee >= 0) {
        this.wallets.actuals =
          (this.coinNum * 1000000 - this.wallets.fee * 1000000) / 1000000;
      } else {
        this.wallets.actuals = 0;
      }
    },
    address(val) {
      this.address = val.replace(/\s+/g, "");
    },
  },
  methods: {
    // 币种选择
    chooseCoins(data) {
      if (data == this.currency) return;
      this.currency = data;
      this.getRechargeMinLimit();
      this.getHandling();
      this.getBalances();
    },
    goBack() {
      this.$router.go(-1);
    },
    switchName(name) {
      if (name == this.names) return;
      this.names = name;
      this.coinNum = ""; //数量
      this.getRechargeMinLimit();
      this.getHandling();
    },

    //选择币种
    switchCurrency() {
      this.$router.push("/user/assets/balances");
    },
    //提币操作
    submit() {
      var _this = this;
      let currency =
        this.currency == "USDT"
          ? this.names == "ERC20"
            ? "USDT/ERC20"
            : "USDT/OMNI"
          : this.currency;
      var reg = /^0x[A-Za-z\d]{40}$/; //ETH HJGX USDT(erc20协议)
      var reg1 = /^[1|3][A-Za-z\d]{33}$/; //.BTC BCH BSV BCHBSV USDT(omni协议)
      var reg2 = /^L[A-Za-z\d]{33}$/; //LTC
      let coinNum = parseFloat(this.coinNum);
      // if (this.currency == "USDT") {
      //   if (!reg.test(this.address) && !reg1.test(this.address)) {
      //     this.Toast("请输入正确的地址");
      //     return;
      //   }
      // }

      if (
        this.currency == "ETH" ||
        this.currency == "HJGX" ||
        (this.currency == "USDT" && this.names == "ERC20")
      ) {
        if (!reg.test(this.address)) {
          this.$util.Toast("请输入正确的地址", "warning");
          return;
        }
      }
      if (
        this.currency == "BTC" ||
        this.currency == "BCH" ||
        this.currency == "BSV" ||
        this.currency == "BCHBSV" ||
        (this.currency == "USDT" && this.names == "OMNI")
      ) {
        if (!reg1.test(this.address)) {
          this.$util.Toast("请输入正确的地址", "warning");
          return;
        }
      }
      if (this.currency == "LTC") {
        if (!reg2.test(this.address)) {
          this.$util.Toast("请输入正确的地址", "warning");
          return;
        }
      }

      if (!this.address) {
        this.$util.Toast("请输入正确的地址", "warning");
        return;
      }
      if (!coinNum) {
        this.$util.Toast("请输入提币金额", "warning");
        this.coinNum = "";
        return;
      }
      if (this.coinNum - this.min_withdraw_value < 0) {
        this.$util.Toast(
          "最小提币数量为" + this.min_withdraw_value + this.currency + "！"
        );
        return;
      }

      if (coinNum - this.wallets.money > 0) {
        this.$util.Toast("超出最多金额！", "warning");
        return;
      }
      if (!this.isRenzhang) {
        this.$confirm("当前未实名认证，去认证", "提醒")
          .then(() => {
            // _this.$router.push("/realname");
          })
          .catch(() => {});
        return;
      }
      let data = {
        member: this.userId,
        balance: this.coinNum,
        currency: currency || "",
        wallet: this.address,
      };
      this.loading = true;
      this.$post1("member/balance/extractCoin", data)
        .then((res) => {
          this.loading = false;
          if (res && res.status == "SUCCEED") {
            if (res.result == true) {
              this.$util.Toast("提币成功", "success");
              setTimeout((res) => {
                // this.$router.push({
                //   path: `/assets/withdrawCoinSuccess?balance=${this.wallets.actuals}&currency=${this.currency}`
                // });
              }, 300);
            } else {
              this.$util.Toast(res.errorMessage);
            }
          } else {
            this.$util.Toast(res.errorMessage);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getUserInfo() {
      this.$get("member/member/getMember", {
        member: this.$store.state.userId,
      }).then((res) => {
        if (res.status == "FAILED") {
          this.$util.Toast(res.errorMessage);
        } else if (res.status == "SUCCEED" && res.result) {
          let data = res.result;
          if (data.cardNo == "") {
            this.isRenzhang = false;
          } else {
            this.isRenzhang = true;
          }
        }
      });
    },
    //查询资产列表
    getBalances(init) {
      let data = {};
      if (init) {
        data = {
          member: this.userId,
          balanceType: "BALANCE_BB",
        };
      } else {
        data = {
          member: this.userId,
          balanceType: "BALANCE_BB",
          currency: this.currency,
        };
      }
      this.$get("member/balance/getBalances", data).then((res) => {
        this.isLoading = false;
        if (res && res.status == "SUCCEED" && res.result) {
          let iindex = "";
          res.result.forEach((ele, i) => {
            if (ele.currency == "BTC") {
              iindex = i;
            }
          });

          if (init) {
            this.currency =
              this.chooseCurrency ||
              (res.result[iindex] && res.result[iindex].currency
                ? res.result[iindex].currency
                : "");
            this.getRechargeMinLimit();
            this.getHandling();
            this.tabList = res.result;
            // this.rechangeList.map((item, i) => {
            //   if (item.name == this.currency) {
            //     this.index = i;
            //     this.wallets.fee = item.fee;
            //     this.min_withdraw_value = item.value;
            //   }
            // });
            this.getBalances();
          } else {
            this.wallets.money =
              res.result[0] && res.result[0].balance
                ? res.result[0].balance
                : 0; //可提币金额
            this.wallets.money = this.$util.SubString(this.wallets.money, 4);
          }
        }
      }).catch(err=>{
        this.isLoading = false;
      });
    },
    //获取最小提币额
    getRechargeMinLimit() {
      let currency =
        this.currency == "USDT"
          ? this.names == "ERC20"
            ? "USDT/ERC20"
            : "USDT/OMNI"
          : this.currency;
      this.$get("member/quota/extract_min_limit", {
        currency: currency,
      }).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          // this.copyAddress = res.result.wallet || "";
          this.min_withdraw_value = res.result || 0;
        } else {
          this.rechangeList.map((item, i) => {
            if (item.name == this.currency) {
              this.min_withdraw_value = item.value;
            }
          });
        }
      });
    },
    //获取最小提币手续费
    getHandling() {
      let currency =
        this.currency == "USDT"
          ? this.names == "ERC20"
            ? "USDT/ERC20"
            : "USDT/OMNI"
          : this.currency;
      this.$get("member/quota/extract_handling", {
        currency: currency,
      }).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.wallets.fee = res.result || 0;
        } else {
          this.rechangeList.map((item, i) => {
            if (item.name == this.currency) {
              this.wallets.fee = item.fee;
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.copy {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  word-break: break-all;
  line-height: 28px;
  max-width: 60%;
}
.group {
  background-color: #f9f7fd;
  height: 48px;
  border-radius: 3px;
  padding-left: 20px;
  padding-right: 20px;
  line-height: 48px;
  font-size: 16px;
  color: #9194a4;
  font-weight: 500;
}
.radios {
  cursor: pointer;
  background: #f9f7fd;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: block;
  min-width: 146px;
  padding: 0 30px;
  height: 48px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid transparent;
  margin-right: 20px;
  border-radius: 3px;
  font-size: 16px;
  line-height: 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
  &.cur {
    border-color: #357ce1;
    color: #357ce1;
  }
}
.margin-right-bar {
  // padding: 40px 20px 30px;
  overflow: hidden;

  .recharge-header {
    font-weight: 500;
    background: #fff;
    padding: 15px 30px;
    margin: 20px 0 0;
  }

  .recharge-details {
    display: flex;
    margin-top: 20px;
    .details-left {
      padding: 20px 30px;
      background: #fff;
      width: 100%;
      .txColoe_1 {
        color: #999;
        padding: 6px 0;

        span {
          color: #fff;
        }
      }

      .mask-info {
        margin-top: 10px;
        width: 80%;
        color: #999;
        font-size: 12px;
        p {
          line-height: 20px;
        }
      }
    }
  }

  .recharge_content {
    .header_router {
      float: right;
      margin-right: 6px;
    }
    .recharge-table {
      // min-height: 500px;
      padding: 20px;
      margin-bottom: 20px;
      .table-title {
        display: flex;
        border-bottom: 1px solid #f4f4f6;
        padding-bottom: 16px;
        .txColoe_1 {
          padding-left: 20px;
        }
      }
      .table_ul {
        .li_sty {
          text-align: center;
        }
      }
    }
  }
}
</style>
