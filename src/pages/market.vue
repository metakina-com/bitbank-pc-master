<template>
  <div class="market bg_main pad-15 min-hei500">
    <el-row class="min-hei500 c_fff">
      <el-col :span="4">
        <div class="widall">
          <pankou :pankou="pankou" :type="'bibi'"></pankou>
        </div>
        <div class="widall">
          <chengjiao :pankou="pankou"></chengjiao>
        </div>
      </el-col>
      <el-col :span="15" class="pad-l-r-10">
        <div class="hei550 flex flex-column">
          <div class="hei40 mar-b-1 bg1 line40 flex">
            <span class="flex1">
              <span class="pad-l-10 size16 buld">{{currentPairsName}}</span>
              <span
                class="pad-l-10 size16 bold"
                :class="currentPrice.updown>=0?'green':'red'"
              >{{currentPrice.nowPrice | SubStringZreo(4)}}</span>
              <span class="pad-l-10">≈￥{{currentPrice.chPrice | SubStringZreo(2)}}</span>
              <span class="pad-l-10" :class="currentPrice.updown>=0?'green':'red'">
                <span class="title_24h">24H {{ $t('contract.zhangfu') }}</span>
                {{currentPrice.updown*100 | SubStringZreo(2)}}%
              </span>
              <span class="pad-l-10">
                <span class="title_24h">24H {{ $t('quotes.gao') }}</span>
                {{currentPrice.higPrice | SubStringZreo(4)}}
              </span>
              <!-- <span class="pad-l-10">24H开{{currentPrice.nowPrice | SubStringZreo(4)}}</span> -->
              <span class="pad-l-10">
                <span class="title_24h">24H {{ $t('quotes.di') }}</span>
                {{currentPrice.lowPrice | SubStringZreo(4)}}
              </span>
              <span class="pad-l-10">
                <span class="title_24h">24H {{ $t('contract.l') }}</span>
                {{currentPrice.volume | SubStringZreo(4)}}{{currentPairsName.split('/')[0]}}
              </span>
            </span>

            <span
              class="mar-r-10 pointer deepstyle"
              @click="deepShow=!deepShow"
            >{{!deepShow?$t('quotes.deep'):$t('contract.kline')}}</span>
            <!-- <span class="pad-l-10">24H收{{currentPrice.nowPrice | SubStringZreo(4)}}</span> -->
          </div>

          <div style="width:100%;position:relative" class="flex1">
            <deep style="width:100%" :toBuy="buyDataLong" :toSell="sellDataLong"></deep>

            <div
              style="top:0;width:100%;z-index:1;position:absolute;height:100%"
              :style="{left:(deepShow?'-2000px':'0px')}"
            >
              <k-line style="height:100%" ref="trade" @pankouData="pankouData"></k-line>
            </div>
          </div>
        </div>
        <transaction class="mar-t-15 pad-l-r-15" />
      </el-col>
      <el-col :span="5">
        <!-- 市场 选择交易对 -->
        <market-coin class style="color:#b0b8db;"></market-coin>
      </el-col>
    </el-row>
    <div>
      <market-roader class="mar-t-10"></market-roader>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import kLine from "@/components/TradeView/index.vue";
import marketRoader from "@/components/marketRoader/index.vue";
import marketCoin from "@/components/trading-center/market.vue";
import pankou from "@/components/trading-center/pankou.vue";
import chengjiao from "@/components/trading-center/chengjiao.vue";
import transaction from "@/components/transaction/index.vue";
import deep from "@/components/deep/deep.vue";

export default {
  name: "market",
  components: {
    marketRoader,
    marketCoin,
    kLine,
    pankou,
    chengjiao,
    transaction,
    deep,
  },
  data() {
    return {
      deepShow: false,
      timer: null,
      pankou: {},
      timing: 3000,
      // 原长度  深度图
      buyDataLong: [],
      sellDataLong: [],
    };
  },
  computed: {
    currentPairsName() {
      return this.$store.state.pairsName;
    },
    currentPrice() {
      return this.$store.state.currentPrice;
    },
  },
  created() {
    this.getCoinInfo(this.currentPairsName);
  },
  watch: {
    currentPairsName(val, old) {
      clearInterval(this.timer);
      this.timer = null;
      this.getCoinInfo(val);
      this.setSymbol(val);
    },
  },
  mounted() {
    // 初始化  币币

    // this.$refs.trade.init(this.currentPairsName, "15");
    this.$refs.trade.tradingViewInit(this.currentPairsName, "15");

    window.MV.$emit("currentType", "bibi");
  },
  beforeDestroy() {
    this.$refs.trade.toClose1();
    clearInterval(this.timer);
  },
  destroyed() {},
  methods: {
    ...mapActions(["setPrice"]),

    pankouData(data) {
      // console.log(data)
      this.pankou = data;
      this.buyDataLong = data.openup;
      this.sellDataLong = data.opendown;
    },
    //获取 币种详情
    getCoinInfo(pairsName) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.$get("data/data/getCoinInfo", { pairsName }).then((res) => {
        if (res && res.status == "SUCCEED") {
          let data = JSON.parse(res.result);

          this.setPrice(data);
        }
      });
      this.timer = setInterval(() => {
        this.getCoinInfo(pairsName);
      }, this.timing - 0);
    },
    // 用于子组件使用
    toClose() {
      // 主动断开
      this.$refs.trade.toClose1();
    },
    // 用于子组件使用
    setSymbol(val) {
      // 切换交易对
      this.$refs.trade.setSymbol(
        val,
        window.localStorage.getItem("currentTime")
      );
    },
  },
};
</script>

<style lang="scss"  scoped>
.market {
  .title_24h {
    color: #7085ac;
    padding-right: 4px;
  }
  .deepstyle {
    &:hover {
      color: #00a2ff;
    }
  }
}
// html ::-webkit-scrollbar {
//   background-color: rgba(56, 63, 102, 0.3);
//   width: 8px;
//   height: 5px;
// }
// html ::-webkit-scrollbar-track {
//   background-color: transparent;
// }
// html ::-webkit-scrollbar-thumb {
//     width: 5px;
//     height: 5px;
//     border-radius: 4px;
//    background-color: #383f66;
// }
</style>
