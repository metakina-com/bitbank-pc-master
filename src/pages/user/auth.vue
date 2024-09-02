<template>
  <div class="auth_bg min-hei600" v-if="init">
    <div class="auth_section pad-t-40">
      <!-- <div class="bg-fff hei60 line60 size20 pad-l-30">
        <router-link to="/personalCenter" class="pointer blue" style="color: #357ce1;">身份认证 ></router-link>
        <span class="size16">初级认证</span>
      </div>-->
      <div class="bg-fff hei60 flex align-center size20 pad-l-30">
        <el-page-header @back="goBack" content="初级认证" title></el-page-header>
      </div>
      <div class="auth_content bg-fff mar-t-20 pad-b-50">
        <div class="tips" v-if="!isRenzhang">
          <i class="el-icon-warning blue size18 mar-r-10"></i>您填写的信息必须与证件信息保持一致
        </div>
        <div class="realname pad-t-15" v-if="!isRenzhang">
          <div class="mar-t-20">
            <p class="size12 c333 pad-b-10">姓名</p>
            <el-input v-model="name"></el-input>
          </div>
          <div class="mar-t-20">
            <p class="size12 c333 pad-b-10">身份证号</p>
            <el-input v-model="idCard"></el-input>
          </div>
          <div class="mar-t-20">
            <el-button type="primary" :loading="loading" class="widall" @click="submit">认证</el-button>
          </div>
        </div>
        <div class="realname pad-t-15" v-else>
          <div class="mar-t-20">
            <p class="size12 c333 pad-b-10">姓名</p>
            <div class="right_text">{{IdName}}</div>
          </div>
          <div class="mar-t-20">
            <p class="size12 c333 pad-b-10">身份证号</p>
            <div class="right_text">{{idNUm|cardNum}}</div>
          </div>
          <div class="mar-t-20">
            <el-button type="primary" class="widall" disabled>已认证</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "auth",
  data() {
    return {
      name: "",
      idCard: "",
      loading: false,
      isRenzhang: false,
      idNUm: "",
      IdName: "",
      init: false,
    };
  },
  watch: {
    name(val) {
      this.name = val.replace(/\s+/g, "");
    },
    idCard(val) {
      this.idCard = val.replace(/\s+/g, "");
    },
  },
  mounted() {
    this.getUserInfo();
    var _this = this;
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      if (key == 13) {
        _this.submit();
      }
    };
  },
  methods: {
      goBack() {
      this.$router.go(-1);
    },
    getUserInfo() {
      this.$get("member/member/getMember", {
        member: this.$store.state.userId,
      }).then((res) => {
        if (res.status == "FAILED") {
        } else if (res.status == "SUCCEED") {
          let data = res.result;
          this.init = true;
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
        cardNo: this.idCard,
      };
      this.$post1("member/member/setAuthen", pr)
        .then((res) => {
          this.loading = false;
          if (res.status == "FAILED") {
            this.$util.Toast(res.errorMessage);
          } else if (res.status == "SUCCEED") {
            this.$util.Toast("认证成功", "success");

            // this.Toast('提交成功')
            this.getUserInfo();
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
  destroyed() {
    this.loading = false;
  },
  computed: {},
};
</script>

<style lang="less" scoped>
.auth_bg {
  background: #f2f3f8;
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
