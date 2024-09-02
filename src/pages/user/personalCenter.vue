<template>
  <div class="auth_bg min-hei600">
    <div class="auth_section pad-t-40">
      <div class="bg-fff hei60 flex align-center size20 pad-l-30">
        <el-page-header @back="goBack" content="实名认证" title=""></el-page-header>
      </div>
      <div class="auth_content bg-fff mar-t-20 pad-b-50 pad-l-r-30 pad-t-20 min-hei400">
        <div v-if="isInit">
          <div class="items pad-b-15 size14">
            <div class="bor_b size15 font1 c222 flex align-center pad-t-b-10" v-if="isRenzhang">
              {{$t('message.realname')}}
              <div class="mar-l-15 flex1 v-right" v-if="isRenzhang">
                <img src="../../assets/images/sures.png" alt srcset class="wid14 hei14 mar-r-5" />
                <span class="c_blue font1">已认证</span>
              </div>
              <i class="el-icon-arrow-right mar-l-15"></i>
            </div>
            <div class="bor_b size15 font1 c222 flex align-center pad-t-b-10" v-else>
              {{$t('message.realname')}}
              <div class="mar-l-15 flex1 flex flex_right align-center pointer" @click="goAuth">
                <img src="../../assets/images/shenfen.png" alt srcset class="wid14 hei14 mar-r-5" />
                <span class="red font1">去认证</span>
              </div>
              <i class="el-icon-arrow-right mar-l-15"></i>
            </div>
            <div class="authBox" v-if="isRenzhang">
              <div class="size14 c999 flex align-center pad-t-b-10">
                姓名
                <div class="mar-l-15 flex1 v-right c222">{{userInfo.uname}}</div>
              </div>
              <div class="size14 c999 pad-t-b-10 flex align-center">
                账号
                <div
                  class="mar-l-15 flex1 v-right c222"
                  v-if="userInfo.phone"
                >{{userInfo.phone|encryptionphone}}</div>
                <div
                  class="mar-l-15 flex1 v-right c222"
                  v-if="!userInfo.phone&&userInfo.mail"
                >{{userInfo.mail|encryptionmail}}</div>
              </div>
              <div class="size14 c999 pad-t-b-10 flex align-center">
                UID
                <div class="mar-l-15 flex1 v-right c222 flex align-center flex_right">
                  <span>{{userInfo.uuid}}</span>
                  <div
                    class="pad_l_5 pad_t_b_5 cobyOrderSn pointer"
                    @click="copythat(userInfo.uuid)"
                    data-clipboard-action="copy"
                    :data-clipboard-text="userInfo.uuid"
                  >
                    <img
                      src="../../assets/images/fuzhi.png"
                      alt
                      srcset
                      class="wid11 hei12 mar-l-15"
                    />
                  </div>
                </div>
              </div>
              <div class="size14 c999 pad-t-b-10 flex align-center">
                证件号码
                <div class="mar-l-15 flex1 v-right font1 c222">{{userInfo.cardNo|cardNum}}</div>
              </div>
            </div>
            <div class="c999" v-else>
              <div class="mar-t-15">·认证后提现24小时限额3BTC,1次</div>
              <div class="mar-t-12">·认证后获得OTC交易</div>
            </div>
          </div>
          <div class="darkLine"></div>
          <div class="items pad-b-15 size14" v-if="isRenzhang">
            <div
              class="size15 font1 c222 flex align-center pad-t-b-10 bor_b"
              v-if="userInfo.cardState=='PASS'"
            >
              高级认证
              <div class="mar-l-15 flex1 flex align_center flex_right">
                <img src="../../assets/images/sures.png" alt srcset class="wid14 hei14 mar-r-5" />
                <span class="c_blue font1">已认证</span>
              </div>
              <i class="el-icon-arrow-right mar-l-15"></i>
            </div>
            <div
              class="bor_b size15 font1 c222 flex align-center pad-t-b-10 pointer"
              @click="goSenior"
              v-else
            >
              高级认证
              <div class="mar-l-15 flex1 flex flex_right align-center">
                <img src="../../assets/images/shenfen.png" alt srcset class="wid14 hei14 mar-r-5" />
                <span class="red font1">{{userInfo.cardState=='WAIT'?'审核中':'去认证'}}</span>
              </div>
            </div>
            <div class="size14 c999">
              <div class="mar-t-15">·认证后获得OTC交易“发布广告”权限</div>
            </div>
          </div>
          <div class="items pad-b-15 size14" v-else>
            <div
              class="size15 font1 c222 flex align-center pad-t-b-10 bor_b pointer"
              @click="goReal"
            >
              高级认证
              <div class="mar-l-15 flex1 flex flex_right align-center">
                <img src="../../assets/images/shenfen.png" alt srcset class="wid14 hei14 mar-r-5" />
                <span class="red font1">去认证</span>
              </div>
              <i class="el-icon-arrow-right mar-l-15"></i>
            </div>
            <div class="size14 c999">
              <div class="mar-t-15">·认证后获得OTC交易“发布广告”权限</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "personalCenter",
  data() {
    return {
      name: "",
      idCard: "",
      loading: false,
      isRenzhang: false,
      idNUm: "",
      IdName: "",
      userInfo: {},
      isInit: false
    };
  },
  watch: {
    name(val) {
      this.name = val.replace(/\s+/g, "");
    },
    idCard(val) {
      this.idCard = val.replace(/\s+/g, "");
    }
  },
  activated() {
    this.getUserInfo();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
    copythat: function(text) {
      var self = this;
      if (!text) {
        return self.$util.Toast("复制失败");
      }
      let clipboard = new this.clipboard(".cobyOrderSn");
      clipboard.on("success", function() {
        self.$util.Toast("复制成功", "success");
      });
      clipboard.on("error", function() {
        self.$util.Toast("复制失败");
      });
    },
    //去支付方式
    goPayment() {
      // if (!this.isRenzhang) {
      //   this.$util.Toast("请先进行初级实名认证", "warning");
      //   return;
      // }
      this.$router.push({
        path: `/payment`
      });
    },
    //实名认证初级
    goAuth() {
      this.$router.push("/user/auth");
    },
    //高级认证
    goSenior() {
      this.$router.push("/user/senior");
    },
    goReal() {
      this.$util.Toast("请先进行初级实名认证", "warning");
    },
    getUserInfo() {
      this.$get("member/member/getMember", {
        member: this.$store.state.userId
      }).then(res => {
        if (res.status == "FAILED") {
        } else if (res.status == "SUCCEED") {
          this.isInit = true;
          let data = res.result;
          this.userInfo = data;
          if (data.cardNo == "") {
            this.isRenzhang = false;
          } else {
            this.isRenzhang = true;
            this.idNUm = data.cardNo;
            this.IdName = data.uname;
          }
        }
      });
    },
    //提交
    submit() {
      var _this = this;
      var userName = _this.name;
      var idCard = _this.idCard;
      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      if (!userName) {
        this.$util.Toast("名称不能为空", "warning");
        // this.Toast("名称不能为空");
        return false;
      }
      if (regEn.test(userName) || regCn.test(userName)) {
        this.$util.Toast("名称不能包含特殊字符", "warning");
        // this.Toast("名称不能包含特殊字符");
        return false;
      }
      if (!idCard) {
        this.$util.Toast("身份证不能为空", "warning");
        // this.Toast("身份证不能为空");
        return false;
      }
      // if (!regIdNo.test(idCard)) {
      //     this.Toast(this.$t("toast.Enter_ID_number"));

      //     // this.Toast("请输入正确的身份证号！");
      //     return false;
      // }
      this.toSubmit();
    },
    toSubmit() {
      this.loading = true;
      let pr = {
        member: this.$store.state.userId,
        name: this.name,
        cardNo: this.idCard
      };
      this.$post1("member/member/setAuthen", pr)
        .then(res => {
          this.loading = false;
          if (res.status == "FAILED") {
            this.$util.Toast(res.errorMessage);
          } else if (res.status == "SUCCEED") {
            this.$util.Toast("认证成功", "success");

            // this.Toast('提交成功')
            this.getUserInfo();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.auth_bg {
  background: #f2f3f8;
  .bor_b {
    border-bottom: 1px solid rgba(225, 225, 225, 0.6);
  }
  .darkLine {
    height: 6px;
    background: #f8f7fd;
    margin-left: -30px;
    margin-right: -30px;
  }
  .auth_section {
    width: 1200px;
    margin: 0 auto;
  }
  .tips {
    width: 100%;
    height: 48px;
    background: #f8f9fb;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .realname {
    width: 480px;
    margin: 0 auto;
    .right_text {
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      width: 100%;
    }
  }
}
</style>
