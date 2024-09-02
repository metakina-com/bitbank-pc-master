<template>
  <div class="assetBanlance">
    <div class="margin-right-bar" style="overflow: hidden;">
      <div class="assets-list">
        <div class="cube-ui-title" style="overflow: hidden;">
          <div class="title_left">
            <h2 class="txColoe_2">{{ $t('message.balances') }}</h2>
            <p class>
              总资产折合：
              <span class="tx_color">{{allUsdt|SubString(4)}} USDT</span>
              <span class="tx_color">≈{{allCny|SubString(2)}} CNY</span>
            </p>
          </div>
          <div class="title_right">
            <p>
              <!-- <el-input
                v-model="searchText"
                :placeholder="$t('message.key')"
                class="searchBox"
                prefix-icon="el-icon-search"
                clearable
              ></el-input>-->
              <!-- <i class="el-icon-search"></i> -->
            </p>
            <el-checkbox
              v-model="showNum"
              class="showNum flex align-center"
              @click="showNum=!showNum"
            >隐藏小额资产</el-checkbox>
          </div>
        </div>
        <div class="bg-fff mar-b-20">
          <div class="flex_bet pad-l-r-30 pad-t-15 align-center">
            <el-tabs v-model="curType" class :before-leave="switchTab">
              <el-tab-pane label="币币"></el-tab-pane>
              <el-tab-pane label="合约"></el-tab-pane>
              <el-tab-pane label="法币"></el-tab-pane>
            </el-tabs>
            <span class="size14 pointer blue line40" @click="goList">财务记录</span>
          </div>

          <div class="code-list min-hei500">
            <div class="title">
              <p
                v-for="(val, index) in titleList"
                :key="index"
              >{{index==3?curType==1?'当前':'折合（CNY）':val}}</p>
            </div>
            <div v-show="!showNum">
              <div v-if="isLoading">
                <span class="el-icon-loading loading"></span>
              </div>
              <div v-else>
                <ul v-if="assetList.length>0" class="code-list-item gundong1">
                  <assetItem
                    v-for="(item,i) in assetList"
                    :key="i"
                    :list="item"
                    :curType="curType"
                    :balanceList="assetList"
                    @transfer="transfer"
                  ></assetItem>
                </ul>
                <div v-else>
                  <nodata  class="mar-t-50"/>
                </div>
              </div>
            </div>
            <div v-show="showNum">
              <div v-if="isLoading">
                <span class="el-icon-loading loading"></span>
              </div>
              <div v-else>
                <ul v-if="assetList_copy.length>0" class="code-list-item gundong1">
                  <assetItem
                    v-for="(item,i) in assetList_copy"
                    :key="i"
                    :list="item"
                    :curType="curType"
                    :balanceList="assetList"
                    @transfer="transfer"
                  />
                </ul>
                <div v-else>
                  <nodata  class="mar-t-50"/>
                  <!-- <img src="../../../assets/images/Status-pic.jpg" alt /> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import assetItem from "../../../components/asset/assetItem";
export default {
  name: "balances",
  components: {
    assetItem,
  },
  data() {
    return {
      showNum: false,
      searchText: "",
      showNoDate: true,
      codeList: [],
      totalMoney: "",
      hideCodeList: [],
      hideCodeListCopy: [],
      codeListCopy: [],
      allUsdt: "",
      allCny: "",
      curType: 0, //币币，2合约，3法币，4充提
      assetList: [], //资产列表
      assetList1: [],
      assetList_copy: [],
      assetList_copy1: [],
      sett: null, //资金记录定时器
      sett1: null, //总资金定时器
      isLoading: false,
    };
  },
  computed: {
    titleList() {
      return [
        this.$t("message.coin"),
        this.$t("message.available_balance"),
        this.$t("message.frozen_balance"),
        this.$t("message.value"),
        this.$t("message.action"),
      ];
    },
    userId() {
      return this.$store.state.userId;
    },
  },
  watch: {
    searchText(val) {
      this.searchHandle(val);
    },
    showNum(val) {
      let searchText = this.searchText;
      this.searchHandle(searchText);
    },
  },
  deactivated() {
    clearTimeout(this.sett);
    this.sett = null;
    clearTimeout(this.sett1);
    this.sett1 = null;
  },
  activated() {
    this.initBalanceListAll(); //资产列表 总的

    this.initBalanceList(this.assetList.length>0?'':1); //获取资产列表
  },
  methods: {
    //获取总资产
    initBalanceListAll() {
      this.$get("member/balance/getAllBalance", {
        member: this.userId,
      }).then((res) => {
        this.isLoading = false;
        if (res && res.status == "SUCCEED") {
          this.allUsdt = res.result.usdtPrice || 0;
          this.allCny = res.result.cnyPrice || 0;
        }
        this.sett1 = setTimeout(() => {
          this.initBalanceListAll();
        }, 5000);
      });
    },
    //充值记录
    goList() {
      this.$router.push("/user/assets/accountOrder");
    },
    //币种切换
    switchTab(active, old) {
      if (old == undefined || old == active) return;
      this.assetList = [];
      this.searchText = "";
      this.curType = active;
      clearTimeout(this.sett);
      this.sett = null;
      this.initBalanceList(1); //获取资产列表
    },
    //划转成功
    transfer() {
      clearTimeout(this.sett);
      this.sett = null;
      this.initBalanceList(); //获取资产列表
    },
    initBalanceList(type) {
      if(type) this.isLoading = true;
      let coinType =
        this.curType == 0
          ? "SPOT"
          : this.curType == 1
          ? "CONTRACT"
          : this.curType == 2
          ? "FB"
          : this.curType == 3
          ? "ASSETS"
          : "RELEASE";
      this.$get("member/balance/getBalanceList", {
        member: this.userId,
        coinType: coinType,
      })
        .then((res) => {
           this.isLoading = false;
          if (res && res.status == "SUCCEED" && res.result) {
            if (this.curType == 5) {
              res.result.balances = res.result.balances.filter(
                (elem) => elem.currency == "FVC"
              );
            }
            this.assetList = res.result.balances || [];
            this.assetList1 = res.result.balances || [];
            if (this.curType == 0) {
              this.assetList_copy = res.result.balances.filter(
                (ele) => ele.balance > 0
              );
            }
            if (this.curType == 1) {
              this.assetList_copy = res.result.balances.filter(
                (ele) => ele.tokenBalance > 0
              );
            }
            if (this.curType == 2) {
              this.assetList_copy = res.result.balances.filter(
                (ele) => ele.fbBalance > 0
              );
            }
            this.assetList_copy1 = this.assetList_copy;
          }
          this.sett = setTimeout(() => {
            this.initBalanceList();
          }, 5000);
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
    //搜索列表
    searchHandle(val) {
      if (val == "") {
        //恢复原来的数据
        this.assetList = this.assetList1;
        this.assetList_copy = this.assetList_copy1;
      } else {
        val = val.toUpperCase();
        let copylist = this.showNum ? this.assetList_copy1 : this.assetList1;
        // console.log(this.copyTokenCurlist);
        let arr = [];
        copylist.forEach((ele) => {
          if (ele.currency.indexOf(val) != -1) {
            arr.push(ele);
          }
        });
        if (this.showNum) {
          this.assetList_copy = arr;
        } else {
          this.assetList = arr;
        }
      }
    },
  },
};
</script>
<style lang="less">
.assetBanlance {
  .el-tabs__nav-wrap::after {
    background: transparent !important;
  }
  .el-tabs__item {
    font-size: 16px;
    // color: #d2d6ec !important;
  }
  .el-input__icon {
    line-height: initial !important;
  }
  .el-checkbox__input {
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="less" scoped>

.assets-list {
  // padding: 40px 20px 30px;
  overflow: hidden;

  .cube-ui-title {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 15px 30px;
    margin: 20px 0;
    .title_left {
      h2 {
        font-weight: 500;
        margin-bottom: 10px;
        // color: #fff;
      }

      .tx_color {
        color: #e7794b;
      }
    }

    .title_right {
      display: flex;
      align-items: center;

      p {
        position: relative;

        .searchBox {
          // background-color: #2d365d;
        }

        .el-icon-search {
          position: absolute;
          right: 15px;
          top: 7px;
          font-size: 19px;
        }
      }

      .showNum {
        margin-left: 30px;
      }
    }
  }
}

.code-list {
  padding: 0 15px;
  // background-color: #353b51;
  // min-height: 600px;

  .title,
  li {
    color: #333;
    padding: 18px 15px;
    display: flex;
    border-bottom: 1px solid #f4f4f6;
  }
}

.code-list li:last-child {
  border: none;
}

.code-list .title p,
.code-list li p {
  flex: 1;
}

/* element ui */
.searchBox /deep/ .el-input__inner {
  // background: transparent;
  border: 1px solid #d1d3df;
  height: 33px;
  line-height: 35px;
  width: 200px;
}

.showNum /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.code-list-item {
}

.code-list-item li {
  height: 50px;
  display: flex;
  border-bottom: 1px solid #f4f4f6;
  align-items: center;
  padding: 0 15px;
}

.code-list-item li:hover {
  background-color: #f8f9fb;
}
</style>
<style>
.el-checkbox__inner {
  /* background-color: #2d365d; */
}

/* .el-checkbox__label {
  color: #999;
} */
</style>