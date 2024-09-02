<template>
  <div class="margin-right-bar" style="overflow: hidden;">
    <h2 class="recharge-header align-center">
      <!-- <router-link to="/user/assets/balances" class="pointer blue" style="color: #357ce1;">资产 ></router-link>
      <span class="size16">{{ $t('message.recharge') }}</span>-->
      <el-page-header @back="goBack" :content="$t('message.recharge')" title></el-page-header>
    </h2>

    <div class="recharge-details min-hei400 bg-fff">
      <div v-if="isLoading" class="flex1">
        <span class="el-icon-loading loading"></span>
      </div>
      <div class="details-left" v-else>
        <p class="flex_bet align-center pointer wid400" @click="switchCurrency">
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
        <p class="size12 mar-t-20 c999">充币地址</p>
        <div class="flex align-center mar-t-20">
          <span class="min-wid500 copy">{{copyAddress}}</span>
          <span
            class="cobyOrderSn blue pointer"
            v-if="copyAddress"
            @click="copythat(copyAddress)"
            data-clipboard-action="copy"
            :data-clipboard-text="copyAddress"
          >复制</span>
          <span class="blue pointer" v-else>复制</span>
          <el-dropdown class="mar-l-25" trigger="click">
            <span class="el-dropdown-link blue pointer">二维码</span>
            <el-dropdown-menu slot="dropdown">
              <div class="pad-l-r-10">
                <vue-qr :text="copyAddress" :size="140" class="qrcode"></vue-qr>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <p class="size12 mar-t-20 c999">温馨提示</p>
        <div v-if="currency=='USDT'" class="mask-info size12 c999">
          <!-- v-if="names=='OMNI'" -->
          <p>
            <i class="el-icon-warning"></i>
            最小充值金额：{{min_rechange_value}}{{currency}},小于最小金额的充值将不会到账。
          </p>
          <!-- <p v-else>* 最小充值金额：10.0USDT,小于最小金额的充值将不会到账。</p> -->
          <p>
            <i class="el-icon-warning"></i>
            请勿向上述地址充值任何非{{currency}}资产，否则资产将不可找回。
          </p>
          <p>
            <i class="el-icon-warning"></i> 请您确保已区分 OMNI和 ERC20协议的充值地址，避免造成不必要的损失。
          </p>
        </div>
        <div v-else class="mask-info size12 c999">
          <p>
            <i class="el-icon-warning"></i>
            最小充值金额：{{min_rechange_value}}{{currency}},小于最小金额的充值将不会到账。
          </p>
          <p>
            <i class="el-icon-warning"></i>
            请勿向上述地址充值任何非{{currency}}资产，否则资产将不可找回。
          </p>
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
      options: [],
      drawList: [],
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
      min_rechange_value: 0, //最小充币数
      copyAddress: "",
      names: "ERC20",
      capitalRecordsList: [], //资金记录列表
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tabList: [],
      isLoading: false,
    };
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
    chooseCurrency() {
      return this.$store.state.chooseCurrency;
    },
  },
  activated() {
    this.isLoading=true;
    this.getBalances();
  },
  deactivated() {
    this.currency = "";
     this.isLoading=false;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    copythat: function (text) {
      var self = this;
      if (!text) {
        return self.$util.Toast("复制失败");
      }
      let clipboard = new this.clipboard(".cobyOrderSn");
      clipboard.on("success", function () {
        self.$util.Toast("复制成功", "success");
      });
      clipboard.on("error", function () {
        self.$util.Toast("复制失败");
      });
    },
    switchName(name) {
      if (name == this.names) return;
      this.names = name;
      this.getUsdtAddress();
      this.getRechargeMinLimit();
    },
    // 币种选择
    chooseCoins(data) {
      if (data == this.currency) return;
      this.currency = data;
      this.getRechargeMinLimit();
      // this.popShow =
      //     this.currency == "USDT" && this.names == "ERC20" ? true : false;
      if (this.currency == "USDT") {
        this.getUsdtAddress();
      } else {
        this.initData();
      }
    },
    //选择币种
    switchCurrency() {
      this.$router.push("/user/assets/balances");
    },
    //查询资产列表
    getBalances() {
      let data = {
        member: this.userId,
        balanceType: "BALANCE_BB",
      };
      this.$get("member/balance/getBalances", data).then((res) => {
         this.isLoading=false;
        if (res && res.status == "SUCCEED" && res.result) {
          let iindex = "";
          res.result.forEach((ele, i) => {
            if (ele.currency == "USDT") {
              iindex = i;
            }
          });
          this.currency = this.chooseCurrency
            ? this.chooseCurrency
            : res.result[iindex]
            ? res.result[iindex].currency
            : "";
          this.tabList = res.result;

          this.getRechargeMinLimit();
          // this.popShow =
          //     this.currency == "USDT" && this.names == "ERC20" ? true : false;
          if (this.currency == "USDT") {
            this.getUsdtAddress();
          } else {
            this.initData();
          }
          // this.initData();
        }
      }).catch(err=>{
         this.isLoading=false;
      });
    },
    //当前是usdt时
    getUsdtAddress() {
      let data = {
        member: this.userId,
        type: this.names,
      };
      this.$get("member/balance/getUsdtWallet", data).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.copyAddress = res.result.wallet || "";
        }
      });
    },
    //获取充币地址
    initData() {
      let data = {
        member: this.userId,
        currency: this.currency,
      };
      this.$get("member/balance/getWallet", data).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.copyAddress = res.result.wallet || "";
        }
      });
    },
    //获取充值最小值
    getRechargeMinLimit() {
      let currency =
        this.currency == "USDT"
          ? this.names == "ERC20"
            ? "USDT/ERC20"
            : "USDT/OMNI"
          : this.currency;
      this.$get("member/quota/recharge_min_limit", {
        currency: currency,
      }).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          // this.copyAddress = res.result.wallet || "";
          this.min_rechange_value = res.result || 0;
        } else {
          this.rechangeList.map((item) => {
            if (item.name == this.currency) {
              this.min_rechange_value = item.value;
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
        width: 80%;
        margin-top: 10px;
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
