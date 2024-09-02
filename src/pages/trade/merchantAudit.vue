<template>
  <div class>
    <div v-if="storeState=='WAIT'" class="flex flex-column align_center">
      <img src="../../assets/images/examine.png" alt srcset class="mar-t-60 wid160 hei160" />
      <div class="size20 c222 bold mar-t-40">商户认证审核中</div>
    </div>
    <div v-if="storeState=='PASS'" class="mar-b-140">
      <!-- <el-tabs v-model="subTabType" class="mar-t-30">
        <el-tab-pane :label="item.currency" v-for="(item,i) in tabList" :key="i"></el-tab-pane>
      </el-tabs>-->
      <div class="flex flex_bet align-center mar-t-30">
        <el-tabs v-model="subTabType">
          <el-tab-pane :label="item.currency" v-for="(item,i) in tabList" :key="i"></el-tab-pane>
        </el-tabs>
        <span class="blue size16 pointer" @click="goPayment">收款方式</span>
      </div>
      <el-tabs v-model="type" :before-leave="switchTab" class="mar-t-10">
        <el-tab-pane label="购买广告"></el-tab-pane>
        <el-tab-pane label="出售广告"></el-tab-pane>
      </el-tabs>
      <div class="advertisement_content">
        <div class="adItems">
          <span class="name">币种</span>
          <div class="flex1">
            <chooseCoin
              @input="chooseCoins"
              :balanceList="tabList"
              :currency="currency"
              v-if="currency"
            ></chooseCoin>
          </div>
        </div>
        <div class="adItems">
          <span class="name">溢价</span>
          <div class="flex1 flex">
            <el-input v-model="formBox.upDownNumber" class="cellBorders size13 flex1" type="number">
              <span slot="suffix">%</span>
            </el-input>
            <span class="plus btn" @click="increase()"></span>
            <span class="reduce btn" @click="reduce()"></span>
          </div>
        </div>
        <div class="adItems">
          <div class="name flex align-center">
            <span>初始报价</span>
            <el-popover
              placement="bottom"
              width="240"
              trigger="hover"
              content="指数价格 * （1 + 溢价比例）"
            >
              <!-- <el-button >hover 激活</el-button> -->
              <!-- @click="initPriceFun()" -->
              <img
                slot="reference"
                src="../../assets/images/tips.png"
                alt
                srcset
                class="wid15 hei15 mar-r-5 pointer mar-l-5"
                style="vertical-align: sub;"
              />
            </el-popover>

            <!-- <span>:</span> -->
          </div>
          <span>{{initPrice|SubString(2)}}</span>
        </div>
        <div class="adItems">
          <div class="name flex align-center">
            <span v-show="type==1">可接受最低价格</span>
            <span v-show="type==0">可接受最高价格</span>
            <el-popover
              placement="bottom"
              width="300"
              trigger="hover"
              :content="type==0?'当初始报价高于此价格，则此价格为报价':'当初始报价低于此价格，则此价格为报价'"
            >
              <img
                slot="reference"
                src="../../assets/images/tips.png"
                alt
                srcset
                class="wid15 hei15 mar-r-5 pointer mar-l-5"
                style="vertical-align: sub;"
              />
            </el-popover>

            <!-- <img
              @click="heightRules(type==0?'high':'low')"
              src="../../assets/images/tips.png"
              alt
              srcset
              class="wid15 hei15 mar-l-5 pointer"
            />-->
          </div>
          <div class="flex1 flex">
            <el-input
              v-model="formBox.extremum"
              class="size13 flex1"
              placeholder="请输入价格"
              type="number"
            >
              <span slot="suffix">CNY</span>
            </el-input>
          </div>
        </div>
        <div class="adItems">
          <div class="name flex align-center">
            <span>数量</span>
          </div>
          <div class="flex1 flex">
            <el-input
              v-model="formBox.num"
              class="size13 flex1"
              placeholder="请输入交易数量"
              type="number"
            >
              <span slot="suffix">USDT</span>
            </el-input>
          </div>
        </div>
        <div class="adItems">
          <div class="name flex align-center">
            <span>OTC账户余额:</span>
            <!-- <span>:</span> -->
          </div>
          <span>{{balance}} {{currency}}</span>
        </div>
        <div class="adItems">
          <div class="name flex align-center">
            <span>购买金额</span>
            <!-- <span>:</span> -->
          </div>
          <el-input
            v-model="formBox.minPrice"
            class="size13 flex1"
            placeholder="购买金额"
            type="number"
          ></el-input>
        </div>
        <div class="adItems">
          <div class="name flex align-center">
            <span>最高成交额</span>
            <!-- <span>:</span> -->
          </div>
          <div class="flex1">
            <!-- <el-input v-model="formBox.maxQuota" class="size13 " placeholder="最高成交额" type="number"></el-input> -->
            <el-input v-model="formBox.maxQuota" placeholder="最高成交额" type="number" readonly></el-input>
          </div>
        </div>
        <div class="adItems flex">
          <span class="name">支付方式</span>
          <div class="flex1 align-center">
            <!-- <div v-if="chooseArr.length>0">
              <div v-for="(item,i) in chooseArr" :key="i" class="flex align-center">
                <img
                  src="../../assets/images/bankCard.png"
                  alt
                  srcset
                  class="wid16 hei16"
                  v-if="item=='BANKCARD'"
                />
                <img
                  src="../../assets/images/weixin.png"
                  alt
                  srcset
                  class="wid16 hei16 mar_l_10"
                  v-if="item=='WECHAT'"
                />
                <img
                  src="../../assets/images/zhifubao.png"
                  alt
                  srcset
                  class="wid16 hei16 mar_l_10"
                  v-if="item=='ALIAY'"
                />
              </div>
            </div>-->
            <!-- <i class="el-icon-arrow-right mar-l-10"></i> -->
            <!-- <el-select v-model="payType" multiple placeholder="请选择" style="width: 100%;"> -->
            <el-select v-model="payType" multiple placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="adItems textarea">
          <div class="name">
            <span>交易设置（选填）</span>
          </div>
          <div class="flex1">
            <!-- <el-input v-model="formBox.maxQuota" class="size13 " placeholder="最高成交额" type="number"></el-input> -->
            <el-input type="textarea" v-model="formBox.remarks" resize="none" placeholder="请输入交易说明"></el-input>
          </div>
        </div>
        <div class="adItems textarea">
          <div class="name flex align-center">
            <span class="mar-r-10">自动回复</span>
            <el-switch v-model="checked"></el-switch>
          </div>
          <div class="flex1">
            <!-- <el-input v-model="formBox.maxQuota" class="size13 " placeholder="最高成交额" type="number"></el-input> -->
            <el-input type="textarea" v-model="formBox.autoMsg" resize="none"></el-input>
          </div>
        </div>
        <div class="mar-t-30 flex jut_center">
          <el-button type="primary" @click="submitEvent" :loading="loading">发布广告</el-button>
          <el-button @click="back">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chooseCoin from "../../components/common/chooseCoin";
import { mapActions } from "vuex";
export default {
  name: "merchantAudit",
  props: ["userInfo"],
  components: {
    chooseCoin,
  },
  data() {
    return {
      tabList: [
        {
          currency: "USDT",
        },
      ],
      subTabType: 0,
      storeState: "", //商户申请状态
      type: 0, //0够买广告1出售广告
      loading: false, //加载中
      currency: "",
      balance: "",
      formBox: {
        remarks: "", //备注
        autoMsg: "", //自动回复
        price: null, //价格
        upDownNumber: 0, //溢价
        extremum: null, //最高价格
        num: null, //交易数量
        // leastCount: null, //最少成交数
        minPrice: null, //最小金额
        maxQuota: null, //最高成交金额
        nowPrice: 0,
        maxRatio: 0, //溢价配置
        minRatio: 0,
      },
      maxRatio: 0,
      minRatio: 0,
      initPrice: 7, //初始价格
      chooseArr: [],
      checked: false, //自动回复switch
      isEdit: false, //编辑订单
      initType: false,
      payType: [],
      options: [
        {
          value: "BANKCARD",
          label: "银行卡",
        },
        {
          value: "ALIAY",
          label: "支付宝",
        },
        {
          value: "WECHAT",
          label: "微信",
        },
      ],
    };
  },
  computed: {
    // payType() {
    //   this.chooseArr = this.$store.state.payType;
    //   return this.$store.state.payType;
    // },
  },
  watch: {
    userInfo(val) {
      if (!val) return;
      this.storeState = val.storeState;
      if (this.storeState != "WAIT" && this.storeState != "PASS") {
        this.$util.Toast("发布广告需要先申请商户，请先申请商户", "warning");
        setTimeout((res) => {
          this.$router.go(-1);
        }, 1000);
      }
    },
    "formBox.upDownNumber"(val) {
      var reg = /^(\-?)\d+$/;
      if (!this.maxRatio || !this.minRatio) {
        this.formBox.upDownNumber = null;
        this.initPrice = this.formBox.nowPrice;
        return;
      }
      if (!reg.test(val)) {
        this.formBox.upDownNumber = 0;
        this.initPrice = this.formBox.nowPrice;
        return;
      }

      this.initPrice = this.formBox.nowPrice * (1 + parseFloat(val / 100));
      this.formBox.maxQuota = this.$util.SubString(
        this.initPrice * parseFloat(this.formBox.num),
        2
      );

      if ((val * 10000 - this.maxRatio * 10000) / 10000 >= 0) {
        this.formBox.upDownNumber = this.maxRatio;
        return;
      }
      if ((val * 10000 + this.minRatio * 10000) / 10000 <= 0) {
        // this.upDownNumber = 0-this.minRatio;
        this.formBox.upDownNumber = "-" + 30;
        return;
      }
      this.formBox.upDownNumber = this.$util.SubString(val, 4);
    },
    "formBox.minPrice"(val) {
      if (!val) {
        this.formBox.minPrice = null;
        return;
      }
      if (val - 0 < 0) return (this.formBox.minPrice = null);
      val = val + "";
      val = val.replace(/\s+/g, "");
      var minPrice = this.formBox.maxQuota
        ? val - this.formBox.maxQuota > 0
          ? this.formBox.maxQuota
          : val
        : val;
      this.formBox.minPrice = this.$util.SubString(minPrice, 2);
    },
    "formBox.maxQuota"(val) {
      this.formBox.minPrice = null;
    },
    "formBox.num"(val) {
      if (!val) {
        this.formBox.num = null;
        return;
      }
      if (val - 0 < 0) return (this.formBox.num = null);
      val = val + "";
      val = val.replace(/\s+/g, "");
      this.formBox.num = this.$util.SubString(val, 4);
      this.formBox.maxQuota = this.$util.SubString(
        this.initPrice * parseFloat(this.formBox.num),
        2
      );
    },
    "formBox.extremum"(val) {
      if (!val) {
        this.formBox.extremum = null;
        return;
      }
      if (val - 0 < 0) return (this.formBox.extremum = 0);
      val = val + "";
      val = val.replace(/\s+/g, "");
      this.formBox.extremum = this.$util.SubString(val, 4);
    },
    "formBox.remarks"(val) {
      if (!val) {
        return;
      }
      this.formBox.remarks = val.replace(/\s+/g, "");
    },
    // payType(val) {
    //   if (!val) {
    //     return;
    //   }
    //   console.log(val)
    //   this.chooseArr = val;
    // },
  },
  methods: {
    ...mapActions(["setPayType"]),
    //  申请成为商户

    // 币种选择
    chooseCoins(data) {
      if (data == this.currency) return;
      this.currency = data;
      this.getBalances();
      this.getPrice();
    },
    //计数器增加
    increase() {
      var upDownNumber = this.formBox.upDownNumber;
      this.formBox.upDownNumber = this.$util.SubString(
        (upDownNumber * 10000 + 1 * 10000) / 10000,
        4
      );
    },
    //减
    reduce() {
      var upDownNumber = this.formBox.upDownNumber;
      this.formBox.upDownNumber = this.$util.SubString(
        (upDownNumber * 10000 - 1 * 10000) / 10000
      );
    },
    // // 溢价提示
    // initPriceFun() {
    //   this.$alert("指数价格 * （1 + 溢价比例）", "初始报价", {
    //     confirmButtonText: "确定",
    //     callback: (action) => {},
    //   });
    // },
    // // 可接受最高或最低价格
    // heightRules(type) {
    //   if (type == "high") {
    //     this.$alert("当初始报价高于此价格，则此价格为报价", "可接受最高价格", {
    //       confirmButtonText: "确定",
    //       callback: (action) => {},
    //     });
    //   } else {
    //     this.$alert("当初始报价低于此价格，则此价格为报价", "可接受最低价格", {
    //       confirmButtonText: "确定",
    //       callback: (action) => {},
    //     });
    //   }
    // },
    // 选择支付方式
    goPayment() {
      this.$router.push({
        path: "/payment",
      });
    },
    switchTab(active, old) {
      if (old == undefined || old == active) return;
      if (this.type != active) {
        this.initType = true;
      }
      if (this.isEdit && this.initType) {
        this.$util.Toast("编辑订单不可切换订单类型", "warning");
        return false;
      }
    },
    //获取溢价配置
    getratioConfig() {
      this.$post("otc/order/ratioConfig", {}).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.maxRatio = parseFloat(res.result.maxRatio) || 0;
          this.minRatio = parseFloat(res.result.minRatio) || 0;
        }
      });
    },
    getTabList() {
      this.$post("otc/order/currencyList", {}).then((res) => {
        if (res && res.status == "SUCCEED") {
          this.tabList = res.result;
          this.currency = res.result[0] ? res.result[0].currency : "";
          this.getBalances();
          this.getPrice();
        }
      });
    },
    getBalances() {
      var data = {
        member: this.$store.state.userId,
        currency: this.currency,
      };
      this.$get("member/balance/getBalances", data).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.balance = this.$util.SubString(res.result[0].fbBalance, 4);
        }
      });
    },
    //返回上一页
    back() {
      this.$router.go(-1);
    },
    goAverList() {
      this.$router.push("./advertiseList");
    },
    //发布广告
    submitEvent() {
      if (this.type == 1) {
        //出售
        if (this.balance - 0 <= 0 || !this.balance) {
          this.$util.Toast("当前余额不足", "warning");
          return;
        }
      }
      if (!this.currency) {
        this.$util.Toast("请选择币种", "warning");
        return;
      }

      if (!this.formBox.extremum || !parseFloat(this.formBox.extremum)) {
        if (this.type == 0) {
          this.$util.Toast("请输入可接受最高价格", "warning");
        } else {
          this.$util.Toast("请输入可接受最低价格", "warning");
        }
        return;
      }
      if (!this.formBox.num || !parseFloat(this.formBox.num)) {
        this.$util.Toast("请输入数量", "warning");
        return;
      }
      if (!this.formBox.minPrice || !parseFloat(this.formBox.minPrice)) {
        this.$util.Toast("请输入购买金额", "warning");
        return;
      }
      // if (!(this.formBox.leastCount - 0)) {
      //   this.$util.Toast("请输入最少成交单数");
      //   return;
      // }
      // if (this.chooseArr.length == 0) {
      //   this.$util.Toast("请选择支付方式", "warning");
      //   return;
      // }
      if (this.payType.length == 0) {
        this.$util.Toast("请选择支付方式", "warning");
        return;
      }

      var payType = this.payType.join("-");
      var url;
      var data = {
        userId: this.$store.state.userId,
        upDownNumber: this.formBox.upDownNumber
          ? parseFloat(this.formBox.upDownNumber)
          : 0,
        extremum: parseFloat(this.formBox.extremum), //可接受最低价格
        num: parseFloat(this.formBox.num),
        minPrice: parseFloat(this.formBox.minPrice),
        // minPrice: this.formBox.leastCount,
        payType: payType,
        remarks: this.formBox.remarks, //交易说明
        autoMsg: this.formBox.autoMsg, //自动回复
        autoStatus: this.checked ? "OPEN" : "UNOPEN",
      };
      if (this.isEdit) {
        url = "otc/order/updataOrder";
        data["orderId"] = this.formBox.id;
      } else {
        url = "otc/order/orderReleasing";
        data["currency"] = this.currency;
        data["direction"] = this.type == 0 ? "BUY" : "SELL";
      }
      this.loading = true;
      this.$post1(url, data)
        .then((res) => {
          this.loading = false;
          if (res && res.status == "SUCCEED") {
            this.$util.Toast("发布成功", "success");
            setTimeout(() => {
              this.$router.push("/trade/advertiseList");
            }, 500);
          } else {
            this.$util.Toast(res.errorMessage);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //获取当前价
    getPrice() {
      this.$post1("otc/order/getPrice", {
        currency: this.currency,
      }).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.formBox.nowPrice = res.result;
          this.initPrice = res.result;
        }
      });
    },
  },
  activated() {
    //商户信息
    this.getTabList();
    this.getratioConfig();
    let list = this.$GLOBAL.advertiseDetail;

    if (list.direction == "BUY") {
      this.type = "0";
    }
    if (list.direction == "SELL") {
      this.type = "1";
    }

    if (list.id) {
      this.formBox = list;
      this.isEdit = true;
      this.initPrice = this.formBox.nowPrice;
      this.checked = this.formBox.autoStatus == "OPEN";

      this.payType = this.formBox.payType.split("-");
    }
    // if (this.$route.query && this.$route.query.list && !this.payType) {
    //   this.chooseArr = list.payType.split("-");
    //   console.log(payType);
    // }
  },
  deactivated() {
    this.$GLOBAL.setAdvertiseDetail("");
    this.formBox = {
      remarks: "", //备注
      autoMsg: "", //自动回复
      price: null, //价格
      upDownNumber: 0, //溢价
      extremum: null, //最高价格
      num: null, //交易数量
      // leastCount: null, //最少成交数
      minPrice: null, //最小金额
      maxQuota: null, //最高成交金额
      nowPrice: 0,
      maxRatio: 0, //溢价配置
      minRatio: 0,
    };
    this.payType = [];
    this.isEdit = false;
    this.initType = false;
    this.checked = false;
  },
};
</script>
<style lang="less">
</style>
<style lang="less" scoped>
/deep/.el-tabs__nav-wrap::after {
  display: none;
}
/deep/.el-tabs__item {
  font-size: 16px;
}
/deep/.el-input__suffix {
  height: 100%;
}
/deep/.el-input__suffix-inner {
  display: flex;
  align-items: center;
  margin-right: 5px;
  height: 100%;
  color: #333;
}
.advertisement_content {
  width: 600px;
  .adItems {
    display: flex;
    align-items: center;
    margin-top: 20px;
    &.textarea {
      align-items: start;
    }

    .name {
      margin-right: 10px;
      min-width: 120px;
    }
    .btn {
      width: 60px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(128, 164, 227, 1);
      border: 1px solid rgba(60, 120, 225, 1);
      border-radius: 5px;
      margin-left: 5px;
      font-weight: bold;
      color: #fff;
      cursor: pointer;

      &.plus::after {
        content: "+";
        font-size: 20px;
      }

      &.reduce::after {
        content: "-";
        font-size: 24px;
      }
    }
  }
}
</style>
