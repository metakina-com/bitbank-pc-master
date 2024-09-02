<template>
  <div class="auth_bg min-hei600" v-if="init">
    <div class="header">
      <div class="auth_section c_fff size24 flex flex-column jut_center heiall">
        <div>
          <p v-show="nickName" class="bold size24">{{nickName}}</p>
          <div v-show="userInfo&&!nickName">
            <div v-show="isPhone" class="size24 bold">{{userAccount | encryptionphone}}</div>
            <div v-show="!isPhone" class="size24 bold">{{userAccount | encryptionmail}}</div>
          </div>
        </div>
        <p class="size14 pad-t-10 pad-b-15">UID:{{userId}}</p>
      </div>
    </div>
    <div class="auth_section pad-b-100">
      <div class="card">
        <h2 class="h2">账户中心</h2>
        <div class="content">
          <div class="flex bet bor-b items">
            <span>手机</span>
            <div v-if="userInfo.phone==''" class="blue pointer" @click="bind('phone')">绑定</div>
            <div v-else>已绑定</div>
          </div>
          <div class="flex bet bor-b items">
            <span>邮箱</span>
            <div v-if="userInfo.mail==''" class="blue pointer" @click="bind('email')">绑定</div>
            <div v-else>已绑定</div>
          </div>
          <!-- <div class="flex bet bor-b items">
            <span>交易密码</span>
            <div
              v-if="userInfo.payPassword==''"
              class="blue pointer"
              @click="setPwd('设置交易密码','trascation')"
            >设置</div>
            <div v-else class="pointer" @click="setPwd('修改交易密码','trascation')">修改</div>
          </div>-->
          <div class="flex bet bor-b items">
            <span>登录密码</span>
            <div class="blue pointer" @click="setPwd('修改登录密码','login')">修改</div>
          </div>
        </div>
      </div>
      <div class="card">
        <h2 class="h2">个人设置</h2>
        <div class="content">
          <div class="flex bet bor-b items">
            <span>{{$t('message.realname')}}</span>
            <div
              class="blue pointer"
              @click="goRealname"
              v-if="(userInfo.cardState==null)||!userInfo.cardState||!isRenzhang"
            >设置</div>
            <div v-else class="blue pointer" @click="goRealname">修改</div>
          </div>
          <div class="flex bet bor-b items">
            <span>收款方式</span>
            <div class="blue pointer" @click="goPayment">设置</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 绑定手机号 -->
    <el-dialog
      :title="type=='phone'?'绑定手机':'绑定邮箱'"
      :visible.sync="isShow"
      width="480px"
      :before-close="handleClose"
      @close="close"
      :close-on-click-modal="false"
      
    >
      <div>
        <div class="mar-t-10" v-if="type=='phone'">
          <p class="size12 c333 pad-b-6">手机号</p>
          <div class="flex">
            <country @input="country" class="mar-r-10"></country>
            <el-input v-model="phone"></el-input>
          </div>
        </div>
        <div class="mar-t-10" v-else>
          <p class="size12 c333 pad-b-6">邮箱</p>
          <el-input v-model="email"></el-input>
        </div>
        <div class="mar-t-10">
          <p class="size12 c333 pad-b-6">验证码</p>
          <div class="relative">
            <el-input v-model="scsCode" type="tel" autocomplete="off" maxlength="6"></el-input>
            <div @click="sendCode" class="ab right-1 top-1">
              <sendCode ref="mychild1" @res="codeResFun" :type="type"></sendCode>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
      </span>
    </el-dialog>
    <!-- 修改设置密码 -->
    <el-dialog
      :title="pwd.title"
      :visible.sync="isShowPwd"
      width="480px"
      :before-close="handleClose"
      @close="close"
       :close-on-click-modal="false"
    >
      <!-- 修改登陆密码 -->
      <div v-if="pwd.type=='login'">
        <div class="mar-t-10">
          <p class="size12 c333 pad-b-6">原密码</p>
          <el-input v-model="pwd.account" placeholder="请输入原密码" type="password" show-password></el-input>
        </div>
        <div class="mar-t-10">
          <p class="size12 c333 pad-b-6">新密码</p>
          <el-input
            v-model="pwd.password"
            placeholder="请输入8-20 位非纯数字字符"
            type="password"
            show-password
          ></el-input>
        </div>
        <div class="mar-t-10">
          <p class="size12 c333 pad-b-6">确认密码</p>
          <el-input v-model="pwd.passwordOk" placeholder="请再次输入密码" type="password" show-password></el-input>
        </div>
        <div class="mar-t-10 flex flex_right">
          <span class="forget" @click="forGet">{{ $t("message.forgot_password") }}</span>
        </div>
      </div>
      <!-- 修改交易密码 -->
      <!-- <div v-if="pwd.type=='trascation'">
        <div class="mar-t-10" v-if="type=='phone'">
          <p class="size12 c333 pad-b-6">手机号</p>
          <div class="flex">
            <country @input="country" class="mar-r-10"></country>
            <el-input v-model="phone"></el-input>
          </div>
        </div>
        <div class="mar-t-10" v-else>
          <p class="size12 c333 pad-b-6">邮箱</p>
          <el-input v-model="email"></el-input>
        </div>
        <div class="mar-t-10">
          <p class="size12 c333 pad-b-6">验证码</p>
          <div class="relative">
            <el-input v-model="scsCode" type="tel" autocomplete="off" maxlength="6"></el-input>
            <div @click="sendCode" class="ab right-1 top-1">
              <sendCode ref="mychild1" @res="codeResFun" :type="type"></sendCode>
            </div>
          </div>
        </div>
      </div>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitPwd" :loading="loading">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import country from "../../../components/common/country.vue";
import sendCode from "../../../components/common/sendCode.vue";
import { mapActions } from "vuex";
export default {
  name: "auth",
  components: { country, sendCode },
  data() {
    return {
      userInfo: {},
      name: "",
      idCard: "",
      loading: false,
      isRenzhang: false,
      idNUm: "",
      IdName: "",
      init: false,
      userAccount: "",
      isPhone: true,
      isShow: false, //绑定账号弹框
      isShowPwd: false, //修改设置密码弹框
      type: "",
      phone: "",
      email: "",
      countryCode: 86,
      scsCode: "",
      pwd: {
        title: "",
        type: "",
        account: "", //原密码
        password: "", //新密码
        passwordOk: "", //确认密码
      },
    };
  },
  watch: {
    "pwd.account"(val) {
      if (!val) return;
      this.pwd.account = val.replace(/\s+/g, "");
    },
    "pwd.password"(val) {
      if (!val) return;
      this.pwd.password = val.replace(/\s+/g, "");
    },
    "pwd.passwordOk"(val) {
      if (!val) return;
      this.pwd.passwordOk = val.replace(/\s+/g, "");
    },
  },
  activated() {
    this.getUserInfo();
  },
  deactivated() {},
  methods: {
    ...mapActions(["setLogin", "setToken", "setUserId"]),
    handleClose(done) {
      this.$confirm("是否关闭当前弹窗")
        .then((_) => {
          this.close();
          done();
        })
        .catch((_) => {});
    },
    //设置修改密码
    setPwd(title, type) {
      this.isShowPwd = true;
      this.pwd.title = title;
      this.pwd.type = type;
    },
    close() {
      this.isShow = false;
      this.phone = "";
      this.email = "";
      this.countryCode = 86;
      this.scsCode = "";
      this.isShowPwd = false;
      this.pwd = {};
    },
    // 国家选择
    country(data) {
      this.countryCode = data.n;
    },
    //短信验证码发送前验证账号信息
    codeResFun(res) {
      // console.log(res
      this.$util.Toast(res, "warning");
    },
    //绑定邮箱或手机号码
    submit() {
      let { phone, email, type, scsCode, countryCode } = this;
      let data = {
        phMail: type == "phone" ? phone : email,
        regType: type == "phone" ? "PHONE" : "MAIL",
        member: this.$store.state.userId,
        code: scsCode,
      };
      if (type == "phone") {
        if (!phone) {
          this.$util.Toast("请输入手机号码", "warning");
          return false;
        }
        if (this.$util.testPhone(phone)) {
          this.$util.Toast("手机号格式错误", "warning");
          return false;
        }
        data["areaCode"] = countryCode;
      } else {
        if (!email) {
          this.$util.Toast("请输入邮箱号码", "warning");
          return false;
        }
        if (this.$util.testEmail(email)) {
          this.$util.Toast("邮箱格式错误", "warning");
          return false;
        }
      }

      if (!scsCode) {
        this.$util.Toast("请输入验证码", "warning");
        return false;
      }
      this.loading = true;
      this.$post1("member/member/setPhMail", data)
        .then((res) => {
          this.loading = false;
          if (res.status == "FAILED") {
            this.$util.Toast(res.errorMessage, "warning");
          } else if (res.status == "SUCCEED") {
            this.$util.Toast("绑定成功", "success");
            this.close();
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //发送短信验证码
    sendCode() {
      this.$refs.mychild1.codeSend(
        this.type == "phone" ? this.phone : this.email,
        "SETPHMAIL",
        this.countryCode
      );
    },
    //绑定账号
    bind(type) {
      if (!this.$util.isLogin()) {
        return;
      }
      this.type = type;
      this.isShow = true;
    },
    //设置/修改密码按钮
    submitPwd() {
      let { account, password, passwordOk } = this.pwd;
      if (this.pwd.type == "login") {
        if (!account) {
          this.$util.Toast("请输入原密码", "warning");
          return false;
        }
        if (!password) {
          this.$util.Toast("请输入新密码", "warning");
          return false;
        }
        if (account == password) {
          this.$util.Toast("愿密码和新密码不能一样", "warning");
          return false;
        }
        if (!passwordOk) {
          this.$util.Toast("请输入确认密码", "warning");
          return false;
        }
        if (password != passwordOk) {
          this.$util.Toast("两次密码不一致", "warning");
          return false;
        }
        this.loading = true;
        this.$post1("member/member/resetPassword", {
          member: this.$store.state.userId,
          oldPass: account,
          newPass: password,
        })
          .then((res) => {
            this.loading = false;
            if (res.status == "FAILED") {
              this.$util.Toast(res.errorMessage);
            } else if (res.status == "SUCCEED") {
              this.close();
              this.$util.Toast("修改成功,重新登录", "success");
              window.localStorage.removeItem("userId");
              window.sessionStorage.removeItem("token");
              window.sessionStorage.removeItem("isLogin");
              setTimeout((res) => {
                this.$router.push("/login");
              }, 500);
            }
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    forGet() {
      this.close();
      this.$router.push("/passwordForget");
    },
    //去支付方式
    goPayment() {
      if (!this.$util.isLogin()) {
        return;
      }
      if (!this.isRenzhang) {
        this.$util.Toast("请先进行初级实名认证", "warning");
        return;
      }
      this.$router.push({
        path: `/payment`,
      });
    },
    //实名认证
    goRealname() {
      if (!this.$util.isLogin()) {
        return;
      }
      this.$router.push({
        path: `/personalCenter`,
      });
    },
    getUserInfo() {
      this.$get("member/member/getMember", {
        member: this.$store.state.userId,
      }).then((res) => {
        this.init = true;
        if (res.status == "FAILED") {
          this.Toast(res.errorMessage);
        } else if (res.status == "SUCCEED" && res.result) {
          this.userInfo = res.result;
          this.userId = res.result && res.result.uuid ? res.result.uuid : "";
          this.nickName = res.result.nickName;
          if (res.result.cardNo == "") {
            this.isRenzhang = false;
          } else {
            this.isRenzhang = true;
          }
          if (res.result.phone == "") {
            this.userAccount = res.result.mail;
            this.isPhone = false;
          } else {
            this.userAccount = res.result.phone;
            this.isPhone = true;
          }
        }
      });
    },
  },
  computed: {},
};
</script>

<style lang="less" scoped>
.header {
  height: 168px;
  background-color: #202f4e;
  width: 100%;
}
.auth_bg {
  /deep/.el-dialog__body {
    padding-top: 0;
  }
  .auth_section {
    width: 1200px;
    margin: 0 auto;
    .card {
      border: 1px solid #e6ecf2;
      border-radius: 2px;
      margin-top: 15px;
      .h2 {
        padding-left: 24px;
        font-size: 14px;
        line-height: 48px;
        border-bottom: 1px solid #e6ecf2;
        background-color: #f2f6fa;
        color: #18232d;
        font-weight: 500;
      }
      .content {
        padding: 0 20px;
        .items {
          padding: 20px 0;
          border-bottom: 1px solid #e6ecf2;
          &:last-of-type {
            border-bottom: none;
          }
        }
      }
    }
  }
  .forget {
    color: #357ce1;
    cursor: pointer;
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
