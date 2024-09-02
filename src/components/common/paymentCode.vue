<template>
  <!-- 单项选择器的组件 -->
  <div id="single_picker">
    <el-dialog title="安全认证" :visible.sync="show" width="480px" @close="close" append-to-body :close-on-click-modal="false">
      <div>
        <div class="mar-t-10">
          <div class="flex">
            <el-input
              type="tel"
              v-model="scsCode"
              autocomplete="off"
              maxlength="6"
              placeholder="请输入验证码"
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
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit1">提交</el-button>
      </span>
    </el-dialog>
    <!-- <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <van-picker
        :columns="list"
        @change="onChange"
        @confirm="onConfirm"
        @cancel="cancelFn"
        show-toolbar
        :default-index="index<0?0:index"
        ref="pickers"
      />
    </van-popup>-->
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
      return window.localStorage.getItem("account");
      // return this.$store.state.phone;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    submit() {
      this.show = true;
    },
    submit1() {
      if (this.scsCode.length == 6) {
        let data = {
          code: this.scsCode,
          type: this.type
        };
        this.$emit("submitEvent", data);
        this.close();
      }
    },
    // 获取验证码
    codeSend() {
      var _this = this;
      if (!this.phone) {
        this.$confirm("您当前未绑定手机号，去绑定？")
          .then(_ => {
            _this.$router.push("/accountCenter");
          })
          .catch(_ => {});
        return;
      }
      let data = {
        phoneCode: this.$store.state.countryCode,
        phone: this.phone
      };
      if (this.type == "bank") {
        data["type"] = "OTCBANK";
      } else if (this.type == "weixin") {
        // console.log("微信");
        data["type"] = "OTCWECHAT";
      } else {
        data["type"] = "OTCALIAY";
      }
      let url = "data/sms/sendSms";

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
 
<style scoped="scoped">
#single_picker {
  display: inline-block;
}
</style>