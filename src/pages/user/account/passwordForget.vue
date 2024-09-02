<template>
  <div class="main-content bgColor_1">
    <div class="content">
      <div class="login">
        <h3 class="title">重置登录密码</h3>
        <div class="tips">重置登录密码后，24小时内禁止提币和OTC划转</div>
        <div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            :status-icon="false"
            ref="ruleForm"
            label-width="100px"
            class="publicInput"
          >
            <el-form-item label prop="account">
              <el-input
                type="text"
                v-model="ruleForm.account"
                autocomplete="off"
                :placeholder="`${i18n.input_enter_username}/${i18n.center_mailbox}`"
              ></el-input>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item label prop="phoneCode">
              <!-- v-model="phoneFrom.phoneCode" -->
              <!-- 获取验证码 -->
              <el-input
                type="text"
                v-model="ruleForm.scsCode"
                autocomplete="off"
                :placeholder="$t('message.center_email_code')"
                maxlength="6"
              >
                <el-button
                  slot="append"
                  class="txColoe_1 transBg"
                  @click="codeSend()"
                  v-if="codeReady"
                  :loading="loading1"
                >{{ $t('message.center_email_code_obtain') }}</el-button>
                <el-button
                  slot="append"
                  class="txColoe_1 transBg"
                  v-else
                >{{ $t('message.center_email_code_obtain1',{count: min}) }}</el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                @click="validateForm('ruleForm')"
                style="width: 100%;margin-top: 30px;"
              >提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- <geet :isGeet="isGeet" @geetPath="geetPath" @clickChange="geetChange"></geet> -->
  </div>
</template>

<script>
import geet from "../../../components/common/geet.vue";
import country from "../../../components/common/country.vue";
import { hbmd5 } from "../../../components/common/md5.js";
import { mapActions } from "vuex";

export default {
  name: "login",
  components: {
    geet,
    country
  },
  data() {
    var validateAcount = (rule, value, callback) => {

      if (value == "") {
        callback(new Error("请输入注册的邮箱或手机"));
        return;
      }
      if (value.indexOf("@") != -1) {
      // if (this.tabActive == 1) {
        //邮箱
        if (this.$util.testEmail(value)) {
          callback(new Error("输入正确的邮箱格式"));
        } else {
          callback();
        }
      } else {
        //手机
        if (this.$util.testPhone(value)) {
          callback(new Error("输入正确的手机格式"));
        } else {
          callback();
        }
      }
    };
    var validateSecretCode = (rule, value, callback) => {
      if (this.$util.testLoginPassword(value)) {
        callback(new Error("输入8-20位字符，不能是纯数字"));
      } else {
        callback();
      }
    };
    return {
      tabActive: 0,
      ruleForm: {
        account: "",
        scsCode: "",
        areaCode: "86"
      },
      codeReady: true,
      isGeet: false,
      loading1: false,
      rules: {
        account: [{ validator: validateAcount, trigger: "blur" }],
        scsCode: [{ validator: validateSecretCode, trigger: "blur" }]
      },
      loading: false,
      min: 60
    };
  },
  computed: {
    i18n() {
      return this.$t("message");
    }
  },
  created() {
    var _this = this;
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      if (key == 13) {
        _this.validateForm('ruleForm');
      }
    };
  },
  methods: {
    ...mapActions(["setLogin", "setToken", "setUserId"]),
    // 切换表单
    _setTabActive(index) {
      if (this.tabActive != index) {
        this.tabActive = index;
      }
    },
    // 国家选择
    country(data) {
      this.ruleForm.areaCode = data.n;
    },

    // 获取验证码
    codeSend() {
      let account = this.ruleForm.account;
      let tabsActive, url;
      if (account.indexOf("@") == -1) {
        //手机号
        if (this.$util.testPhone(account)) {
          return;
        }
        tabsActive = 0;
        url = "data/sms/sendSms";
      } else {
        if (this.$util.testEmail(account)) {
          return;
        }
        tabsActive = 1;
        url = "data/sms/sendMail";
      }

      let data = {
        type: "RESET"
      };
      if (tabsActive == 0) {
        data["phone"] = account;
        data["phoneCode"] = this.ruleForm.areaCode;
        if (account == "") {
          this.$message.warning(this.$t("message.input_enter_username"));
          return;
        }
      } else {
        data["mailbox"] = account;
        if (account == "") {
          this.$message.warning("请输入邮箱");
          return;
        }
      }

      /**
       * 注册REGISTER
       * 重置密码
       * 重置支付密码
       * 绑定手机或者邮箱
       * 找回密码
       * 提币
       * 提现
       */
      //  REGISTER("REGISTER"),
      //  RESET("RESET"),
      //  PAYRESET("PAYRESET"),
      //  SETPHMAIL("PAYRESET"),
      //  RETRIEVE("RETRIEVE"),
      //  WITHDRAWAL_MONEY("WITHDRAWAL_MONEY"),
      //  WITHDRAWAL_COIN("WITHDRAWAL_COIN");
      //发送验证码
      this.loading1 = true;
      this.$post1(url, data)
        .then(res => {
          this.loading1 = false;
          if (res.status == "SUCCEED") {
            this.$message({ message: "发送成功", type: "success" });
            this.codeReady = false;
            this.countDown();
          }
        })
        .catch(err => {
          this.loading1 = false;
        });
    },
    countDown() {
      this.min = this.min - 1;
      // this.codeReady = true;

      if (this.min == 0) {
        this.min = 60;
        this.codeReady = true;
        clearTimeout(this.setcode);
        return;
      }
      this.setcode = setTimeout(() => {
        this.countDown();
      }, 1000);
    },
    // 验证表单
    validateForm(formName) {
      var _this = this;
      let { account, scsCode, areaCode } = this.ruleForm;
      this.$refs[formName].validate(valid => {
        if (valid == true) {
          this.loading = true;
          let parmas = {
            phMail : account,
            code : scsCode
          };
          _this
            .$post1("member/member/forgetPass", parmas)
            .then(res => {
              this.loading = false;
              if (res.status == "FAILED") {
                _this.$message.error(res.errorMessage);
              } else if (res.status == "SUCCEED") {
                _this.$router.replace({
                  path: "/login"
                });
              }
            })
            .catch(res => {
              this.loading = false;
            });
        }
      });
    },
    // 极验图片加载之后，通过更改控制变量实现可以再次加载
    geetChange(val) {
      this.isGeet = val;
    },
    // 提交表单
    geetPath(val) {
      if (val.status == 1) {
        let params = {
          geetest_challenge: val.geetest_challenge,
          geetest_validate: val.geetest_validate,
          geetest_seccode: val.geetest_seccode,

          phMail: this.ruleForm.account,
          password: hbmd5(this.ruleForm.pass),
          areaCode: "86"
        };
        this.$post1("/member/member/login", params).then(res => {
          // if (res.status == "FAILED") {
          //     this.Toast(res.errorMessage)
          // } else if (res.status == "SUCCEED") {
          //     this.rememberAccount(params.phMail)
          //     this.setLogin(true);
          //     this.setToken(res.result.token);
          //     this.setUserId(res.result.id);
          //     this.Toast(this.$t("login.login_successful"));
          //     // this.Toast('登录成功')
          //     this.$router.replace({
          //         path: '/home'
          //     });
          // }
        });
        // this.$post("/data/login", params).then(res => {
        //     if (!res.data.success) {
        //         this.$message.error(res.data.msg);
        //         return;
        //     } else {
        //         localStorage.setItem("usda_userId", res.data.key);
        //         localStorage.setItem("usda_auth_token", res.data.authToken);
        //         localStorage.setItem("usda_auth_userName", res.data.userName);
        //         this.$message({
        //             message: res.data.msg,
        //             type: "success",
        //             duration: 1000,
        //             onClose() {
        //                 this.$router.push("/user/center/my");
        //             }
        //         });
        //     }
        // });
      }
      this.isGeet = false;
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  text-align: center;
  color: #263241;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 30px;
}
.tips {
  width: 100%;
  padding: 16px;
  background: #fffae6;
  border-radius: 3px;
  color: #cc7c09;
  font-size: 12px;
  line-height: 18px;
}
.main-content {
  display: flex;
  flex-direction: column;
  // height: 100vh;
  overflow: auto;
}

.content {
  padding: 5% 0 24px;
}

.login {
  width: 460px;
  margin: 0 auto;
  background: #fff;
  border-radius: 3px;
  padding: 40px 40px 30px;
}

.forgetPass {
  display: block;
  text-align: right;
  padding-right: 15px;
  cursor: pointer;
  color: #00a2ff;
}

.forgetPass:hover {
  color: #40a9ff !important;
}

.r-tabs {
  height: 40px;
  line-height: 40px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-style: solid;
}

.r-tabs p {
  flex: 1;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

// .r-tabs p:hover {
//     color: #fff;
// }

.r-tabs p::after {
  content: "";
  left: 0;
  bottom: -1px;
  position: absolute;
  height: 2px;
  width: 100%;
  background: #dfe2e7;
  transition: all 0.3s;
}

.r-tabs p.active {
  color: #00a2ff;
  margin-bottom: 0;
}

.r-tabs p.active::after {
  background: #00a2ff;
}

.publicInput /deep/ .el-input__inner {
  background: transparent;
  border: 1px solid #dfe2e7;
  width: 100%;
  color: #333;
  height: 40px;
  line-height: 40px;
  font-size: initial;
}
/deep/ .el-form {
  margin-top: 15px;
}
.publicInput /deep/ .el-input__inner::placeholder {
  font-size: initial;
}

.publicInput /deep/ .el-form-item__content {
  width: 100% !important;
  margin: 10px 0 0 0 !important;
}

.publicInput /deep/ .el-form-item__error {
  font-size: 12px;
}

@media (min-width: 768px) {
  // .main-content {
  //     background: url(https://download.ethecf.vip/img/login-banner.jpg) no-repeat center/cover;
  // }
}
.publicInput /deep/ .el-form-item__content,
.publicInput /deep/ .el-select {
  width: 100% !important;
  margin: 0 !important;
  position: relative;
}
</style>
