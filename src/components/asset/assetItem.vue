<template>
  <li class="code-list-li">
    <span class="span">{{list.currency}}</span>
    <div class="span">
      <div class="items size14 mar_t_8" v-if="curType==0">{{list.balance|toNumber(4)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==1">{{list.tokenBalance|toNumber(4)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==2">{{list.fbBalance|toNumber(4)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==3">{{list.assetsBalance|toNumber(4)}}</div>
    </div>
    <div class="span">
      <div class="items size14 mar_t_8" v-if="curType==0">{{list.blockedBalance|toNumber(4)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==1">{{list.tokenBlockedBalance|toNumber(4)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==2">{{list.fbBlockedBalance|toNumber(4)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==3">{{list.assetsBlockedBalance|toNumber(4)}}</div>
    </div>
    <div class="span">
      <div class="items size14 mar_t_8" v-if="curType==0">{{list.scaleBalanceCny|toNumber(2)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==1">{{list.scaleTokenUsdt|toNumber(4)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==2">{{list.scaleFbCny|toNumber(2)}}</div>
      <div class="items size14 mar_t_8" v-if="curType==3">{{list.scaleAssetsCny|toNumber(2)}}</div>
    </div>
    <div class="span">
      <span @click="coinCharging" class="code-list-btn">{{$t("message.recharge")}}</span>
      <span @click="goWithdrawCoin" class="code-list-btn">{{$t("message.withdraw")}}</span>
      <span @click="goTransfer" class="code-list-btn">划转</span>
    </div>

    <el-dialog
      title="划转"
      :visible.sync="dialogVisible"
      width="480px"
      :before-close="handleClose"
      @close="close"
      :close-on-click-modal="false"
    >
      <div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-10">币种</p>
          <el-select v-model="value" placeholder="请选择" class="widall" @change="currencyChange">
            <el-option
              v-for="item in balanceList"
              :key="item.id"
              :label="item.currency"
              :value="item.currency"
            ></el-option>
          </el-select>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-10 flex_bet">从</p>
          <el-select v-model="formType" class="widall" @change="changeFormType">
            <el-option
              v-for="(item,i) in chooseList"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-10">转至</p>
          <el-select v-model="toType" class="widall">
            <el-option
              v-for="(item,i) in chooseList"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-10">数量</p>
          <div class="relative">
            <el-input
              v-model="coinNum"
              :placeholder="'最多可划转'+transferInfo.amount+value"
              type="number"
            ></el-input>
            <span class="blue absolute right-15 top-7 pointer" @click="transferAll">全部</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="transferHandle" :loading="loading">立即划转</el-button>
      </span>
    </el-dialog>
  </li>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["list", "curType", "page", "balanceList"],

  data() {
    return {
      dialogVisible: false,
      value: "",
      chooseList: [
        {
          value: 0,
          label: "币币账户"
        },
        {
          value: 1,
          label: "合约账户"
        },
        {
          value: 2,
          label: "法币账户"
        }
      ],
      formType: 0,
      toType: 1,
      transferInfo: {
        amount: 0
      },
      contract: 0, //合约
      bCount: 0, //BB合约
      fbCount: 0, //法币，
      coinNum: "",
      loading: false
    };
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },
  watch: {
    coinNum(val) {
      val = val + "";
      if (!val) {
        return;
      }
      if (parseFloat(val) < 0) {
        return (this.coinNum = 0);
      }
      return (this.coinNum = this.$util.SubString(val, 4));
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["setCurrency"]),
    coinCharging() {
      this.setCurrency(this.list.currency);
      setTimeout(res => {
        this.$router.push("/user/assets/recharge");
      }, 300);
    },
    //关闭划转弹框
    close() {
      this.coinNum = "";
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.close();
          done();
        })
        .catch(_ => {});
    },
    //全部转出
    transferAll() {
      this.coinNum = this.transferInfo.amount;
    },
    //划转事件
    transferHandle() {
      let coinNum = parseFloat(this.coinNum);

      if (this.formType == this.toType) {
        this.$util.Toast("转出账户和转入账户不能相同");
        return;
      }
      if (!coinNum) {
        this.$util.Toast("请输入划转金额");
        this.coinNum = null;
        return;
      }
      // if (coinNum > parseFloat(this.transferInfo.amount)) {
      //     this.Toast("超出最多金额！");
      //     return;
      // }
      let moveType1 =
        this.formType == 0
          ? "BALANCE"
          : this.formType == 1
          ? "TOKEN"
          : this.formType == 2
          ? "FB"
          : "";
      let moveType2 =
        this.toType == 0
          ? "BALANCE"
          : this.toType == 1
          ? "TOKEN"
          : this.toType == 2
          ? "FB"
          : "";
      let moveType = moveType1 + "_MOVE_" + moveType2;
      let data = {
        member: this.userId,
        balance: this.coinNum,
        currency: this.value,
        moveType: moveType
      };
      this.loading = true;
      this.$post1("member/balance/transferBalances", data)
        .then(res => {
          this.loading = false;
          if (res && res.status == "SUCCEED") {
            this.$util.Toast("划转成功", "success");
            this.$emit("transfer");
            this.close();
          } else {
            this.$util.Toast(res.errorMessage);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //查询资产列表
    getBalances() {
      let data = {};
      data = {
        member: this.userId,
        // balanceType: this.transferTit ? "BALANCE_BB" : "BALANCE_HY",
        currency: this.value
        // moveType: this.transferTit
        //   ? "BALANCE_MOVE_TOKEN"
        //   : "TOKEN_MOVE_BALANCE"
      };
      this.$get("member/balance/getBalances", data).then(res => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.contract =
            res.result[0] && res.result[0].tokenBalance
              ? res.result[0].tokenBalance
              : 0; //合约可划转
          this.bCount =
            res.result[0] && res.result[0].balance ? res.result[0].balance : 0; //合约可划转

          this.fbCount =
            res.result[0] && res.result[0].fbBalance
              ? res.result[0].fbBalance
              : 0; //合约可划转
          this.getAmount();
        }
      });
    },
    getAmount() {
      this.transferInfo.amount =
        this.formType == 0
          ? this.$util.SubString(this.bCount, 4)
          : this.formType == 1
          ? this.$util.SubString(this.contract, 4)
          : this.formType == 2
          ? this.$util.SubString(this.fbCount, 4)
          : 0;
    },
    //提币
    goWithdrawCoin() {
      this.setCurrency(this.list.currency);
      setTimeout(res => {
        this.$router.push("/user/assets/withdraw");
      }, 300);
    },
    //划转
    goTransfer() {
      this.dialogVisible = true;
      this.value = this.list.currency;
      this.contract = this.list.tokenBalance ? this.list.tokenBalance : 0; //合约可划转
      this.bCount = this.list.balance ? this.list.balance : 0; //合约可划转

      this.fbCount = this.list.fbBalance ? this.list.fbBalance : 0; //合约可划转
      this.getAmount();
    },
    //币种切换
    currencyChange() {
      this.getBalances();
    },
    // 切换转向币类型
    changeFormType() {
      this.getAmount();
    }
  }
};
</script>

<style lang='scss'>
.el-tabs__nav-wrap::after {
  background-color: rgba(19, 22, 37, 0.2) !important;
}
.orders .inputBox .el-input__inner {
  color: #fff !important;
}
.transaction {
  .el-tabs__item {
    color: #fff !important;
  }
}
</style>
<style lang="less" scoped>
/deep/.el-dialog__body {
  padding-top: 0;
}
/deep/.el-input--suffix .el-input__inner {
  padding-right: 50px;
}
/deep/.el-input__inner {
  height: 34px;
  line-height: 34px;
}
.code-list-li {
  .span {
    flex: 1;
    display: inline-block;
  }
  .code-list-btn {
    color: #40a9ff;
    cursor: pointer;
    margin-right: 20px;
  }
}
</style>