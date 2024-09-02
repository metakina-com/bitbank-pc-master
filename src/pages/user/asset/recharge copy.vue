<template>
  <div class="margin-right-bar" style="overflow: hidden;">
    <h2 class="recharge-header c_fff">{{ $t('message.recharge') }}</h2>
    <div class="recharge-details">
      <div class="details-left">
        <el-select v-model="value" placeholder="请选择" class="selectCode" @change="coinChange">
          <el-option
            v-for="item in options"
            :key="item.coinCode"
            :label="item.coinCode"
            :value="item.coinCode"
          ></el-option>
        </el-select>
        <p class="txColoe_1" style="margin-top: 30px;">
          {{ $t('message.total_balance') }}：
          <span class="txColoe_2">{{ total }}</span>
        </p>
        <p class="txColoe_1">
          {{ $t('message.available_balance') }}：
          <span class="txColoe_2">{{ available }}</span>
        </p>
        <p class="txColoe_1">
          {{ $t('message.frozen_balance') }}：
          <span class="txColoe_2">{{ frozen }}</span>
        </p>
        <p v-if="value!='USDT'" class="mask-info">
          <i class="el-icon-warning"></i>
          {{ $t('message.charge_remind1',{code: value}) }}
        </p>
        <p v-if="value == 'USDT'" class="mask-info">
          <i class="el-icon-warning"></i>
          {{ $t('message.charge_remind4') }}
        </p>
      </div>
      <div class="details-right">
        <p class="right_title">
          <span style="margin-right: 6px;">{{ value }}</span>
          {{ $t('message.deposit_address') }}
        </p>
        <div id="qrcodeAddress" ref="qrCodeDiv" class="er-code"></div>
        <p class="address">
          {{ address }}
          <i
            class="el-icon-document-copy"
            v-clipboard:copy="address"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          ></i>
        </p>
      </div>
    </div>

    <div class="recharge_content">
      <p class="recharge-header">
        {{ $t('message.recharge_record') }}
        <router-link
          class="header_router"
          style="color: #49CB9D;cursor: pointer;"
          to="/user/assets/accountOrder"
        >{{ $t('message.more') }}</router-link>
      </p>
      <div class="recharge-table">
        <div class="table-title">
          <p class="txColoe_1" style="width:15%;">{{ $t('message.number') }}</p>
          <p class="txColoe_1" style="width:15%;">{{ $t('message.time') }}</p>
          <p class="txColoe_1" style="width:15%;">{{ $t('message.status') }}</p>
          <p class="txColoe_1" style="width:55%;">{{ $t('message.hash') }}</p>
        </div>
        <ul class="table_ul">
          <li v-if="showNoDate" class="li_sty">
            <img src="../../../assets/images/Status-pic.jpg" alt />
          </li>
          <li class="brColor_1 state_li" v-for="val of drawList" :key="val.id">
            <span style="width:12%;">{{val.coinCount}}</span>
            <span
              style="width:20%;"
            >{{utils.formatDate(new Date(val.createTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
            <span style="width:13%;">{{val.statusValue}}</span>
            <span style="width:56%;overflow:hidden;text-overflow:ellipsis;">{{val.hashTx}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "recharge",
  data() {
    return {
      value: "ETH",
      total: "0.00",
      available: "0.00",
      frozen: "0.00",
      address: "0xd002b38389042a8fd71f4e2af113e454eeeff673",
      showNoDate: true,
      options: [],
      drawList: []
    };
  }
};
</script>

<style lang="less" scoped>
.margin-right-bar {
  padding: 40px 20px 30px;
  overflow: hidden;

  .recharge-header {
    font-weight: 500;
  }

  .recharge-details {
    display: flex;
    padding-top: 20px;

    .details-left {
      width: 50%;
      padding-left: 20px;

      .txColoe_1 {
        color: #999;
        padding: 6px 0;

        span {
          color: #fff;
        }
      }

      .mask-info {
        color: #e7794b;
        margin-top: 30px;
        width: 80%;
      }
    }

    .details-right {
      color: #999;
      font-size: 16px;
      width: 50%;
      text-align: center;
      padding-left: 80px;

     

      .er-code {
        min-height: 100px;
        width: 100px;
        margin: 15px auto;
      }

      .address {
        padding: 12px;
        background-color: #2d365d;
        width: 320px;
        margin: 0 auto;
        font-size: 12px;

        .el-icon-document-copy {
          margin-left: 6px;
        }
      }
    }
  }

  .recharge_content {
    padding-top: 50px;

    .header_router {
      float: right;
      margin-right: 6px;
    }
    .recharge-table {
      min-height: 500px;
      background-color: #353b51;
      margin-top: 20px;
      padding: 20px;
      .table-title {
        display: flex;
        border-bottom: 1px solid #1d273e;
        padding-bottom: 16px;
        .txColoe_1 {
          padding-left: 20px;
        }
      }
      .table_ul {

        .li_sty {
          margin-top: 100px;
          text-align: center;
        }
      }
    }
  }
}
</style><style>
.el-input__inner {
  background-color: #2d365d;
  /* border: 1px solid #abadbc; */
  color: #fff;
  border: none;
}
</style>
