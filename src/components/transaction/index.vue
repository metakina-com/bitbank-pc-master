<template>
  <div class="transaction">

    <div class="pad-b-15">
      <!-- 交易 -->
      <el-tabs v-model="priceType">
        <el-tab-pane :label="$t('contract.now_price')" name="2"></el-tab-pane>
        <el-tab-pane :label="$t('contract.marketPrice')" name="1"></el-tab-pane>
      </el-tabs>
      <div class="flex_bet">
        <div class="flex1 pad-r-20">
          <!-- 买入 -->
          <transaction type="buy" :priceType="priceType" @getAsset="getAsset" />
        </div>

        <!-- 卖出 -->
        <div class="flex1 pad-l-20">
          <transaction type="sell" :priceType="priceType" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import transaction from "./transaction";
export default {
  components: {
    transaction
  },
  data() {
    return {
      priceType: "2", //1市价，2限价
      assets: {
        balance: 0,
        blockedBalance: 0
      }, //可用资产
      operationType: "open" //open买
    };
  },
  computed: {
    currentPairsName() {
      return this.$store.state.pairsName;
    },
    contractMulId() {
      return this.$store.state.contractMulId;
    },
    isLogin() {
      return this.$store.state.isLogin;
    }
  },
  watch: {
    marketCount: function(val) {
      this.setCount = val;
    },
    currentPairsName(val) {}
  },
  mounted() {},
  methods: {
    getAsset(data) {
      this.assets = data;
    }
  }
};
</script>

<style lang='scss'>
.el-tabs__nav-wrap::after {
  background-color: rgba(19, 22, 37, 0.2) !important;
}
.orders .inputBox .el-input__inner {
  color: #fff!important;
}
.transaction{
.el-tabs__item {
  color: #fff!important;
}
}

</style>
<style lang="less" scoped>
.transaction {
  background-color: #171b2b;
}
</style>