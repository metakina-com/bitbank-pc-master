<template>
  <div class="market line52 flex flex-column">
    <!-- chPrice: 50928.60931 -->
    <!-- higPrice: 7183
    id: "b173b6f0f350067300e147a70ca7c034"
    image: ""
    lowPrice: 7024
    mainCur: "USDT"
    mainFrom: "BTC"
    open: 7112.43
    openPrice: 0
    pairsName: "BTC/USDT"
    price: 7087.1
    projectAdd: ""
    sort: 11
    state: "NORMAL"
    tokenCur: "BTC"
    top: true
    tradeMax: 1000000
    tradeMin: 1
    tradeRate: 0.003
    type: "MAIN_COIN"
    updown: -0.00356137
    volume: 21006.16948239-->
    <div class="hei40 bg1 flex v_center line40">
      <div class="wid_33">{{ $t('quotes.bizhong') }}</div>
      <div class="wid_33">{{ $t('contract.zxj') }}</div>
      <div class="wid_33">{{$t('contract.zhangfu')}}</div>
    </div>
    <div class="overflow  gundong hei">
      <div
        v-for="item in list"
        :key="item.id"
        class="pointer hei32 line32 v_center flex"
        :class="currentPairsName==item.pairsName?'active':''"
        @click="switchCoinName(item.pairsName,item.id)"
      >
        <div class="wid_38 v_left">{{item.pairsName}}</div>
        <div class="wid_37 v_left">{{item.price | SubStringZreo(4)}}</div>
        <div class="wid_25 v_left" :class="item.updown>0?'green':item.updown==0?'c5c7699':'red'">{{item.updown*100|SubStringZreo(2)}}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      list: [],
      set:null
    };
  },
  destroyed() {},
  beforeDestroy() {
    let set = this.set;
    if (set) {
      clearTimeout(set);
    }

  },
  mounted() {
    this.getList();
  },
  computed: {
    currentPairsName() {
      return this.$store.state.pairsName;
    }
  },
  methods: {
    ...mapActions(["setPairsName", "setPairsName1", "setContractMulId"]),

    switchCoinName(pairsName, id) {
      this.setPairsName(pairsName);
      this.setContractMulId(id);
    },
    getList() {
      this.$get("/data/data/getPairsByMainCur", {
        mainCur: "usdt",
        // type: "CONTRACT"
        type: "SPOT" //币币
      }).then(res => {
        this.list = res.result;
        this.set = setTimeout(res => {
                this.getList();
        }, 5000);
        res.result.forEach(item => {
          if (this.$store.state.pairsName == item.pairsName) {
            this.setContractMulId(item.id);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.market {
  .active {
    color: aqua;
  }
}
.hei{
  height:840px;
}
</style>

