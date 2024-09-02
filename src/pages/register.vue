<template>
  <div class="page-content bgColor_1">
    <div class="main-content">
      <div class="login_box">
        <div class="flex" style="justify-content: center;align-items: center;flex-direction: column;">
          <div class="" style="">
            <img style="width:250px;" class="mar-t-30" src="../assets/images/fx_logo.png"/>
            <div style="text-align: center;color: #fff;font-weight: 600;">For true believers</div>
          </div>
          <div style="width: 500px;margin-bottom: 30px;margin-top: 100px;">
             <el-button
                :loading="loading"
                type="primary"
                @click="goLogin"
                class="register-btn"
                style="width: 100%;margin-top: 30px;background: #fff;height: 55px;color: #000;"
              >{{ i18n.register }}</el-button>
          </div>
          <div style="color: #fff;width: 500px;">
             <div class="_3QECpvrj">Please read our <a href="/terms">{{i18n.fw1}}</a>, <a href="/risk-disclosure">{{i18n.fw2}}</a> and <a href="/privacy-notice">{{i18n.fw3}}</a>.<!-- --> <!-- -->{{i18n.fw4}} <a href="/terms">{{i18n.fw1}}</a> {{i18n.fw4}}<!-- --> <a href="/us-person-definition">{{i18n.fw5}}</a> {{i18n.fw6}}</div>
          </div>
        </div>
      </div>
      <div class="rigister">
        <!-- <div class="r-tabs brColor_1 txColoe_1">
          <p
            v-for="(val, index) in tabs"
            :key="index"
            :class="{active:tabsActive == index}"
            @click="tabsClick(index)"
          >{{ val }}</p>
        </div> -->
        <div>
          <!-- 手机号 -->
          <el-form
            :model="phoneFrom"
            :rules="rules"
            ref="phoneFrom"
            label-width="100px"
            class="publicInput"
          >
            <div style="color: black;font-size: 30px; font-weight: 700;">{{i18n.register}}</div>
            <div class="mar-t-5 mar-b-5">{{i18n.dianyou}}</div>
            <div class="flex">
              <country @input="country" v-if="tabsActive == 0" class="mar-r-10"></country>
              <el-form-item label prop="phoneNum" v-if="tabsActive == 0" class="flex1">
                <el-input
                  type="text"
                  v-model="phoneFrom.phoneNum"
                  autocomplete="off"
                  :placeholder="$t('message.input_enter_username')"
                ></el-input>
              </el-form-item>
            </div>

            <!-- 邮箱 -->
            <el-form-item label prop="emailNum" v-if="tabsActive == 1">
              <el-input
                type="text"
                v-model="phoneFrom.emailNum"
                autocomplete="off"
                :placeholder="$t('message.register_email_enter')"
              ></el-input>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item label prop="phoneCode">
              <!-- v-model="phoneFrom.phoneCode" -->
              <!-- 获取验证码 -->
              <el-input
                type="text"
                v-model="phoneFrom.scsCode"
                autocomplete="off"
                :placeholder="tabsActive == 0?$t('message.center_email_code'):$t('message.center_email_code')"
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
            <!-- <el-form-item label prop="emailCode" v-if="tabsActive == 1">
              <el-input
                type="text"
                v-model="phoneFrom.emailCode"
                autocomplete="off"
                :placeholder="$t('message.center_email_code')"
                maxlength="6"
              >
                <el-button
                  slot="append"
                  class="txColoe_1 transBg"
                  @click="codeReady?codeSend('email'):''"
                >{{ (codeReady?$t('message.center_email_code_obtain'):$t('message.center_email_code_obtain1',{count: countTime})) }}</el-button>
              </el-input>
            </el-form-item>-->

            <el-form-item label prop="pass">
              <el-input
                type="password"
                v-model="phoneFrom.pass"
                autocomplete="off"
                :placeholder="$t('message.input_enter_password')"
                show-password
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label prop="checkPass">
              <el-input
                type="password"
                v-model="phoneFrom.checkPass"
                autocomplete="off"
                :placeholder="$t('message.input_enter_password_sure')"
                show-password
              ></el-input>
            </el-form-item>-->
            <el-form-item label prop="invite_number">
              <el-input
                type="text"
                v-model="phoneFrom.invite_number"
                autocomplete="off"
                :placeholder="$t('message.register_code')"
                maxlength="8"
              ></el-input>
            </el-form-item>
            <el-form-item
              label
              prop="agreement"
              style="display: inline-block;width: auto !important;"
              :rules="[{ type: 'array', required: true, message: $t('message.register_password_remind1')}]"
            >
              <el-checkbox-group v-model="phoneFrom.agreement">
                <el-checkbox :label="$t('message.register_password_remind2')" name="agreement"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              style="display: inline-block;width: auto !important;margin-left: 10px;"
              class="pointer"
            >
              <router-link
                to="/single/single_user"
                class="txColoe_2"
              >{{ $t('message.register_agreement') }}</router-link>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="phoneSubmit('phoneFrom')"
                style="width: 100%;height: 55px;background: #0039f5;"
                :loading="loading"
              >{{$t('message.register')}}</el-button>
            </el-form-item>
          </el-form>

          <!-- <router-link to="/single/single_terms" class="txColoe_2" style="position: absolute;bottom: 105px;left: 132px;">{{ $t('message.register_agreement') }}</router-link> -->
        </div>
      </div>
    </div>
    <div>
      <!-- <Geet :isGeet="isGeet" @geetPath="geetPath" @clickChange="geetChange"></Geet> -->
    </div>
  </div>
</template>

<script>
import Geet from "../components/common/geet.vue";
import country from "../components/common/country.vue";
import { hbmd5 } from "../components/common/md5.js";

export default {
  name: "register",
  components: {
    Geet,
    country,
  },
  data() {
    // 手机
    var vaildPhoneNum = (rule, value, callback) => {
      if (this.$util.testPhone(value)) {
        callback(new Error("输入正确的手机格式"));
      } else {
        callback();
      }
    };
    // 验证码
    var vaildPhoneCode = (rule, value, callback) => {
      if (this.$util.testCode(value)) {
        callback(new Error("输入6位验证码"));
      } else {
        callback();
      }
    };
    // 邮箱
    var emailPhoneCode = (rule, value, callback) => {
      if (this.$util.testEmail(value)) {
        callback(new Error("输入正确的邮箱格式"));
      } else {
        callback();
      }
    };
    // 密码
    var validatePass = (rule, value, callback) => {
      if (this.$util.testLoginPassword(value)) {
        callback(new Error("请输入8-20位字符，不能是纯数字"));
      } else {
        callback();
      }
    };
    // var validatePass2 = (rule, value, callback) => {
    //   if (val == "") {
    //     callback(new Error("再次输入密码"));
    //   } else if (this.phoneFrom.pass != value && value != "") {
    //     callback(new Error("两次密码不一致"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      isGeet: false,
      tabsActive: 1,
      codeReady: true,
      countTime: 0,
      min: 60,
      setcode: null,
      phoneFrom: {
        pass: "",
        checkPass: "",
        areaCode: "86",
        phoneNum: "",
        phoneCode: "",
        emailNum: "",
        emailCode: "",
        invite_number: "",
        agreement: [],
        code: "",
        scsCode: "",
      },
      rules: {
        phoneNum: [
          {
            validator: vaildPhoneNum,
            trigger: "blur",
          },
        ],
        scsCode: [{ validator: vaildPhoneCode, trigger: "blur" }],
        emailNum: [{ validator: emailPhoneCode, trigger: "blur" }],
        pass: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        // checkPass: [
        //   {
        //     validator: validatePass2,
        //     trigger: "blur"
        //   }
        // ]
      },
      loading: false,
      loading1: false,
    };
  },
  mounted() {
    let href = window.location.href;
    if (href.indexOf("code=") !== -1) {
      this.phoneFrom.invite_number = href.split("code=")[1];
    }
    this.utils.onlineNew();
    var _this = this;
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      if (key == 13) {
        _this.phoneSubmit('phoneFrom');
      }
    };
  },
   
  methods: {
    goLogin(){
      this.$router.push({
        path:'/login'
      })
    },  
    tabsClick(index) {
      this.tabsActive = index;
      this.$refs.phoneFrom.resetFields();
      this.countTime = 0;
      // this.codeReady = true;
      // this.phoneFrom.code='';
    },
    // 国家选择
    country(data) {
      this.phoneFrom.areaCode = data.n;
      console.log(this.phoneFrom.areaCode);
    },
    // 注册按钮
    phoneSubmit(formName) {
      let {
        phoneNum,
        emailNum,
        phoneCode,
        pass,
        checkPass,
        invite_number,
        areaCode,
        emailCode,
        scsCode,
      } = this.phoneFrom;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 提交接口
          this.formdata(
            phoneNum,
            emailNum,
            phoneCode,
            pass,
            checkPass,
            invite_number,
            emailCode,
            scsCode,
            areaCode
          );
        }
      });
    },
    formdata(
      phone,
      email,
      phoneCode,
      password,
      passwordOk,
      invitation,
      emailCode,
      code,
      areaCode
    ) {
      let data = {
        password: password,
        welCode: invitation,
      };
      let parms = {
        code,
      };
      if (this.tabsActive == 0) {
        data.phone = phone;
        data.regType = "PHONE";
        data.areaCode = areaCode;
      } else {
        data.mail = email;
        data.regType = "MAIL";
      }
      this.$post1("member/member/register", parms, data)
        .then((res) => {
          this.loading = false;
          if (res.status == "SUCCEED") {
            this.$message({ message: "注册成功", type: "success" });
            // if (this.tabsActive == 0) {
            //   // window.localStorage.setItem("account", phone);

            // } else {
            //   // data.mail = email;
            //   // window.localStorage.setItem("account", email);
            // }
            this.$router.replace({
              path: "/login",
            });
          }
          if (res.status == "FAILED") {
            this.$message.error(res.errorMessage);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    geetChange(val) {
      this.isGeet = val;
    },
    geetPath(val) {
      if (val.status == 1) {
        let geetest_challenge = val.geetest_challenge,
          geetest_seccode = val.geetest_seccode,
          geetest_validate = val.geetest_validate,
          areaCode = this.phoneFrom.areaCode,
          userName = this.phoneFrom.phoneNum,
          code = this.phoneFrom.phoneCode,
          emailNum = this.phoneFrom.emailNum,
          emailCode = this.phoneFrom.emailCode,
          password = hbmd5(this.phoneFrom.pass),
          confirm = hbmd5(this.phoneFrom.checkPass),
          invite_number = this.phoneFrom.invite_number,
          agreement = this.phoneFrom.agreement ? true : false;
        if (this.tabsActive == 0) {
          var rulSub = encodeURI(
            this.utils.config +
              "/api/register/mobile?geetest_challenge=" +
              geetest_challenge +
              "&geetest_validate=" +
              geetest_validate +
              "&geetest_seccode=" +
              geetest_seccode +
              "&areaCode=" +
              areaCode +
              "&userName=" +
              userName +
              "&code=" +
              code +
              "&password=" +
              password +
              "&confirm=" +
              confirm +
              "&invite_number=" +
              invite_number +
              "&agreement=" +
              agreement
          );
        } else if (this.tabsActive == 1) {
          var rulSub = encodeURI(
            this.utils.config +
              "/api/register/email?geetest_challenge=" +
              geetest_challenge +
              "&geetest_validate=" +
              geetest_validate +
              "&geetest_seccode=" +
              geetest_seccode +
              "&userName=" +
              emailNum +
              "&code=" +
              emailCode +
              "&password=" +
              password +
              "&confirm=" +
              confirm +
              "&invite_number=" +
              invite_number +
              "&agreement=" +
              agreement
          );
        }
        this.$http.post(rulSub).then((data) => {
          if (data.data.success) {
            this.$message({
              message: data.data.msg,
              type: "success",
              duration: 1000,
              onClose() {
                this.$router.push("/login");
              },
            });
          } else if (!data.data.success) {
            this.$message.error(data.data.msg);
          }
        });
      }
    },
    // 获取验证码
    codeSend() {
      if (this.tabsActive == 0) {
        if (this.$util.testPhone(this.phoneFrom.phoneNum)) {
          return;
        }
      } else {
        if (this.$util.testEmail(this.phoneFrom.emailNum)) {
          return;
        }
      }

      let data = {
        type: "REGISTER",
      };
      let url = this.tabsActive == 0 ? "data/sms/sendSms" : "data/sms/sendMail";
      if (this.tabsActive == 0) {
        data["phone"] = this.phoneFrom.phoneNum;
        data["phoneCode"] = this.phoneFrom.areaCode;
        if (this.phoneFrom.phoneNum == "") {
          this.$message.warning(this.$t("message.input_enter_username"));
          return;
        }
      } else {
        data["mailbox"] = this.phoneFrom.emailNum;
        if (this.phoneFrom.emailNum == "") {
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
        .then((res) => {
          this.loading1 = false;
          if (res.status == "SUCCEED") {
            this.$message({ message: "发送成功", type: "success" });
            this.codeReady = false;
            this.countDown();
          }
        })
        .catch((err) => {
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
  },
  computed: {
    tabs() {
      return [
        this.$t("message.mobile_register"),
        this.$t("message.email_register"),
      ];
    },
    i18n() {
      return this.$t("message");
    },
  },
};
</script>

<style lang="less" scoped>

@media screen and (min-width: 320px) and (max-width: 800px){
  .login_box {
    display: none;
    // position: fixed;
    // height: 100%;
    // width: 100%;
    // z-index: 0;
    // background-size:100% 100%;
    // -moz-background-size:100% 100%;
  }
}
.main-content {
  padding: 5% 0 24px;
  display: flex;
  // height: 100vh;
  position: relative;
  background: url('../../src/assets/img/home/login-revamp-bg.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login_box{
  background: #0f1723;
  width: 550px;
  height: 670px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rigister {
  width: 650px;
  height: 750px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 3px;
  padding: 40px 40px 20px;
  position: relative;
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
._3QECpvrj{
  width: 500px;
  a{
    color: #c3dde6;
    text-decoration: underline;
  }
}

// .r-tabs p:hover {
//   color: #fff;
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
  background: #40a9ff;
}
.publicInput{
  width: 500px;
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

.publicInput /deep/ .el-input__inner::placeholder {
  font-size: 14px;
}

.publicInput /deep/ .el-form-item__content,
.publicInput /deep/ .el-select {
  // width: 100% !important;
  margin: 0 !important;
  position: relative;
}

.publicInput /deep/ .el-form-item__error {
  font-size: 14px;
}

// @media (min-width: 768px) {
//   .main-content {
//     // background: url(https://download.ethecf.vip/img/login-banner.jpg) no-repeat center/cover;
//   }
// }
</style>
