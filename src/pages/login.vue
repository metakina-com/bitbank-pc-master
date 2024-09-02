<template>
  <div class="main-content bgColor_1">
    <div class="content">
      <div class="register-box">
        <div class="flex" style="justify-content: center;align-items: center;flex-direction: column;">
          <div class="" style="">
            <img style="width:250px;" class="mar-t-30" src="../assets/images/fx_logo.png"/>
            <div style="text-align: center;color: #fff;font-weight: 600;">For true believers</div>
          </div>
          <div style="width: 500px;margin-bottom: 30px;margin-top: 100px;">
             <el-button
                :loading="loading"
                type="primary"
                @click="goRegister"
                style="width: 100%;margin-top: 30px;background: #fff;height: 55px;color: #000;border: 2px solid #0039f5;"
              >{{ i18n.register }}</el-button>
          </div>
          <div style="color: #fff;">
            <div class="_3QECpvrj">Please read our <a href="/terms">{{i18n.fw1}}</a>, <a href="/risk-disclosure">{{i18n.fw2}}</a> and <a href="/privacy-notice">{{i18n.fw3}}</a>.<!-- --> <!-- -->{{i18n.fw4}} <a href="/terms">{{i18n.fw1}}</a> {{i18n.fw4}}<!-- --> <a href="/us-person-definition">{{i18n.fw5}}</a> {{i18n.fw6}}</div>
          </div>
        </div>
      </div>
      <div class="login">
        <!-- <div class="r-tabs brColor_1 txColoe_1">
          <p
            v-for="(item, index) in tabs"
            :key="index"
            :class="{active:tabActive == index}"
            @click="_setTabActive(index)"
          >{{ item }}</p>
        </div> -->
       
        <div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            :status-icon="false"
            ref="ruleForm"
            label-width="100px"
            class="publicInput"
          >
            <div style="color: black;font-size: 30px; font-weight: 700;">{{i18n.login}}</div>
            <div class="mar-t-5 mar-b-5">{{i18n.dianyou}}</div>
            <!-- <country @input="country" style="margin-top:20px;" v-if="tabActive == 0"></country>
            <el-form-item label prop="account">
              <el-input
                type="text"
                v-model="ruleForm.account"
                autocomplete="off"
                :placeholder="`${i18n.input_enter_username}/${i18n.center_mailbox}`"
              ></el-input>
            </el-form-item>-->
            <div class="flex">
              <!-- <country @input="country" v-if="tabActive == 0" class="mar-r-10"></country> -->
              <el-form-item label prop="account" class="flex1">
                <el-input
                  class="hei60"
                  type="text"
                  v-model="ruleForm.account"
                  autocomplete="off"
                  :placeholder="`${i18n.input_enter_username}/${i18n.center_mailbox}`"
                ></el-input>
              </el-form-item>
            </div>
            <div class="mar-t-5 mar-b-5">{{i18n.password}}</div>
            <el-form-item label prop="secretCode" style="height: 60px;align-items: center;">
              <el-input
              class="hei60"
                type="password"
                v-model="ruleForm.secretCode"
                autocomplete="off"
                :placeholder="i18n.center_trade_paw_sure"
                show-password
              ></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                @click="validateForm('ruleForm')"
                style="width: 100%;margin-top: 30px;background: #0039f5;height: 55px;"
              >{{ i18n.login }}</el-button>
            </el-form-item>
              <router-link
              to="/passwordForget"
              class="forgetPass txColoe_1"
            >{{ i18n.forgot_password }}</router-link>
          </el-form>
        </div>

      </div>
    </div>
    <!-- <geet :isGeet="isGeet" @geetPath="geetPath" @clickChange="geetChange"></geet> -->
  </div>
</template>

<script>
import geet from "../components/common/geet.vue";
import country from "../components/common/country.vue";
import { hbmd5 } from "../components/common/md5.js";
import { mapActions } from "vuex";

export default {
  name: "login",
  components: {
    geet,
    country,
  },
  data() {
    var validateAcount = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入手机/邮箱"));
        return;
      }
      // if (value.indexOf("@") != -1) {
      if (this.tabActive == 1) {
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
      tabActive: 1,
      ruleForm: {
        account: "",
        secretCode: "",
        areaCode: "86",
      },
      isGeet: false,
      rules: {
        account: [{ validator: validateAcount, trigger: "blur" }],
        secretCode: [{ validator: validateSecretCode, trigger: "blur" }],
      },
      loading: false,
    };
  },
  computed: {
    tabs() {
      return [
        this.$t("message.center_phone"),
        this.$t("message.center_mailbox"),
      ];
    },
    i18n() {
      return this.$t("message");
    },
  },
  created() {
    this.utils.onlineNew();
    let account = window.localStorage.getItem("account");
    if (!account) return;
    // if (account.indexOf("@") == -1) {
    //   //手机
    //   this.tabActive = 0;
    //   this.ruleForm.account = account;
    // } else {
    //   //邮箱
    //   this.tabActive = 1;
    //   this.ruleForm.account = account;
    // }
    this.tabActive = 1;
    var _this=this;
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
        this.$refs["ruleForm"].resetFields();
        this.ruleForm.account = null;
      }
    },
    goRegister(){
      this.$router.push({
        path:'/register'
      })
    },  
    // 国家选择
    country(data) {
      this.ruleForm.areaCode = data.n;
    },
    rememberAccount(account) {
      window.localStorage.setItem("account", account);
    },
    // 验证表单
    validateForm(formName) {
      var _this = this;
      let { account, secretCode, areaCode } = this.ruleForm;
      this.$refs[formName].validate((valid) => {
        if (valid == true) {
          this.loading = true;
          let parmas = {
            phMail: account,
            password: secretCode,
            areaCode: areaCode,
          };
          _this
            .$post1("member/member/login", parmas)
            .then((res) => {
              this.loading = false;
              if (res.status == "FAILED") {
                _this.$message.error(res.errorMessage);
              } else if (res.status == "SUCCEED") {
                _this.rememberAccount(account);
                _this.setLogin(true);
                _this.setToken(res.result.token);
                _this.setUserId(res.result.id);
                _this.$message({
                  message: "登录成功",
                  type: "success",
                });
                _this.$router.replace({
                  path: "/",
                });
              }
            })
            .catch((res) => {
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
          areaCode: "86",
        };
        this.$post1("/member/member/login", params).then((res) => {
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
    },
  },
};
</script>

<style lang="less" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: #00a2ff;
  background: url('../../src/assets/img/home/login-revamp-bg.png');
  background-size: cover;
  background-position: center;
}
._3QECpvrj{
  width: 500px;
  a{
    color: #c3dde6;
    text-decoration: underline;
  }
}

.content {
  padding: 5% 0 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  width: 650px;
  height: 750px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  // margin: 0 auto;
  background: #fff;
  border-radius: 3px;
  padding: 40px 40px 20px;
}
.register-box{
  background: #0f1723;
  width: 550px;
  height: 670px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forgetPass {
  display: block;
  text-align: left;
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
.publicInput{
  width: 500px;
}

.publicInput /deep/ .el-input__inner {
  background: transparent;
  border: 1px solid #dfe2e7;
  width: 100%;
  color: #333;
  height: 60px;
  line-height: 60px;
  font-size: initial;
}

.publicInput /deep/ .el-input__inner::placeholder {
  font-size: initial;
}

.publicInput /deep/ .el-form-item__content {
  width: 100% !important;
  margin: 10px 0 0 0 !important;
}

.publicInput /deep/ .el-form-item__error {
  font-size: 14px;
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
