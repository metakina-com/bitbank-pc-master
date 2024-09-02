<template>
  <div class>
    <div class="headers">
      <div class="otcHeader flex bet size16">
        <div class="header_l flex align_end">
          <span :class="{'cur':curType=='self'}" @click="switchTab('self')">{{ $t('otc.zxjy') }}</span>
        </div>
        <div class="header_r flex align_end">
          <span
            @click="switchTab('list')"
            :class="{'cur':curType=='list'}"
            v-if="userInfo.storeState=='PASS'"
          >{{ $t('otc.gglb') }}</span>
          <span @click="switchTab('advertise')" :class="{'cur':curType=='advertise'}">
            <!-- 发布广告 -->
            {{ $t('otc.fbgg') }}
          </span>

          <span :class="{'cur':curType=='order'}" @click="switchTab('order')">
            <!-- 法币订单 -->
          {{ $t('otc.fbdd') }}
          </span>
        </div>
      </div>
    </div>
    <div class="otc_container">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" class="min-hei500" :user-info="userInfo" />
      </keep-alive>
      <router-view
        v-if="!$route.meta||!$route.meta.keepAlive"
        class="min-hei500"
        :userInfo="userInfo"
      ></router-view>
    </div>
    <!-- 绑定手机号 -->
    <el-dialog
      :title="$t('otc.sqsh')"
      :visible.sync="isShow"
      width="480px"
      :before-close="handleClose"
      @close="close"
      :close-on-click-modal="false"
    >
      <div>
        <div class="mar-t-10 flex align-center">
          <p class="size12 c333 mar-r-15 title">{{$t('otc.nickname')}}</p>
          <div class="flex flex1">
            <el-input v-model="merchantInfo.name" :placeholder="$t('otc.enter_nickname')"></el-input>
          </div>
        </div>
        <div class="mar-t-10 flex align-center">
          <p class="size12 c333 mar-r-15 title">{{$t('otc.phone')}}</p>
          <div class="flex1">
            <el-input
              v-model="merchantInfo.phone"
              type="tel"
              autocomplete="off"
              :placeholder="$t('otc.enter_phone')"
            ></el-input>
          </div>
        </div>
        <div class="mar-t-10 flex align-center">
          <p class="size12 c333 mar-r-15 title">{{$t('otc.wx_no')}}</p>
          <div class="flex1">
            <el-input v-model="merchantInfo.weixin" autocomplete="off" :placeholder="$t('otc.enter_wx_no')"></el-input>
          </div>
        </div>
        <div class="mar-t-10 flex align-center">
          <p class="size12 c333 mar-r-15 title">{{$t('otc.email_no')}}</p>
          <div class="flex1">
            <el-input v-model="merchantInfo.email" autocomplete="off" placeholder="$t('otc.enter_email_no')"></el-input>
          </div>
        </div>
        <div class="mar-t-10 flex align-center">
          <p class="size12 c333 mar-r-15 title">{{$t('otc.id_card')}}</p>
          <div class="flex1">
            <el-input v-model="merchantInfo.idCard" autocomplete="off" placeholder="$t('otc.enter_id_card')"></el-input>
          </div>
        </div>
        <div class="mar-t-20 flex jut_center align_center size12 pointer">
          <div class="flex align_center mar-r-5">
            <img
              v-show="!read"
              @click="read=true"
              class="wid12 hei12"
              src="./../../assets/images/read.png"
              alt
            />
            <img
              v-show="read"
              @click="read=false"
              class="wid12 hei12"
              src="./../../assets/images/readed.png"
              alt
            />
          </div>
          <div class="flex">
            <span class="c666" @click="read=!read">
              <!-- 我已阅读并同意 -->
              {{ $t('otc.read') }}
            </span>

            <!-- <span class=" pad_l_r_5 c666" >已阅读并同意</span> -->
            <router-link to>
              <span class="blue">
                <!-- 《成为商户条款》 -->
                {{ $t('otc.shtk') }}
              </span>
              <!-- <span class="c_blue">《用户注册协议》</span> -->
            </router-link>
            <span class="c666">
              <!-- 并冻结1000USTD作为保证金。 -->
              {{ $t('otc.sh') }}</span>
          </div>
        </div>
        <div class="mar-t-20 size12">
          <!-- 温馨提示：申请成商户可以在OTC上发布出售单和求购单,
          系统将在OTC账户冻结您的1000USDT保证金。 -->
          {{ $t('otc.otc_tip1') }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit" :loading="loading">{{ $t('common.submit') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "shopUsdt",
  data() {
    return {
      curType: "self", //self 自选交易
      userInfo: {},
      isShow: false,
      loading: false,
      merchantInfo: {
        name: "", //商户名字
        phone: "", //手机号
        UID: "", //uid
        weixin: "", //微信号
        email: "", //邮箱
        idCard: "", //身份证
      }, //商户信息
      read: false, //是否阅读
    };
  },
  computed: {
    resetUserinfo() {
      return this.$store.state.resetUserinfo;
    },
  },
  watch: {
    resetUserinfo(val) {
      console.log(val);
      if (val) {
        this.getUserInfo();
        this.setResetUserinfo(0);
      }
    },
    $route(to, from) {
      let path = to.path;
      if (path.indexOf("/trade/order") >= 0) {
        this.curType = "order";
      }
      if (path.indexOf("/trade/buy") >= 0) {
        this.curType = "self";
      }
      if (path.indexOf("/trade/merchantAudit") >= 0) {
        this.curType = "advertise";
      }
      if (path.indexOf("/trade/advertiseList") >= 0) {
        this.curType = "list";
      }
      if (path.indexOf("/trade") >= 0) {
        this.$store.state.isLogin && this.getUserInfo();
      }
    },
    "merchantInfo.name"(val) {
      if (!val) return;
      this.merchantInfo.name = val.replace(/\s+/g, "");
    },
    "merchantInfo.phone"(val) {
      if (!val) return;
      this.merchantInfo.phone = val.replace(/\s+/g, "");
    },
    "merchantInfo.uid"(val) {
      if (!val) return;
      this.merchantInfo.uid = val.replace(/\s+/g, "");
    },
    "merchantInfo.weixin"(val) {
      if (!val) return;
      this.merchantInfo.weixin = val.replace(/\s+/g, "");
    },
    "merchantInfo.email"(val) {
      if (!val) return;
      this.merchantInfo.email = val.replace(/\s+/g, "");
    },
    "merchantInfo.idCard"(val) {
      if (!val) return;
      this.merchantInfo.idCard = val.replace(/\s+/g, "");
    },
  },
  methods: {
    switchTab(type) {
      if (type != "self") {
        if (!this.$util.isLogin()) {
          return;
        }
      }
      if (type == this.curType) return;
      if (type == "advertise") {
        if (this.userInfo.cardState != "PASS") {
          this.$confirm(this.$t('otc.otc_tip2'))
            .then(() => {
              this.$router.push("/personalCenter");
            })
            .catch(() => {});
          return false;
        }
        if (
          this.userInfo.storeState == "null" ||
          this.userInfo.storeState == "REFUSE" ||
          this.userInfo.storeState == null
        ) {
          this.isShow = true;
          return false;
        }
      }

      this.curType = type;
      if (type == "order") {
        this.$router.push("/trade/order");
      }
      if (type == "self") {
        this.$router.push("/trade/buy");
      }
      if (type == "advertise") {
        this.$router.push({
          path: `/trade/merchantAudit`,
        });
      }
      if (type == "list") {
        this.$router.push({
          path: `/trade/advertiseList`,
        });
      }
    },
    getUserInfo() {
      this.$get("member/member/getMember", {
        member: this.$store.state.userId,
      }).then((res) => {
        if (res.status == "FAILED") {
          this.$util.Toast(res.errorMessage);
        } else if (res.status == "SUCCEED" && res.result) {
          this.userInfo = res.result;
        }
      });
    },
    //商户申请提交
    submit() {
      if (!this.merchantInfo.name) {
        this.$util.Toast(this.$t('otc.enter_nickname'), "warning");
        return;
      }
      if (!this.merchantInfo.phone) {
        this.$util.Toast(this.$t('otc.enter_phone'), "warning");
        return;
      }
      // if (!this.merchantInfo.uid) {
      //   this.$util.Toast("请输入UID");
      //   return;
      // }
      if (!this.merchantInfo.weixin) {
        this.$util.Toast(this.$t('otc.enter_wx_no'), "warning");
        return;
      }
      if (!this.merchantInfo.email) {
        this.$util.Toast(this.$t('otc.enter_email_no'), "warning");
        return;
      }
      if (this.$util.testEmail(this.merchantInfo.email)) {
        this.$util.Toast(this.$t('otc.enter_succ_email'), "warning");
        return;
      }
      if (!this.merchantInfo.idCard) {
        this.$util.Toast(this.$t('otc.enter_id_card'), "warning");
        return;
      }
      if (!this.read) {
        this.$util.Toast(this.$t('otc.read_tip'), "warning");
        return;
      }
      var data = {
        member: this.$store.state.userId,
        storeName: this.merchantInfo.name,
        phone: this.merchantInfo.phone,
        uuid: this.merchantInfo.uid,
        wechatCode: this.merchantInfo.weixin,
        mail: this.merchantInfo.email,
        card: this.merchantInfo.idCard,
      };
      this.loading = true;
      this.$post1("member/member/setStore", data)
        .then((res) => {
          this.loading = false;
          if (res.status == "FAILED") {
            this.$util.Toast(res.errorMessage);
          } else if (res.status == "SUCCEED" && res.result) {
            this.$util.Toast(this.$t('otc.sqcc'), "success");
            this.close();
            this.$router.push({
              path: `/trade/merchantAudit`,
            });
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    close() {
      this.isShow = false;
      this.loading = false;
      this.merchantInfo = {};
      this.read = false;
    },
    handleClose(done) {
      this.$confirm(this.$t('otc.is_close_modal'))
        .then((_) => {
          this.close();
          done();
        })
        .catch((_) => {});
    },
  },
  activated() {
    let path = this.$route.path;
    if (path.indexOf("/trade/order") >= 0) {
      this.curType = "order";
    }
    if (path.indexOf("/trade/buy") >= 0) {
      this.curType = "self";
    }
    if (path.indexOf("/trade/merchantAudit") >= 0) {
      this.curType = "advertise";
    }
    if (path.indexOf("/trade/advertiseList") >= 0) {
      this.curType = "list";
    }
    this.$store.state.isLogin && this.getUserInfo();

    this.$hub.$on("setNickNames", (res) => {
      this.$store.state.isLogin && this.getUserInfo();
    });

  },
};
</script>
<style lang="less">
.menu {
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__item {
    font-size: 16px;
  }
}
</style>
<style lang="less" scoped>
.headers {
  background: #1b2945;
}
/deep/.el-dialog__body {
  padding-top: 0;
}
.title {
  min-width: 50px;
}
.otcHeader {
  width: 1200px;
  margin: 0 auto;
  height: 82px;
  span {
    color: #87a2cd;
    display: block;
    padding-bottom: 10px;
    margin-right: 40px;
    border-bottom: 3px solid transparent;
    &:last-of-type {
      margin-right: 0;
    }
    &:hover {
      color: #fff;
      cursor: pointer;
    }
    &.cur {
      color: #fff;
      border-color: #357ce1;
    }
  }
}
.otc_container {
  width: 1200px;
  margin: 0 auto;
}
.tips {
  margin-top: 40px;
  background: #fff8e3;
  padding: 8px 18px 8px 24px;
  border-radius: 2px;
}
.menu {
  margin-top: 28px;
  margin-bottom: 40px;
}
.leftIcon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-block;
  background: #3c78e1;
  color: #fff;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
}
</style>
