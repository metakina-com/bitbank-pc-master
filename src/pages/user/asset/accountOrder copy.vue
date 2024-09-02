<template>
<div>
  <div class="margin-right-bar">
    <h2 class="account_header">{{ $t('message.account_order') }}</h2>
    <div class="account_content">
      <div class="flowingWater-nav">
        <p class="nav_p" :class="{active:navActive == 0}" @click="navMask(0)">{{ $t('message.recharge_record') }}</p>
        <p class="nav_p" :class="{active:navActive == 1}" @click="navMask(1)">{{ $t('message.withdraw_record') }}</p>
      </div>
      <div class="flowingWater-table">
        <div class="brColor_1">
          <p class="txColoe_1" style="width:25%;">{{ withdrawTitle[0] }}</p>
          <p class="txColoe_1" style="width:15%;">{{ withdrawTitle[1] }}</p>
          <p class="txColoe_1" style="width:15%;">{{ withdrawTitle[2] }}</p>
          <p v-if="navActive == 1" style="width:15%;" class="txColoe_1">{{ withdrawTitle[3] }}</p>
          <p class="txColoe_1" style="width:40%;">{{ withdrawTitle[4] }}</p>
          <p class="txColoe_1" style="width:10%;">{{ withdrawTitle[5] }}</p>
        </div>
        <ul class="table_ul">
          <li v-if="showNoDate" class="li_sty">
            <img src="../../../assets/images/Status-pic.jpg" alt />
          </li>
          <li class="state_li" v-for="(val,index) of listData" :key="index">
            <span style="width:25%;">{{utils.formatDate(new Date(val.createTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
            <span style="width:15%;">{{val.coinCode}}</span>
            <span style="width:15%;">{{val.coinCount}}</span>
            <span v-if="navActive == 1" style="width:15%;">{{val.coinCode}}</span>
            <span style="width:40%;overflow:hidden;text-overflow:ellipsis;">{{val.hashTx}}</span>
            <span style="width:10%;">{{val.statusValue}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "accountOrder",
  data() {
    return {
      navActive: 0,
      rechargeList: [],
      withdrawList: [],
      showNoDate: true,
      listData: []
    };
  },
  computed: {
    chargeTitle() {
      return [
        this.$t("message.time"),
        this.$t("message.coin"),
        this.$t("message.number"),
        this.$t("message.hash"),
        this.$t("message.status")
      ];
    },
    withdrawTitle() {
      return [
        this.$t("message.time"),
        this.$t("message.coin"),
        this.$t("message.number"),
        this.$t("message.fee"),
        this.$t("message.hash"),
        this.$t("message.status")
      ];
    }
  },
  methods: {
    navMask(index) {
      this.navActive = index;
      if (index == 0) {
        this.listData = this.rechargeList;
      } else {
        this.listData = this.withdrawList;
      }
      if (this.listData.length == 0) {
        this.showNoDate = true;
      } else {
        this.showNoDate = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.margin-right-bar {
  padding: 40px 20px 30px;
  overflow: hidden;
  color: #fff;

  .account_header {
    font-weight: 500;
  }

  .account_content {
    min-height: 500px;
    background-color: #353b51;
    margin-top: 30px;
    padding: 20px;

    .flowingWater-nav {
      display: flex;
      border-bottom: 1px solid #1d273e;
      padding-bottom: 16px;

      .nav_p {
        margin-right: 40px;
        position: relative;
        cursor: pointer;
        color: #999;
      }
    }

    .flowingWater-table {
      .brColor_1 {
        display: flex;
        padding: 18px 0;
        border-bottom: 1px solid #1d273e;
        
      }
      .table_ul {
          .li_sty {
            margin-top: 100px;
            text-align: center;
          }
        }
    }
  }

  .active {
    color: #fff !important;
  }

  .active::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: -16px;
    width: 70%;
    height: 3px;
    background: #e62963;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
}
</style>
