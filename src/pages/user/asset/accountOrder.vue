<template>
  <div class="margin-right-bar" style="overflow: hidden;">
    <h2 class="recharge-header">
      <!-- <router-link to="/user/assets/balances" class="pointer blue" style="color: #357ce1;">资产 ></router-link>
      <span class="size16">{{ $t('message.account_order') }}</span>-->
      <el-page-header @back="goBack" :content="$t('message.account_order')" title></el-page-header>
    </h2>

    <div class="recharge_content bg-fff mar-t-20 min-hei500 mar-b-20">
      <el-tabs v-model="curType" class="pad-l-r-30 pad-t-15" :before-leave="switchTab">
        <el-tab-pane label="充币记录"></el-tab-pane>
        <el-tab-pane label="提币记录"></el-tab-pane>
        <el-tab-pane label="划转记录"></el-tab-pane>
      </el-tabs>
      <div class="recharge-table">
        <div class="table-title">
          <p class="txColoe_1 flex1">币种</p>
          <p class="txColoe_1 flex1">类型</p>
          <p class="txColoe_1 flex1">{{ $t('message.number') }}</p>
          <p class="txColoe_1 flex1">{{ $t('message.time') }}</p>
          <p class="txColoe_1 flex1">{{ $t('message.status') }}</p>
        </div>
        <div v-if="isLoading">
          <span class="el-icon-loading loading"></span>
        </div>
        <ul class="table_ul" v-else>
          <div v-if="capitalRecordsList.length>0">
            <li
              class="brColor_1 state_li flex pad-t-b-10"
              v-for="(list,i) of capitalRecordsList"
              :key="i"
            >
              <!-- 币种 -->
              <div class="pad-l-20 flex1">
                <span class="rightText c666" v-if="list.currency.indexOf('USDT')>=0">USDT</span>
                <span class="rightText c666" v-else>{{list.currency}}</span>
              </div>
              <!-- 类型 -->
              <div class="pad-l-20 flex1">
                <div v-if="curType==2">
                  <span v-if="list.type =='BALANCE_MOVE_TOKEN'" class="eils c666">币币账户划转到合约账户</span>
                  <span v-if="list.type =='BALANCE_MOVE_ASSETS'" class="eils c666">币币账户划转到充提账户</span>
                  <span v-if="list.type =='BALANCE_MOVE_FB'" class="eils c666">币币账户划转到法币账户</span>
                  <span v-if="list.type =='TOKEN_MOVE_BALANCE'" class="eils c666">合约账户划转到币币账户</span>
                  <span v-if="list.type =='TOKEN_MOVE_FB'" class="eils c666">合约账户划转到法币账户</span>
                  <span v-if="list.type =='TOKRN_MOVE_ASSETS'" class="eils c666">合约账户划转到充提账户</span>
                  <span v-if="list.type =='FB_MOVE_BALANCE'" class="eils c666">法币账户划转到币币账户</span>
                  <span v-if="list.type =='FB_MOVE_TOKEN'" class="eils c666">法币账户划转到合约账户</span>
                  <span v-if="list.type =='FB_MOVE_ASSETS'" class="eils c666">法币账户划转到充提账户</span>
                  <span v-if="list.type =='ASSETS_MOVE_BALANCE'" class="eils c666">充提账户划转到币币账户</span>
                  <span v-if="list.type =='ASSETS_MOVE_FB'" class="eils c666">充提账户划转到法币账户</span>
                  <span v-if="list.type =='ASSETS_MOVE_TOKEN'" class="eils c666">充提账户划转到合约账户</span>
                </div>
                <div v-else>
                  <span class="eils c333">{{list.type}}</span>
                </div>
              </div>
              <!-- 数量 -->
              <div class="flex1 pad-l-20">
                <div v-if="curType==1">
                  <span class="c333">{{list.balance|SubString(4)}}</span>
                </div>
                <div v-else>
                  <span class="c666">{{list.fee|SubString(4)}}</span>
                </div>
              </div>
              <!-- 时间 -->
              <div class="flex1 pad-l-20">
                <p class="c999" v-if="curType==2">{{list.createTime|yndhms}}</p>
                <p class="c999" v-else-if="curType==0">{{list.createTime}}</p>
                <p class="c999" v-else>{{list.extractTime}}</p>
              </div>
              <!-- 状态 -->
              <div class="flex1 pad-l-20">
                <div class="statusBtn" v-if="curType!=1">
                  <span class="span sucess">成功</span>
                </div>
                <div class="statusBtn" v-else>
                  <span class="span err" v-if="list.state=='REJECT'">失败</span>
                  <span class="span sucess" v-if="list.state=='PASS'">成功</span>
                  <span class="span conduct c777" v-if="list.state=='CREATE'">进行中</span>
                </div>
              </div>
            </li>
          </div>
          <li v-else class="li_sty">
            <nodata class="mar-t-50" />
          </li>
        </ul>
      </div>
      <el-pagination
        v-show="capitalRecordsList.length>0"
        class="v-right mar-t-20 pad-b-20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import vueQr from "vue-qr";
export default {
  name: "recharge",
  components: {
    vueQr,
  },
  data() {
    return {
      currency: "", //当前币种
      curType: 0, //充币记录，2提币记录，3划转记录
      capitalRecordsList: [], //资金记录列表
      pageNum: 1,
      pageSize: 10,
      total: 0,
      isLoading: false,
    };
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
  },
  activated() {
    this.getCapitalRecords(this.capitalRecordsList.length>0?'':1);
  },
  deactivated(){
    this.pageNum = 1;
  },
  methods: {
     goBack() {
      this.$router.go(-1);
    },
    //币种切换
    switchTab(active, old) {
      if (old == active) return;
      this.capitalRecordsList = [];
      this.pageNum = 1;
      this.total = 0;
      this.curType = active;
      this.getCapitalRecords(1); //获取资金记录
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getCapitalRecords();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getCapitalRecords();
    },
    //获取资金记录
    getCapitalRecords(type) {
      let url;
      var data = {
        memberId: this.$store.state.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      if (type) this.isLoading = true;
      if (this.curType == 1) {
        //提现
        url = "member/balance/withdraw_recording";
      } else if (this.curType == 0) {
        url = "member/balance/recharge_recording";
        //充币
      } else if (this.curType == 2) {
        //划转
        url = "member/balance/transfer_recording";
      }
      this.$get(url, data)
        .then((res) => {
          this.isLoading = false;
          if (res && res.status == "SUCCEED" && res.result) {
            this.capitalRecordsList = res.result.records || [];
            this.total = res.result.total;
            this.pageNum = this.pageNum + 1;
          }
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-tabs__nav-wrap::after {
  background: transparent !important;
}

.copy {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  word-break: break-all;
  line-height: 28px;
  max-width: 60%;
}
.statusBtn {
  display: flex;
  align-items: center;
  .span {
    text-align: center;
    font-size: 14px;
    &.err {
      border-color: #f35758;
      color: #f35758;
    }
    &.sucess {
      border-color: #10b887;
      color: #10b887;
    }
    &.conduct {
      border-color: #777777;
    }
  }
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
        .brColor_1 {
          border-bottom: 1px solid #f4f4f6;
          &:hover {
            background: #f8f9fb;
          }
        }
      }
    }
  }
}
</style>
