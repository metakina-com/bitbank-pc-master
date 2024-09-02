<template>
  <div class="sendCode">
    <el-button
      class="txColoe_1 transBg"
      v-if="codeReady"
      :loading="loading1"
    >{{ $t('message.center_email_code_obtain') }}</el-button>
    <el-button
      class="txColoe_1 transBg"
      v-else
    >{{ $t('message.center_email_code_obtain1',{count: min}) }}</el-button>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      show: false,
      scsCode: "",
      min: 60,
      loading1: false,
      codeReady: true
    };
  },
  props: ["type"],
  computed: {
    phone() {
      return window.localStorage.getItem("phone");
      // return this.$store.state.phone;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    // 获取验证码
    codeSend(acount, type, code) {
      let data = {
        type: type,
        mailbox: acount
      };
      let url = "data/sms/sendMail";
      if (this.type == "phone") {
        if (acount == "") {
          this.$emit("res", "请输入手机号码");
          return false;
        } else {
          if (this.$util.testPhone(acount)) {
            this.$emit("res", "手机号格式错误");
            return false;
          }
        }
        data["phoneCode"] = code;
        data["phone"] = acount;
        url = "data/sms/sendSms";
      } else {
        if (acount == "") {
          this.$emit("res", "请输入邮箱号码");
          return false;
        } else {
          if (this.$util.testEmail(acount)) {
            this.$emit("res", "邮箱格式错误");
            return false;
          }
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
          } else {
            this.$util.Toast(res.errorMessage);
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
    close() {
      this.show = false;
      this.scsCode = "";
      clearTimeout(this.setcode);
      this.min = 60;
      this.codeReady = true;
    }
  }
};
</script>
 
<style scoped="scoped"  lang="less">
/deep/.el-button {
  border: none;
  background: transparent;
}
</style>