<template>
  <div class="nav">
    <div class="nav_header clearfix ">
      <div style="float: left;position: relative;height: 58px;display: flex;align-items: center;">
        <router-link to="/">
          <img class="nav_img mar-t-10" src="../../assets/images/fx_logo.png" style="" />
          <!-- <span style="color:#fff;font-weight:bold;vertical-align: top;">BitBANK</span> -->
        </router-link>
        <ul class="nav_ul pad-t-10">
          <li
            v-for="(val,index) of navList"
            :key="index"
            :style="indexTabSel == index&&isActive?'color:#40a9ff;':''"
            @click="appleList(val.link,index)"
          >
            <span class="bold">{{val.name}}</span>
          </li>
          <!-- <li class="sevenLi">
            <a href="https://fvexsupport.zendesk.com/" target="_blank">{{$t('message.support')}}</a>
          </li>-->
        </ul>
      </div>
      <div style="float:right;height:100%;display: flex;">
        <!-- <div v-if="!showLogin" style="display: inline-block;" class="dropdownMr">
          <router-link to="/login" class="nav_router pointer">{{$t('message.login')}}</router-link>|
          <router-link to="/register" class="nav_router pointer">{{$t('message.register')}}</router-link>
        </div>-->
        <div style="display: flex;align-items: center;" v-if="!isLogin" class="dropdownMr">
          <div> <router-link to="/login" class="nav_router pointer bold">{{$t('message.login')}}</router-link></div>
          <div class="pad-10">
             <el-button style="background: rgb(18, 91, 255);border: 2px solid rgb(18, 91, 255);width: 90px;">
                <router-link to="/register" class="nav_router pointer bold">{{$t('message.register')}}</router-link>
              </el-button>
          </div>
        </div>
        <div v-if="isLogin" style="display: inline-block;">
          <!-- 订单 -->
          <el-dropdown class="dropdownMr" placement="top">
            <span class="el-dropdown-link selectDow">
              <i style="font-size: 16px;color:#fff;" class="el-icon-tickets el-icon--right"></i>
              <span class="bold">{{$t('message.order')}}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>
                <router-link to="/user/order/legalTender">
                  <i class="el-icon-menu el-icon--right"></i>
                  <span>{{$t('message.c2c_order')}}</span>
                </router-link>
              </el-dropdown-item> -->
              <el-dropdown-item>
                <router-link to="/user/order/entrust">
                  <i class="el-icon-menu el-icon--right"></i>
                  <span>{{$t('message.commission_order')}}</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/user/order/contract">
                  <i class="el-icon-menu el-icon--right"></i>
                  <span>{{$t('contract.contract_order')}}</span>
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 资产 -->
          <el-dropdown class="dropdownMr" placement="top" v-if="isLogin">
            <span class="el-dropdown-link selectDow">
              <i style="font-size: 16px;color:#fff;" class="el-icon-s-goods el-icon--right"></i>
              <span class="bold">{{$t('message.assets')}}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/user/assets/balances">
                  <i class="el-icon-s-home el-icon--right"></i>
                  <span class="bold">{{$t('message.balances')}}</span>
                </router-link>
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                <router-link to="/user/assets/recharge">
                  <i class="el-icon-document-add el-icon--right"></i>
                  <span class="bold">{{$t('message.recharge')}}</span>
                </router-link>
              </el-dropdown-item> -->
              <!-- <el-dropdown-item>
                <router-link to="/user/assets/withdraw">
                  <i class="el-icon-document-remove el-icon--right"></i>
                  <span class="bold">{{$t('message.withdraw')}}</span>
                </router-link>
              </el-dropdown-item> -->
              <!-- <el-dropdown-item>
                <router-link to="/user/assets/accountOrder">
                  <i class="el-icon-s-order el-icon--right"></i>
                  <span class="bold">{{$t('message.account_order')}}</span>
                </router-link>
              </el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 个人中心 -->
          <el-dropdown class="dropdownMr" placement="top">
            <span class="el-dropdown-link">
              <i style="font-size: 24px;color:#fff;" class="el-icon-s-custom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/user/center/my">
                  <i class="el-icon-user-solid el-icon--right"></i>
                  <span class="bold">{{$t('message.personal_center')}}</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/user/auth">
                  <i class="el-icon--right"></i>
                  <span>{{$t('message.realname')}}</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/user/center/invite">
                  <i class="el-icon-present el-icon--right"></i>
                  <span>{{$t('message.rebate')}}</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/user/center/merchant">
                  <i class="el-icon-user el-icon--right"></i>
                  <span>{{$t('message.merchant')}}</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="logout">
                  <i class="el-icon-remove-outline el-icon--right"></i>
                  <span>{{$t('message.logout')}}</span>
                </a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <!-- <el-dropdown class="downLoad dropdownMr pad-t-10">
          <span class="el-dropdown-link c_fff ">下载</span>
          <el-dropdown-menu slot="dropdown" >
            <div class="pad-l-r-10">
              <img src="../../assets/images/Deposit.jpg" alt srcset />
              <p class="v-center">扫码下载</p>
            </div>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-dropdown @command="handleCommand" class="selectDow dropdownMr pad-t-10">
          <el-button type="primary" class="el-dropdown-link language-box" style="background: rgb(18, 91, 255);">
            {{$t('message.language')}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="language-item">
            <el-dropdown-item
              v-for="(val,index) of languageList"
              :key="index"
              :command="val.key"
            >{{val.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div style="display: inline-block;" v-if="!isLogin" class="dropdownMr">
          <router-link to="/login" class="nav_router pointer">{{$t('message.login')}}</router-link>|
          <router-link to="/register" class="nav_router pointer">{{$t('message.register')}}</router-link>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "indexNav",
  data() {
    return {
      languageList: [
        {
          name: "English",
          key: "en"
        },
        {
          name: "简体中文",
          key: "zh"
        },
        {
          name: "繁體中文",
          key: "zh_tw"
        },
        // {
        //   name: "한국어",
        //   key: "ko"
        // },
        {
          name: "日本語",
          key: "jp"
        },
        // {
        //   name: "español",
        //   key: "es"
        // },
        // {
        //   name: "Français",
        //   key: "fr"
        // }
      ],
      showLogin: false,
      indexTabSel: 0,
      isActive: true
    };
  },
  computed: {
    navList() {
      return [
        {
          name: this.$t("message.index"),
          link: "/home"
        },
        {
          name: this.$t("message.c2c"),
          link: "/trade/buy"
        },
        {
          name: this.$t("message.coin2coin"),
          link: "/market"
        },
        // {
        //   name: this.$t("message.leveragedDeals"),
        //   link: ""
        // },
        {
          name: this.$t("message.contractDeal"),
          link: "/match"
        },
        // {
        //   name: this.$t("message.onCurrencyApplication"),
        //   link: "/single/single_proposer"
        // }
      ];
    },
    isLogin() {
      return this.$store.state.isLogin;
    }
  },
  watch: {
    $route(to) {
      let name = to.path;
      var nav = this.navList.filter(item => item.link == name);
      this.isActive = nav.length > 0 ? true : false;
      if (name.indexOf("single/single_proposer") > 0) {
        this.indexTabSel = 5;
      } else if (
        name.indexOf("notice") > 0 ||
        name.indexOf("single") > 0 ||
        name.indexOf("user") > 0
      ) {
        this.indexTabSel = -1;
      } else {
        this.navList.filter((item, index) => {
          if (name == item.link) {
            this.indexTabSel = index;
          }
        });
      }
    }
  },
  mounted() {
    var _this = this;
    _this.loginGit();
    let userId = localStorage.getItem("usda_userId");
    if (userId == null || userId == "" || userId == undefined) {
      _this.showLogin = false;
    } else {
      _this.showLogin = true;
    }
  },
  methods: {
    ...mapActions(["setLogin", "setToken", "setUserId"]),
    //验证是否登录
    loginGit() {
      //this.$http.get(this.utils.config + '/api/ex/member/user/findUserBaseInfo', {
      //headers: this.utils.axiosCofig()
      //           }).then((data) => {
      //             if(data.data.msg == "err token" || data.data.msg == " error request"){
      //               this.showLogin = false;
      //               localStorage.removeItem('usda_userId');
      //               localStorage.removeItem('usda_auth_token');
      //               localStorage.removeItem('usda_auth_userName');
      //             }
      //       });
    },
    // articleList(index) {
    //     this.indexTabSel = 6;
    //     if (index == 0) {
    //         this.$router.push({
    //             path: `/article/gsxw`,
    //         })
    //     } else {
    //         this.$router.push({
    //             path: `/article/hyzx`,
    //         })
    //     }
    // },
    handleCommand(command) {
      this.$i18n.locale = command;
      this.$emit('languageChange',command)
      localStorage.setItem("language", command);
    },
    // 上币申请提交
    appleList(link) {
      if (link == "") {
        this.$message(this.$t("message.notChineseRegion"));
      } else {
        this.$router.push({
          path: link
        });
      }
    },

    zichan() {
      this.$router.push({
        path: "/zichan"
      });
    },
    
    anquan() {
      this.$router.push({
        path: "/safe"
      });
    },

    logout() {
      this.$confirm("是否退出当前账号", "提示")
        .then(() => {
          this.setLogin(false);
          window.localStorage.removeItem("userId");
          window.localStorage.removeItem("token");
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          this.$router.push({
            path: "/login"
          });
        })
        .catch(() => {});
      // let list = {
      //   token: localStorage.getItem("usda_auth_token"),
      //   userName: localStorage.getItem("usda_auth_userName")
      // };
      // this.$http.post(this.utils.config + "/api/logout", list).then(data => {
      //   if (!data.data.success) {
      //     this.$message.error(data.data.msg);
      //     return;
      //   } else {
      //     localStorage.removeItem("usda_userId");
      //     localStorage.removeItem("usda_auth_token");
      //     localStorage.removeItem("usda_auth_userName");
      //     this.$message({
      //       message: data.data.msg,
      //       type: "success",
      //       duration: 1000,
      //       onClose() {
      //         this.$router.push("/login");
      //       }
      //     });
      //   }
      // });
    }
  }
};
</script>

<style scoped>
.nav {
  padding: 0px;
  height: 58px;
  line-height: 58px;
}
/* .language-box{
  background: #125bff;
  height: 40px;
} */
.nav_header {
  -webkit-transition: 0.5s;
  transition: 0.5s;
  overflow: hidden;
  font-size: 14px;
  line-height: 58px;
  position: relative;
  z-index: 9;
  color: #d8dfe6;
  background: #000;
  border-bottom: 1px solid rgb(26, 35, 50);
  width: 100%;
  padding: 0 20px;
  margin: 0 auto;
  font-size: bold;
}

.nav_img {
  position: relative;
  transform: translateY(7px);
  width:140px;
}

.nav_ul {
  display: inline-block;
  margin-left: 50px;
}

.nav_ul > li {
  float: left;
  padding-right: 40px;
  cursor: pointer;
}

.nav_ul > li:hover {
  color: #40a9ff;
}

.sevenLi a {
  color: #d8dfe6;
}

.sevenLi:hover > a {
  color: #40a9ff;
}

.selectDow {
  width: 100px;
  text-align: center;
  color: #fff;
}

.selectDow > span:hover {
  color: #40a9ff;
  cursor: pointer;
}
.downLoad >span:hover{
  color: #40a9ff;
  cursor: pointer;
}
.nav_router {
  color: #fff;
  padding: 0 2px;
}

.nav_router:hover {
  color: #40a9ff;
}

.dropdownMr {
  margin-right: 22px;
}
.dropdownMr .logout {
  color: #fff;
}
.language-item{
  /* height: 50px; */
  
}

.language-item /deep/ .el-dropdown-menu__item {
  padding: 0 20px;
}

.el-dropdown-menu__item {
  padding: 0;
}

.el-dropdown-menu__item a {
  display: block;
  padding: 0 20px;
}
</style>
