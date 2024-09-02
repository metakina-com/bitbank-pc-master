<template>
<div>
  <div class="margin-right-bar" style="overflow: hidden;">
    <h2 class="recharge-header">{{ $t('message.withdraw') }}</h2>
    <div class="recharge-details">
      <div class="details-left">
        <el-select v-model="value" placeholder="请选择" class="selectCode" @change="coinChange">
          <el-option v-for="item in options" :key="item.coinCode" :label="item.coinCode" :value="item.coinCode">
          </el-option>
        </el-select>
        <p class="txColoe_1" style="margin-top: 30px;">{{ $t('message.total_balance') }}：<span class="txColoe_2">{{ total }}</span></p>
        <p class="txColoe_1">{{ $t('message.available_balance') }}：<span class="txColoe_2">{{ available }}</span></p>
        <p class="txColoe_1">{{ $t('message.frozen_balance') }}：<span class="txColoe_2">{{ frozen }}</span></p>
        <p class="mask-info" style="margin-top: 30px;"><i class="el-icon-warning"></i>{{ $t('message.withdraw_remind1',{withdrawMin: coinObj.withdrawMin,coinCode: value}) }}
        </p>
        <p class="mask-info"><i class="el-icon-warning"></i>{{ $t('message.withdraw_remind2',{withdrawMax: coinObj.withdrawMax,coinCode: value}) }}
        </p>
        <p class="mask-info" v-if="value == 'USDT'"><i class="el-icon-warning"></i>{{ $t('message.charge_remind5') }}
        </p>
        <p class="mask-info"><i class="el-icon-warning"></i>{{ $t('message.withdraw_remind3') }}</p>
      </div>
      <div class="details-right">
        <div class="input-block" v-if="!newAddress">
          <span>{{ $t('message.withdraw_adress') }}：</span>
          <el-select v-model="addressVal" placeholder="请选择" class="selectCode selectAddress" style="width: 350px;">
            <el-option v-for="item in address" :key="item.coinAddress" :label="item.coinAddress" :value="item.coinAddress">
            </el-option>
          </el-select>
        </div>
        <div class="input-block" v-if="newAddress">
          <span>{{ $t('message.withdraw_adress') }}：</span>
          <el-input v-model="addressInput" :placeholder="$t('message.withdraw_adress')" class="selectCode selectAddress" style="width: 350px;"></el-input>
        </div>
        <div class="input-block" v-if="newAddress">
          <span>{{ $t('message.remark') }}：</span>
          <el-input v-model="remark" :placeholder="$t('message.remark')" class="selectCode selectAddress" style="width: 350px;"></el-input>
        </div>
        <div class="input-block">
          <span>{{ $t('message.number') }}：</span>
          <el-input v-model="number" :placeholder="$t('message.input_enter_amt')" class="selectCode selectAddress" style="width: 350px;"></el-input>

        </div>
        <div class="checkbox">
          <el-checkbox v-model="newAddress">{{ $t('message.withdraw_newadress') }}</el-checkbox>
          <p>
            <span>{{ $t('message.fee') }}：</span>
            <span>{{coinObj.withdrawBaseFee}}&nbsp;&nbsp;{{ value }}</span>
          </p>
        </div>
        <el-button type="primary" @click="submitCoin" class="button">
          {{ $t('message.submit') }}</el-button>
      </div>
    </div>
    <div class="recharge_content">
      <p class="recharge-header">{{ $t('message.withdraw_record') }}
        <router-link class="header_router" style="color: #49CB9D;cursor: pointer;" to="/user/assets/accountOrder">{{ $t('message.more') }}
        </router-link>
      </p>
      <div class="recharge-table">
        <div class="table-title brColor_1">
          <p class="txColoe_1" style="width:12%;">{{ $t('message.number') }}</p>
          <p class="txColoe_1" style="width:20%;">{{ $t('message.time') }}</p>
          <p class="txColoe_1" style="width:13%;">{{ $t('message.status') }}</p>
          <p class="txColoe_1" style="width:56%;">{{ $t('message.hash') }}</p>
        </div>
        <ul class="table_ul">
          <li v-if="showNoDate" class="li_sty"> <img src="../../../assets/images/Status-pic.jpg" alt />
          </li>
          <li class="brColor_1 state_li" v-for="val of drawList" :key="val.id">
            <span style="width:12%;">{{val.coinCount}}</span>
            <span style="width:20%;">{{utils.formatDate(new Date(val.createTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
            <span style="width:13%;">{{val.statusValue}}</span>
            <span style="width:56%;overflow:hidden;text-overflow:ellipsis;">{{val.hashTx}}</span>
          </li>
        </ul>
      </div>
      <el-dialog :title="$t('message.login_security_verification')" :visible.sync="dialogFormVisible" class="bank-dialog publicInput">
        <el-select v-model="type" @change="selectChange">
          <el-option :label="$t('message.center_type_verify_phone')" value="mobile" v-if="phoneNum"></el-option>
          <el-option :label="$t('message.center_type_verify_email')" value="email" v-if="emailNum"></el-option>
        </el-select>
        <el-input type="text" v-model="codeInput" autocomplete="off" :placeholder="$t('message.user_telphone_code_enter')" maxLength="6">
          <el-button slot="append" class="txColoe_1" @click="codeSend">{{ (codeReady?$t('message.center_email_code_obtain'):$t('message.center_email_code_obtain1',{count: countTime})) }}</el-button>
          <span slot="append" style="position: absolute;top: 45px;right: 0;">{{ $t('message.center_type_remind',{type: typeNum})}}</span>
        </el-input>
        <el-button type="primary" @click="withdrawBtn" style="width: 100%;margin-top: 30px;">{{ $t('message.confirm_button') }}</el-button>
      </el-dialog>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "withdraw",
  data() {
    return {
      value: 'ETH',
      total: '0.00',
      available: '0.00',
      frozen: '0.00',
      withdrawMin: '0.01',
      withdrawMax: '100',
      address: '',
      remark: '',
      number: '',
      showNoDate: true,
      newAddress: false,
      options: [],
      coinObj: '',
      addressVal: '',
      addressInput: '',
      drawList: [],
      codeInput: '',
      codeReady: true,
      countTime: 0,
      userData: '',
      type: '',
      typeNum: '',
      phoneNum: '',
      emailNum: '',
      dialogFormVisible: false,
    }
  },
}
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
        width: 80%;
        padding: 5px 0;
      }
    }

    .details-right {
      color: #999;
      font-size: 16px;
      width: 50%;
      padding-right: 20px;

      .input-block {
        text-align: right;
        margin-top: 25px;
        border: none;
      }

      .input-block:first-child {
        margin-top: 0;
      }

      .checkbox {
        float: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 80%;
        margin-top: 20px;

      }

      .button {
        width: 80%;
        float: right;
        margin-top: 30px;
        background-color: RGB(220, 42, 105);
        border: none;
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
  border: none;
  color: #fff;
}

.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #eee;
}
</style>
