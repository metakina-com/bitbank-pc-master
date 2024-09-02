<template>
  <div class="orders">
    <div class="flex_bet pad-t-b-15">
      <div>
        <!-- 可用 -->
        {{ $t('contract.keyong') }}
        <span class="red" v-if="type=='buy'">{{assets.balance|toNumber(4)}} {{currentPairsName.split('/')[1]}}</span>
        <span class="red" v-else>{{assets.balance|toNumber(4)}} {{currentPairsName.split('/')[0]}}</span>
      </div>
    </div>
    <!-- 价格 -->
    <div class="flex align_center borders pad-l-15 mar-b-10">
      <span class="size12 label">{{type=="buy"?$t('contract.buyPrice'):$t('contract.sellPrice')}} {{currentPairsName.split('/')[1]}}</span>
      <div class="flex1 v-right pad-r-15" v-if="priceType==1">{{ $t('contract.swapTip2') }}</div>
      <el-input v-model="price" class="flex1 inputBox" v-else></el-input>
    </div>
    <!-- 数量 -->
    <div class="flex align_center borders pad-l-15" v-if="priceType==1&&type=='buy'">
      <span class="size12 label">{{$t('contract.jye')}} {{currentPairsName.split('/')[1]}}</span>
      <el-input v-model="marketPrice" class="flex1 inputBox"></el-input>
    </div>
    <div class="flex align_center borders pad-l-15" v-else>
      <span class="size12 label">{{type=="buy"?$t('contract.buyNum'):$t('contract.sellNum')}} {{currentPairsName.split('/')[0]}}</span>
      <el-input v-model="marketCount" class="flex1 inputBox"></el-input>
    </div>

    <div class="pad-l-5 pad-t-b-2">
      <el-slider v-model="slideNum" :show-tooltip="false" @change="slideChange"></el-slider>
    </div>
    <div class="flex_bet mar-b-10">
      <span>0</span>
      <span>{{slideNum|subString(2)}}%</span>
    </div>
    <div class="flex align_center mar-b-10" v-if="priceType==1">
      <span class="label mar-r-5">{{$t('contract.jye')}}</span>
      <div
        v-if="type=='buy'"
      >{{(marketPrice?marketPrice:0)|SubString(4)}}{{currentPairsName.split('/')[1]}}</div>
      <div v-else>{{price*marketCount|subStringZreo(4)}}{{currentPairsName.split('/')[1]}}</div>
    </div>

    <el-button
      :loading="loading"
      @click="submitHandle('BUY')"
      class="green-bg btns"
      v-if="type=='buy'"
    >{{$t('contract.buy')}}</el-button>
    <el-button :loading="loading" @click="submitHandle('SELL')" class="red-bg btns" v-else>{{$t('contract.sell')}}</el-button>
    <!-- <div class="green-bg btns" @click="submitHandle('BUY')" v-if="type=='buy'">买入</div> -->
  </div>
</template>

<script>
export default {
  props: ["type", "priceType"],
  data() {
    return {
      marketPrice: null, //输入金额
      marketCount: null, //数量
      slideNum: null, //进度条值
      setCount: null, //未格式化数量
      price: null, //委托价格
      assets: {
        balance: 0,
        blockedBalance: 0
      }, //可用资产
      loading: false,
      timer2: null //资产定时器
    };
  },
  computed: {
    currentPairsName() {
      return this.$store.state.pairsName;
    },
    contractMulId() {
      return this.$store.state.contractMulId;
    },
    currentPrice() {
      return this.$store.state.currentPrice;
    },
    isLogin() {
      return this.$store.state.isLogin;
    }
  },
  watch: {
    isLogin(val) {
      this.isLogin = val;
    },
    currentPrice(val) {
      return val;
    },
    currentPairsName(val) {
      clearTimeout(this.timer2);
      this.timer2 = null;
      this.marketCount = null;
      // this.price = this.currentPrice.nowPrice || 0;
      this.getCoinInfo();
      if (this.isLogin) {
        this.getAsset();
      } else {
        this.assets.balance = 0;
      }
    },
    priceType(val) {
      this.marketPrice = null; //输入金额 买入
      this.marketCount = null; //输入金额 买入
      this.slideNum = null; //输入金额 买入
      this.setCount = null; //输入金额 买入
      if (val == 2) {
        this.getCoinInfo();
      }
    },
    marketPrice: function(val) {
      var vals = this.$util.toNumber1(val);
      // && this.transaction.slideNum != 100
      if (!val || val < 0) {
        vals = parseFloat(val);
        if (vals - 0 == 0) {
          this.marketPrice = 0;
        } else {
          this.marketPrice = null;
        }
        this.slideNum = 0;
        return;
      }
      let count = this.assets.balance;
      vals = count - val > 0 ? val : count;
      this.marketPrice = this.$util.SubString(vals, 8);
      if (this.slideNum == 100) {
        return;
      }
      this.setCount = vals;
      this.slideNum = this.$util.toNumber((vals / count) * 100);
    },
    marketCount: function(val) {
      // var vals = parseFloat(val);
      var vals = val + "";
      // if (!val) {
      //   this.marketCount = null;
      //   this.slideNum = 0;
      //   return;
      // }
      var vals = this.$util.toNumber1(val);
      if (!val) {
        vals = parseFloat(val);
        if (vals == 0) {
          this.marketCount = 0;
        } else {
          this.marketCount = null;
        }
        this.slideNum = 0;
        return;
      }
      // this.marketCount=vals;
      //  && this.transaction.slideNum != 100
      // if (!val || val < 0) {
      //   vals = parseFloat(val);
      //   if (vals == 0) {
      //     this.marketCount = 0;
      //   } else {
      //     this.marketCount = null;
      //   }
      //   this.slideNum = 0;
      //   return;
      // }

      // if (vals.indexOf(".") == -1 && parseFloat(vals) == 0) {
      //   this.marketCount = null;
      //   return;
      // }
      let count;
      if (this.type == "buy") {
        count = this.assets.balance / this.price;
      } else {
        count = this.assets.balance;
      }

      vals = count - val > 0 ? val : count;
      this.marketCount = this.$util.SubString(vals, 8);
      if (this.slideNum == 100) {
        return;
      }
      this.setCount = vals;
      this.slideNum = this.$util.toNumber((vals / count) * 100);
    },
    price: function(val) {
      var vals = this.$util.toNumber1(val);
      if (!val) {
        this.price = null;
        this.marketCount = null;
        return;
      }
      this.price = this.$util.SubString(vals, 8);
      if (this.priceType == 2) {
        this.slideNum = 0;
        this.marketCount = null;
        this.marketPrice = null;
      }
    }
  },
  mounted() {
    if (this.isLogin) {
      this.getAsset();
    }
    this.getCoinInfo();
    this.$hub.$on("setMarkPrices", res => {
      this.price = res;
    });
  },
  destroyed() {
    clearTimeout(this.timer2);
    this.timer2 = null;
  },
  methods: {
    // 设置买卖价格
    setMarkPrice(val) {
      this.price = val;
    },
    //滑动条改变事件
    slideChange(e) {
      if (!this.price) return (this.slideNum = 0);
      this.slideNum = e;
      let count, counts;

      if (this.type == "buy" && this.priceType == 1) {
        // count = parseFloat(this.assets.balance).toFixed(4);
        count = this.assets.balance;
        counts =
          count * (this.slideNum / 100) == 0
            ? 0
            : count * (this.slideNum / 100);
        this.marketPrice = this.$util.toNumber(counts);
        this.setCount = this.$util.toNumber(counts);
        return;
      }
      if (this.type == "buy") {
        count = this.assets.balance / this.price;
      } else {
        count = this.assets.balance;
      }
      counts =
        count * (this.slideNum / 100) == 0 ? 0 : count * (this.slideNum / 100);
      this.marketCount = this.$util.toNumber(counts);
      this.setCount = this.$util.toNumber(counts);
    },
    //获取 币种详情
    getCoinInfo() {
      let pairsName = this.currentPairsName;
      // this.getZhishu(pairsName);
      this.$get("data/data/getCoinInfo", { pairsName })
        .then(res => {
          if (res && res.status == "SUCCEED") {
            let data = JSON.parse(res.result);
            this.price = data.nowPrice;
          }
        })
        .catch(err => {
          this.getCoinInfo();
        });
    },
    //买入卖出
    submitHandle(type) {
      let marketCount;
      if (!this.$util.isLogin()) {
        return;
      }
      if (!this.contractMulId) return;
      if (this.assets.balance - 0 <= 0) {
        this.$util.Toast("当前可用资产不足", "warning");
        return;
      }
      if (this.priceType == 2) {
        //限价
        if (!(this.price - 0)) {
          this.$util.Toast("请输入价格", "warning");
          return;
        }
      }
      if (this.priceType == 1) {
        this.price = this.currentPrice.nowPrice;
      }
      if (this.priceType == 1 && type == "BUY") {
        marketCount = this.$util.toNumber(this.setCount / this.price, 8);
        if (!(this.setCount - 0)) {
          this.$util.Toast("请输入金额", "warning");
          this.marketPrice = parseFloat(0).toFixed(4);
          return;
        }
      } else {
        // marketCount = this.transaction.marketCount;
        marketCount = this.$util.toNumber(this.setCount, 4);
        if (!(marketCount - 0)) {
          this.$util.Toast("请输入数量", "warning");
          this.marketCount = parseFloat(0).toFixed(4);
          return;
        }
      }
      this.loading = true;
      let data = {
        count: marketCount,
        price: this.price,
        member: this.$store.state.userId,
        entrustType: type,
        pairs: this.contractMulId,
        priceType: this.priceType == 1 ? "MARKET_PRICE" : "CUSTOM_PRICE",
        percentageCount: this.$util.toNumber(this.slideNum / 100, 8),
        matchFee:
          this.priceType == 1 && type == "BUY"
            ? this.setCount
            : this.$util.toNumber(marketCount * this.price)
      };
      // this.$util.showLoading();
      // let loading = this.$util.showLoading();
      this.$post("entrust/entrust/setEntrust", data)
        .then(res => {
          // this.Toast.clear();
          // loading.close();
          this.loading = false;
          if (res && res.status == "SUCCEED") {
            if (res.result == true) {
              this.marketCount = null;
              this.marketPrice = null;
              this.slideNum = 0;
              this.setCount = null;
              if (type == "BUY") {
                this.$util.Toast("买入成功", "success");
              } else {
                this.$util.Toast("卖出成功", "success");
              }
              // if (this.timer1) {
              //   clearTimeout(this.timer1);
              // }
              clearTimeout(this.timer2);
              this.getAsset();
              // this.getEntrustList();
            }
          } else {
            this.Toast(res.errorMessage);
          }
        })
        .catch(err => {
          this.loading = false;
          // this.Toast.clear();
          // loading.close();
        });
    },
    //可用资产
    getAsset() {
      let pairsName = this.currentPairsName;
      let currency;
      if (this.type == "buy") {
        currency = pairsName.split("/")[1];
      } else {
        currency = pairsName.split("/")[0];
      }
      this.$get("member/balance/getBalances", {
        currency: currency,
        member: this.$store.state.userId,
        balanceType: "BALANCE_BB"
      }).then(res => {
        if (res && res.status == "SUCCEED") {
          let data = res.result;
          if (data.length != 0) {
            this.assets = data[0];
            var banlance = data[0].balance;
            this.assets.balance = this.$util.toNumber(banlance);
            // if (this.type == "buy") {
            //   console.log(data[0]);
            //   this.$emit("getAsset", data[0]);
            // }
            this.$emit("getAsset", data[0]);
          }
          if (this.isLogin) {
            this.timer2 = setTimeout(res => {
              this.getAsset();
            }, 5000);
          }
        }
      });
    }
  }
};
</script>

<style lang='scss'>
.orders {
  width: 100%;
  .green-bg {
    &.el-button:focus,
    &.el-button:hover {
      background: #00e6c3 !important;
      color: #fff;
    }
  }
  .red-bg {
    &.el-button:focus,
    &.el-button:hover {
      background: #f04 !important;
      color: #fff;
    }
  }
  .label {
    color: #fff;
    font-size: 12px;
  }
  .inputBox .el-input__inner {
    border: none;
    text-align: right;
    background: transparent;
  }
  .priceType .el-input__inner {
    border: 1px solid #e1e1e1;
    border-radius: 0;
  }

  .el-slider__button {
    border-radius: 0;
    width: 10px;
    height: 16px;
    background: #e1e1e1;
    border-color: #e1e1e1;
  }
  .borders {
    border: 1px solid #383f66;
    height: 40px;
    border-radius: 3px;
  }
  .el-slider__runway {
    background-color: #252a44;
  }
  .el-slider__button {
    background-color: #252a44;
    border-color: #252a44;
  }
  .btns {
    padding: 10px 0;
    width: 100%;
    box-sizing: border-box;
    border: none;
    height: 40px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    border-radius: 3px;
  }
}
</style>