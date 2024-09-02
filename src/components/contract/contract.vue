<template>
  <div class="orders">
    <div class="flex_bet pad-t-b-15">
      <div>
        <!-- 可用 -->
        {{ $t('contract.keyong') }}
        ：<span class="">{{ assets.tokenBalance | toNumber(4) }} {{ currentPairsName.split('/')[1] }}</span>
      </div>
    </div>
    <!-- 价格 -->
    <div class="flex align_center borders pad-l-15 mar-b-10">
      <span class="size12 label">{{ subType == "1" ? $t('contract.buyPrice') : $t('contract.sellPrice') }} </span>
      <div class="flex1 v-right pad-r-15" v-if="priceType == 1">{{ $t('contract.swapTip2') }}</div>
      <el-input v-model="price" class="flex1 inputBox" v-else></el-input>
    </div>
    <!-- 数量 -->
    <div class="flex align_center borders pad-l-15" v-if="priceType == 1 && type == 'buy'">
      <span class="size12 label">{{$t('contract.jye')}} {{ currentPairsName.split('/')[1] }}</span>
      <el-input v-model="marketPrice" class="flex1 inputBox"></el-input>
    </div>
    <div class="flex align_center borders pad-l-15" v-else>
      <span class="size12 label">{{ subType == "1" ? $t('contract.buyNum') : $t('contract.sellNum') }}</span>
      <el-input v-model="marketCount" class="flex1 inputBox"></el-input>
      <span class="pad-r-15">{{ $t('contract.num') }}</span>
    </div>

    <div class="pad-l-5 pad-t-b-2">
      <el-slider v-model="slideNum" :show-tooltip="false" @change="slideChange"></el-slider>
    </div>
    <div class="flex_bet mar-b-10">
      <span>0</span>
      <span>{{ slideNum | subString(2) }}%</span>
    </div>
    <div class="flex align_center " v-if="updownType == 1">
      <span class="label mar-r-5">=</span>
      <div>{{ contractMul * marketCount | subStringZreo(4) }} {{ currentPairsName.split('/')[0] }}</div>
    </div>
    <div class="hei19" v-else></div>

    <div class="mar-t-b-4">
      <div class="green" v-show="updownType == '1' && subType == '1'">{{ $t('contract.kkduo') }} : {{ kekaishoushu }} {{ $t('contract.hand') }}</div>
      <div class="red" v-show="updownType == '1' && subType == '2'">{{ $t('contract.kkkong') }} : {{ kekaishoushu }} {{$t('contract.hand')}}</div>
      <div class="green" v-show="updownType == '2' && subType == '1'">{{ $t('contract.kpduo') }} : {{ kepingshoushu }} {{$t('contract.hand')}}</div>
      <div class="red" v-show="updownType == '2' && subType == '2'">{{ $t('contract.kpkong') }} : {{ kepingshoushu }} {{$t('contract.hand')}}</div>
    </div>

    <el-button :loading="loading" @click="submitHandle('1')" class="green-bg btns"
      v-show="updownType == '1' && subType == '1'">
      <span>{{$t('contract.mrkd')}}</span>
      <span class="sub1">{{$t('contract.kanzhang')}}</span>
    </el-button>

    <el-button :loading="loading" @click="submitHandle('2')" class="red-bg btns"
      v-show="updownType == '1' && subType == '2'">
      <span>{{$t('contract.mckk')}}</span>
      <span class="sub1">{{$t('contract.kandie')}}</span>
    </el-button>

    <el-button :loading="loading" @click="submitHandle('3')" class="green-bg btns"
      v-show="updownType == '2' && subType == '1'">
      <span>{{ $t('contract.mrpk')}}</span>
    </el-button>
    <el-button :loading="loading" @click="submitHandle('4')" class="red-bg btns"
      v-show="updownType == '2' && subType == '2'">
      <span>{{ $t('contract.mrpd') }}</span>
    </el-button>
  </div>
</template>

<script>
export default {
  props: ["type", "priceType", "updownType", "subType", "ganggan", "gangganSet", 'marginRatio'],
  data() {
    return {
      kekaishoushu: '--',
      kepingshoushu: '--',
      leverId: '',
      contractMul: 0, //合约乘数
      ensure: 0, //维持保证金率
      currentGangganType: '100', //默认100倍
      marketPrice: null, //输入金额
      marketCount: null, //数量手
      slideNum: null, //进度条值
      setCount: null, //未格式化数量
      price: null, //委托价格
      assets: {
        balance: 0,
        blockedBalance: 0
      }, //可用资产
      loading: false,
      timer2: null, //资产定时器
      currentPriceType: '',//当前价格类型
    };
  },
  computed: {
    currentPairsName() {
      return this.$store.state.pairsName1;
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
    ganggan(num) {
      this.marketCount = 0;
      this.slideNum = 100;
      this.selGangganOk(num)
    },
    currentPrice(val, old) {
      let ganggan = this.ganggan;
      console.log(val, old)
      if (val.nowPrice != old.nowPrice) {
        this.selGangganOk(ganggan)
      }
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
        this.getjiaoyipeizhi(val)
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
      if (this.priceType == 1) {
        this.getMaxHand(
          this.currentGangganType,
          this.currentPairsName,
          this.currentPrice.nowPrice
        );
      } else {
        this.getMaxHand(
          this.currentGangganType,
          this.currentPairsName,
          this.price
        );
      }
    },
    marketPrice: function (val) {
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
    marketCount: function (val) {

      let kekaiMax = this.kekaishoushu;

      if (val == 0 || val == '' || val == null) {
        this.slideNum = 0;
        return
      }
      if (val >= kekaiMax) {
        this.marketCount = kekaiMax;
        this.slideNum = 100;
        return
      }

      this.slideNum = this.$util.toNumber(val / kekaiMax * 100)


      return;
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
    price: function (val) {

      if (this.priceType == 1) {
        this.getMaxHand(
          this.currentGangganType,
          this.currentPairsName,
          this.currentPrice.nowPrice
        );
      } else {
        this.getMaxHand(
          this.currentGangganType,
          this.currentPairsName,
          val
        );
      }
      return;
    }
  },
  mounted() {

    if (this.isLogin) {
      this.getjiaoyipeizhi(this.currentPairsName)
      this.getAsset();
      let ganggan = this.ganggan;
      this.selGangganOk(ganggan)

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
    // 交易配置 合约乘数
    getjiaoyipeizhi(pairsName) {
      this.$get("contract/contractMul/getContractMul", {
        pairsName
      }).then(
        res => {
          if (res && res.status == "SUCCEED") {
            let data = res.result;
            console.log(data,'datadata');
            this.contractMulId = data[0].id;

            this.ensure = data[0].ensure;
            // 合约乘数
            this.contractMul = data[0].contractMul;
          }
        }
      );
    },
    //滑动条改变事件
    slideChange(e) {
      this.slideNum = e;
      console.log(this.slideNum)
      console.log(this.kekaishoushu)
      this.marketCount = parseInt(this.kekaishoushu * (this.slideNum / 100));
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
    selGangganOk(val) {
      this.currentGangganType = val;
      this.leverId = this.gangganSet.find(
        ele => ele.lever == this.currentGangganType
      ).id;
      console.log(val, this.leverId, this.gangganSet)
      // 选择了杠杆，那么手数和 进度条 初始化
      if (this.priceType == 1) {
        this.getMaxHand(
          this.currentGangganType,
          this.currentPairsName,
          this.currentPrice.nowPrice
        );
      } else {
        this.getMaxHand(
          this.currentGangganType,
          this.currentPairsName,
          this.price
        );
      }
    },
    //买入卖出
    submitHandle(n) {
      if (this.$util.noClick()) {
        return;
      }
      let marketCount;
      if (!this.$util.isLogin()) {
        return;
      }
      if (!this.contractMulId) return;
      if (this.assets.tokenBalance - 0 <= 0) {
        this.$util.Toast("当前可用资产不足", "warning");
        return;
      }
      if (n == 1) {
        this.submitData("OPEN_UP");
      }
      if (n == 2) {
        this.submitData("OPEN_DOWN");
      }
      if (n == 3) {
        this.submitDataPing("OPEN_UP");
      }
      if (n == 4) {
        this.submitDataPing("OPEN_DOWN");
      }
      return;
    },
    // 开仓
    submitData(tradeType) {
      if (this.assets.tokenBalance <= 0) {
        this.Toast("可用资产不足");
        return;
      }
      let data = {
        // contractHands: this.isMerge ? data.sumIsHands : data.isContractHands,
        // contractMulId: this.isMerge ? this.contractMulId : data.contractMulId,
        orderType: 'POSITIONS',//
        isCompany: '数量',//
        pairsName: this.currentPairsName,
        priceType: this.priceType == 1 ? "MARKET_PRICE" : "CUSTOM_PRICE",
        contractHands: this.marketCount,
        price: this.priceType != 1 ? this.price : this.currentPrice.nowPrice, //1市价 2限价
        member: this.$store.state.userId,
        tradeType,
        contractMulId: this.contractMulId,
        leverId: this.leverId,
        stopLossCount: this.marketCount,
        stopLossPrice: null,
        stopWinCount: this.marketCount,
        stopWinPrice: null,

      };
      console.log(data)

      // return;
      if (data.leverId == "") {
        this.Toast("请选择杠杆");
        return;
      }

      if (data.price == "" || data.price == 0) {
        this.Toast("请输入价格");
        return;
      }
      if (!data.contractHands) {
        this.Toast("请输入手数");
        return;
      }

      this.$post("contract/contractOrder/setContractOrder", data).then(res => {
        if (res && res.status == "SUCCEED") {
          this.selGangganOk(this.ganggan)

          this.$util.Toast("开仓成功", "success");
          this.slideNum = 0;
          this.marketCount = null;
          // this.getWarehouses(this.currentName);
        } else if (res.status == "FAILED") {
          this.Toast(res.errorMessage);
        }
      });



    },

    // 请求最大可开手数
    getMaxHand(level, pairsName, price) {
      // console.log(level,pairsName,price)
      if (price == "" || price == 0 || price == null) {
        this.kekaishoushu = 0;
        return;
      }
      let data = {
        pairsName,
        level,
        price,
        member: this.$store.state.userId
      };
      this.$get("contract/contractOrder/getContractHands", data).then(res => {
        if (res && res.status == "SUCCEED") {
          let data = res.result;
          // this.kekaishoushu = parseInt(data);
          console.log(data);
        }
      });
    },
    //可用资产
    getAsset() {
      let pairsName = this.currentPairsName;
      let currency;
      currency = pairsName.split("/")[1];
      this.$get("member/balance/getBalances", {
        currency: currency,
        member: this.$store.state.userId,
        balanceType: "BALANCE_HY"
      }).then(res => {
        if (res && res.status == "SUCCEED") {
          let data = res.result;

          if (data.length != 0) {
            this.assets = data[0];
            this.$emit("getAsset", data[0]);
            // console.log(this.assets.tokenBalance,this.assets.tokenProfitBalance,this.marginRatio,this.currentPrice)
            let kekai =
              ((this.assets.tokenBalance + this.assets.tokenProfitBalance) *
                this.marginRatio) /
              (this.currentPrice.nowPrice / this.currentGangganType);
            // 可开  =  保证金 / (当前价格 / 杠杆)
            this.kekaishoushu = kekai;
            console.log(this.kekaishoushu, 'this.kekaishoushu')
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
    margin-left: 0;

    .sub1 {
      margin-left: 5px;
      color: hsla(0, 0%, 100%, .6)
    }
  }
}
</style>