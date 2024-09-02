<template>
  <div class="order_detail" v-if="orderInfo.id">
    <div class="contents pad-t-30 pad-b-30">
      <div class="bg-fff hei60 flex align-center size20 pad-l-30">
        <el-page-header @back="goBack" title>
          <span
            slot="content"
            v-if="userId==orderInfo.userId"
          >{{orderInfo.userDirection=="SELL"?'卖出':'买入'}}{{orderInfo.currency}}</span>
          <span
            slot="content"
            v-else
          >{{orderInfo.storeDirection=="SELL"?'卖出':'买入'}}{{orderInfo.currency}}</span>
        </el-page-header>
      </div>
      <div class="bg-fff min-hei500 mar-t-30 pad-l-r-30 pad-t-b-30">
        <div class="flex align-center">
          <span>订单编号：</span>
          <div class="flex flex1 align_center c222 size14" v-if="orderInfo.id">
            <span>{{orderInfo.id}}</span>
          </div>
          <div class="size14">
            <span class="c999 font1" v-if="orderInfo.status=='NONPAYMENT'">待付款</span>
            <span class="c999 font1" v-if="orderInfo.status=='PAYMENT'">待放币</span>
            <span class="c999 font1" v-if="orderInfo.status=='FINISH'">已完成</span>
            <span class="c999 font1" v-if="orderInfo.status=='CALLOFF'">已取消</span>
            <!-- <span class="size13 c999 font1" v-if="orderInfo.status=='NONPAYMENT'">已完成</span> -->
          </div>
        </div>
        <div>
          <div class="flex align-center flex_bet mar-t-20" v-if="userId!=orderInfo.userId">
            <span>真实姓名</span>
            <span>{{orderInfo.userName}}</span>
          </div>
          <div class="flex align-center flex_bet mar-t-20" v-else>
            <span>真实姓名</span>
            <span>{{orderInfo.storeName}}</span>
          </div>
          <div class="flex align-center flex_bet mar-t-20" v-if="userId!=orderInfo.userId">
            <span>手机号</span>
            <span>{{orderInfo.userPhone}}</span>
          </div>
          <div class="flex align-center flex_bet mar-t-20" v-else>
            <span>手机号</span>
            <span>{{orderInfo.storePhone}}</span>
          </div>
          <div class="flex align-center flex_bet mar-t-20">
            <span>交易金额</span>
            <span>{{orderInfo.price|SubString(2)}}</span>
          </div>
          <div class="flex align-center flex_bet mar-t-20">
            <span>数量</span>
            <span>{{orderInfo.num|SubString(4)}}</span>
          </div>
          <div class="flex align-center flex_bet mar-t-20">
            <span>价格</span>
            <span>{{orderInfo.totalPrice|SubString(2)}}</span>
          </div>
        </div>
        <!--  -->
        <div
          v-if="(userId==orderInfo.userId&&orderInfo.userDirection=='BUY')||(userId!=orderInfo.userId&&orderInfo.storeDirection=='BUY')"
        >
          <div id="payType" v-if="orderInfo.payType" class="flex align-center flex_bet mar-t-20">
            <span>支付方式</span>
            <span class="blue" v-if="orderInfo.payType=='WECHAT'">微信</span>
            <span class="blue" v-if="orderInfo.payType=='ALIAY'">支付宝</span>
            <span class="blue" v-if="orderInfo.payType=='BANKCARD'">银行卡</span>
          </div>
          <div
            title="支付方式"
            id="payType"
            class="flex align-center flex_bet mar-t-20"
            v-if="!orderInfo.payType&&orderInfo.status=='NONPAYMENT'"
          >
            <span>支付方式</span>
            <el-select v-model="payType" placeholder="请选择">
              <el-option v-for="(item,i) in actions" :key="i" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <!-- <span class="blue">{{payType}}</span> -->
          </div>

          <div v-show="payName" class="a_center size14 mar-t-20 v-center">姓名：{{payName}}</div>

          <div v-show="payImg" class="pad-10 flex jut_center">
            <img class="wid200" :src="payImg" />
          </div>

          <div>
            <div v-show="bankName" class="linehei30 a_center size14">开户行：{{bankName}}</div>

            <div v-show="bankAddress" class="linehei30 a_center size14">支行：{{bankAddress}}</div>

            <div v-show="bankCard" class="linehei30 a_center size14">银行卡号：{{bankCard}}</div>
          </div>
        </div>
        <div
          v-if="(userId==orderInfo.userId&&orderInfo.userDirection=='SELL')||(userId!=orderInfo.userId&&orderInfo.storeDirection=='SELL')"
        >
          <div id="payType" v-if="orderInfo.payType" class="flex align-center flex_bet mar-t-20">
            <span>支付方式</span>
            <span class="blue" v-if="orderInfo.payType=='WECHAT'">微信</span>
            <span class="blue" v-if="orderInfo.payType=='ALIAY'">支付宝</span>
            <span class="blue" v-if="orderInfo.payType=='BANKCARD'">银行卡</span>
          </div>
        </div>
        <div class="darkLine mar-t-20"></div>
        <div
          class="evaluate pad-t-b-30 flex flex-column jut_center"
          v-if="orderInfo.status=='FINISH'"
        >
          <!-- <p class="size13 font1 c999">对该订单进行评价</p> -->
          <div class="btnBox a_center pad_t_b_30">
            <!-- <el-button type="info" size="normal" class="btns">已完成</el-button> -->
            <el-button
              class="btns cancels"
              v-if="orderInfo.appealStatus=='NORMAL'"
              @click="appealHandle(orderInfo.id)"
            >申诉</el-button>
          </div>
          <p class="size14 font1 blue v_center mar-t-20">平台客服不会参与任何资金往来，请注意识别风险</p>
        </div>
        <!-- v-else -->
        <div class="payBox pad-t-b-30" v-if="orderInfo.status!='FINISH'">
          <div
            v-if="orderInfo.status=='NONPAYMENT'"
            class="flex align-center size15 mar-b-15 mar-t-30"
          >
            <p class="font1 c999">交易备注:</p>
            <div class="font1 c999 mar_t_8 flex">
              请在
              <count-down
                :time="time"
                class="blue"
                ref="countDown"
                type="m"
                @finish="countDownFinish"
              />内完成付款，并点击确认付款，超时将自动取
              消订单。
            </div>
          </div>
          <div v-if="userId==orderInfo.userId" class="flex flex_center pad_t_15 pad_b_10">
            <el-button
              class="btns cancels"
              v-if="(orderInfo.status=='PAYMENT'||orderInfo.status=='CALLOFF')&&orderInfo.appealStatus=='NORMAL'"
              @click="appealHandle(orderInfo.id)"
            >申诉</el-button>
            <div v-if="orderInfo.userDirection=='BUY'" class="btnBox flex">
              <el-button
                size="normal"
                class="btns cancels"
                @click="cancelOrder(orderInfo.id)"
                v-if="orderInfo.status=='NONPAYMENT'"
                :loading="loading"
              >取消订单</el-button>
              <el-button
                type="primary"
                size="normal"
                class="btns"
                @click="goPayment(2)"
                :loading="loading1"
                v-if="orderInfo.status=='NONPAYMENT'"
              >确认付款</el-button>
              <el-button
                type
                size="normal"
                class="btns defaultBg"
                disabled
                v-if="orderInfo.status=='PAYMENT'"
              >等待放币</el-button>
            </div>
            <!--  flex_center pad_t_15 pad_b_10 -->
            <div v-else class="btnBox flex">
              <!-- <el-button
              size="normal"
              class="btns cancels"
              v-if="orderInfo.status=='PAYMENT'||orderInfo.status=='CALLOFF'"
              @click="appealHandle(orderInfo.id)"
              >申诉</el-button>-->
              <el-button
                type
                size="normal"
                class="btns defaultBg"
                disabled
                v-if="orderInfo.status=='NONPAYMENT'"
              >等待付款</el-button>
              <el-button
                type="primary"
                size="normal"
                class="btns"
                @click="goPayment(1)"
                :loading="loading1"
                v-if="orderInfo.status=='PAYMENT'"
              >确认放币</el-button>
            </div>
          </div>
          <div v-else class="btnBox flex flex_center pad_t_15 pad_b_10">
            <el-button
              size="normal"
              class="btns cancels"
              v-if="(orderInfo.status=='PAYMENT'||orderInfo.status=='CALLOFF')&&orderInfo.appealStatus=='NORMAL'"
              @click="appealHandle(orderInfo.id)"
            >申诉</el-button>
            <div v-if="orderInfo.storeDirection=='BUY'" class="btnBox flex">
              <el-button
                size="normal"
                class="btns cancels"
                @click="cancelOrder(orderInfo.id)"
                :loading="loading"
                v-if="orderInfo.status=='NONPAYMENT'"
              >取消订单</el-button>
              <el-button
                type="primary"
                class="btns"
                @click="goPayment(2)"
                v-if="orderInfo.status=='NONPAYMENT'"
                :loading="loading1"
              >确认付款</el-button>
              <el-button
                type
                size="normal"
                class="btns defaultBg"
                v-if="orderInfo.status=='PAYMENT'"
                disabled
              >等待放币</el-button>
            </div>

            <div v-else class="btnBox flex">
              <!-- <el-button
              size="normal"
              class="btns cancels"
              v-if="(orderInfo.status=='PAYMENT'||orderInfo.status=='CALLOFF')&&orderInfo.appealStatus!='NORMAL'"
              @click="appealHandle(orderInfo.id)"
              >申诉</el-button>-->
              <el-button
                type
                size="normal"
                class="btns defaultBg"
                disabled
                v-if="orderInfo.status=='NONPAYMENT'"
              >等待付款</el-button>
              <el-button
                type="primary"
                size="normal"
                class="btns"
                @click="goPayment(1)"
                :loading="loading1"
                v-if="orderInfo.status=='PAYMENT'"
              >确认放币</el-button>
            </div>
          </div>
          <p class="size13 font1 blue mar-t-20">平台客服不会参与任何资金往来，请注意识别风险</p>
          <!-- 评价 -->
        </div>
      </div>
    </div>
    <!-- 申诉 -->
    <el-dialog
      title="申诉"
      :visible.sync="isAppeal"
      width="520px"
      :before-close="handleClose"
      @close="close"
      :close-on-click-modal="false"
    >
      <div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-6">问题描述</p>
          <el-input
            v-model="message"
            type="textarea"
            maxlength="240"
            placeholder="描述问题需要10个字以上"
            show-word-limit
            rows="4"
            resize="none"
          ></el-input>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-12 flex flex_bet align-center">
            请提供相关问题的截图或照片
            <span class="size12">{{imgBox.length}}/2</span>
          </p>
          <el-upload
            class="avatar-uploader"
            ref="upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            :on-change="(file,list)=>{handleChange(file,list)}"
            :class="{hide:hideUpload}"
            action
          >
            <!-- <img v-if="item" :src="item" class="wid85 hei85 pointer" /> -->
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit2" :loading="loading2">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" >
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import countDown from "../../components/common/countDown";
export default {
  name: "transactionDetail",
  components: {
    countDown,
  },
  data() {
    return {
      bankName: "",
      bankCard: "",
      bankAddress: "",
      payImg: "",
      payName: "",
      order: {
        no: "165921617539189181",
      },
      type: "", //buy买入sell卖出
      explainModel: false, //交易说明弹框
      time: "",
      priceOrderId: 0,
      orderInfo: {}, //訂單信息
      payType: "",
      actions: [{ name: "微信" }, { name: "支付宝" }, { name: "银行卡" }],
      identity: 1, //1用户，2商户
      set: null,
      loading: false,
      loading1: false,
      loading2: false,
      isAppeal: false, //申诉弹框
      message: "", //留言
      imgBox: [], //上传反馈图片
      dialogVisible: false,
      dialogImageUrl: "",
      hideUpload: false,
    };
  },
  computed: {
    orderId() {
      return this.$store.state.orderId;
    },
    userId() {
      return this.$store.state.userId;
    },
  },
  watch: {
    payType(val) {
      let payList = this.orderInfo.payMap;

      this.bankName = "";
      this.bankCard = "";
      this.bankAddress = "";

      if (this.payType == "微信") {
        this.payImg = payList.WECHAT.url;
        this.payName = payList.WECHAT.name;
      }
      if (this.payType == "支付宝") {
        this.payImg = payList.ALIAY.url;
        this.payName = payList.ALIAY.name;
      }
      if (this.payType == "银行卡") {
        this.payImg = payList.BANKCARD.url;
        this.payName = payList.BANKCARD.name;
        this.bankName = payList.BANKCARD.bankName;
        this.bankCard = payList.BANKCARD.bankCard;
        this.bankAddress = payList.BANKCARD.bankAddress;
      }
    },
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.close();
          done();
        })
        .catch((_) => {});
    },
    close() {
      this.isAppeal = false;
      this.imgBox = [];
      this.message = "";
      this.$refs.upload.clearFiles();
      this.hideUpload = false;
    },
    goBack() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {
      this.imgBox = [];
      fileList.forEach((item, i) => {
        if (i < 2) {
          this.$util.getBase64(item.raw).then((res) => {
            this.$util.dealImage(res, 500, (data) => {
              this.imgBox.push(data);
            });
          });
        }
      });
      this.hideUpload = fileList.length >= 2;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //获取订单结束时间
    getOrderEndTime() {
      this.$post1("otc/order/orderEndTime", {
        priceOrderId: this.priceOrderId,
        member: this.$store.state.userId,
      }).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.time = res.result.orderEndTime - res.result.nowTime || 0;
          this.time = this.time / 1000;
        }
      });
    },
    // 提交申诉
    submit2() {
      if (!this.message) {
        this.$util.Toast("请输入问题描述", "warning");
        return;
      }
      if (this.message.length < 10) {
        this.$util.Toast("问题描述需要10个字以上", "warning");
        return;
      }
      if (this.imgBox.length <= 0) {
        this.$util.Toast("当前订单已取消，请重新下单", "warning");
        return;
      }

      this.loading2 = true;
      var data = {
        msg: this.message,
        pic: this.imgBox,
        priceOrderId: this.priceOrderId,
        userId: this.$store.state.userId,
      };
      var fd = new FormData();
      fd.append("msg", data.msg);
      fd.append("priceOrderId", data.priceOrderId);
      for (let i = 0; i < data.pic.length; i++) {
        let item = data.pic[i];
      }
      data.pic.forEach((item, i) => {
        if (i == 0) {
          fd.append("file", this.$util.base64toFile(item));
        } else {
          fd.append("file1", this.$util.base64toFile(item));
        }
      });
      this.$post1("otc/order/appeal", { userId: this.$store.state.userId }, fd)
        .then((res) => {
          this.loading2 = false;
          if (res && res.status == "SUCCEED") {
            this.$util.Toast("申诉提交成功", "sucess");
            setTimeout((res) => {
              this.isAppeal = false;
            }, 300);
          } else {
            this.Toast(res.errorMessage, "warning");
          }
        })
        .catch((err) => {
          this.loading2 = false;
        });
    },
    //上传收款码
    handleChange(file, fileList, type) {
      // this.imgBox = fileList;
      this.imgBox = [];
      fileList.forEach((item, i) => {
        if (i < 2) {
          this.$util.getBase64(item.raw).then((res) => {
            this.$util.dealImage(res, 500, (data) => {
              this.imgBox.push(data);
            });
          });
        }
      });
      this.hideUpload = fileList.length >= 2;
    },
    getOrderDetails(type) {
      this.$post1("otc/order/orderDetails", {
        priceOrderId: this.priceOrderId,
        userId: this.$store.state.userId,
      }).then((res) => {
        if (res && res.status == "SUCCEED" && res.result) {
          this.orderInfo = res.result;

          if (this.orderInfo.payType != "") {
            setTimeout(() => {
              let cc = "";
              if (this.orderInfo.payType == "BANKCARD") {
                cc = "银行卡";
              }
              if (this.orderInfo.payType == "WECHAT") {
                cc = "微信";
              }
              if (this.orderInfo.payType == "ALIAY") {
                cc = "支付宝";
              }
              // this.onSelect1(cc);
            }, 100);
          }

          this.set = setTimeout((ret) => {
            this.getOrderDetails();
          }, 10000);
          // if (res.result.userId == ) {
          //   this.identity == 1;
          // } else {
          //   this.identity == 2;
          // }
        }
      });
    },
    //申诉
    appealHandle(id) {
      if (!id) {
        return;
      }
      this.isAppeal = true;
      // this.$router.push({
      //   path: `/appeal`,
      // });
    },
    //定时器停止事件
    countDownFinish() {
      if (this.orderInfo.status == "PAYMENT") {
        this.$util.Toast("当前订单已取消，请重新下单", "warning");
        if (this.$refs.countDown) {
          this.$refs.countDown.stop();
        }
        setTimeout((res) => {
          this.goBack();
        }, 500);
      }
    },
    goPayment(n) {
      if (!this.payType && n == 2) {
        this.$util.Toast("请选择支付方式", "warning");
        return;
      }
      if (n == 2) {
        if (
          this.payName == "" ||
          this.payName == undefined ||
          this.payName == null
        ) {
          this.$util.Toast("请选择有信息的支付方式", "warning");
          return;
        }
        var payType;
        if (this.payType.indexOf("微信") >= 0) {
          payType = "WECHAT";
        } else if (this.payType.indexOf("支付宝") >= 0) {
          payType = "ALIAY";
        } else if (this.payType.indexOf("银行卡") >= 0) {
          payType = "BANKCARD";
        }
      }

      var url;
      var data = {
        priceOrderId: this.priceOrderId,
        userId: this.$store.state.userId,
      };
      // 1确认放币2确认付款
      if (n == 1) {
        url = "otc/order/deliverGoods";
      } else if (n == 2) {
        url = "otc/order/payment";
        data["payType"] = payType;
      }
      this.loading1 = true;
      this.$post1(url, data)
        .then((res) => {
          this.loading1 = false;
          if (res && res.status == "SUCCEED") {
            this.$util.Toast("订单交易成功", "success");
            clearTimeout(this.set);
            this.set = null;
            this.getOrderDetails();
          } else {
            this.$util.Toast(res.errorMessage, "warning");
          }
        })
        .catch((err) => {
          this.loading1 = false;
        });
    },
    //取消订单
    cancelOrder(id) {
      var _this = this;
      if (!id) {
        return;
      }
      this.$confirm("是否确认取消订单")
        .then(() => {
          _this.loading = true;
          _this
            .$post1("otc/order/backOrder", {
              priceOrderId: id,
              userId: _this.$store.state.userId,
            })
            .then((res) => {
              _this.loading = false;
              if (res && res.status == "SUCCEED") {
                _this.$util.Toast("订单取消成功", "success");
                setTimeout((res) => {
                  _this.goBack();
                }, 300);
              } else {
                _this.Toast(res.errorMessage, "warning");
              }
            })
            .catch(() => {
              _this.loading = false;
            });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.priceOrderId = this.orderId;
    this.getOrderDetails();
    this.getOrderEndTime(); //获取订单结束时间
  },
  beforeDestroy() {
    clearTimeout(this.set);
    if (this.$refs.countDown) {
      this.$refs.countDown.stop();
    }
    this.set = null;
  },
  destroyed() {},
};
</script>
<style lang="less">
.hide .el-upload--picture-card {
  display: none;
}
</style>
<style lang="less" scoped>
/deep/.el-dialog__body {
  padding-top: 0;
}
.order_detail {
  background: #f2f3f8;
  .contents {
    width: 1200px;
    margin: 0 auto;
  }
  .darkLine {
    height: 6px;
    background: #f8f7fd;
    margin-left: -30px;
    margin-right: -30px;
  }
  .btns {
    width: 160px;
    height: 45px;
    font-size: 15px;
    font-weight: bold;
    border-radius: 5px;
    &.cancels {
      background: rgba(226, 237, 255, 1);
      color: #3c78e1;
      // border-color: transparent;
    }
    &.defaultBg {
      //  color: #fff;;
    }
    &:last-child {
      margin-left: 20px;
    }
  }
  .payBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
