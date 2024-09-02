<template>
  <div class="page-content">
    <div class="img_box">
      <!-- <img src="../../assets/images/Assets-banner.jpg" alt /> -->
    </div>
    <div class="main">
      <!-- <router-view></router-view> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta||!$route.meta.keepAlive"></router-view>
      <!-- <div class="margin-left">
      <ul class="navMenu">
        <li v-for="(val, index) in dataList" :key="index" :class="{active:tabActive == index}" @click="tabClick(index)">
          <router-link :to="{name:val.link}">
            <img :src="val.src" v-if="tabActive !== index" />
            <img :src="val.newsrc" v-if="tabActive == index" />
            <span>{{ val.name }}</span>
          </router-link>
        </li>
      </ul>
      </div>-->
      <!-- <div class="margin-right bgColor_3">
     
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "center",
  data() {
    return {
      tabActive: 0,
      dataList: [],
      path: "",
      showList: ""
    };
  },
  watch: {
    $route(to, from) {
      this.path = to.fullPath;
      this.userListM(to.name, to.fullPath);
    },
    "$i18n.locale"() {
      this.userListM(this.$route.name, this.$route.fullPath);
    }
  },
  mounted() {
    var _this = this;
    _this.utils.onlineNew();
    _this.path = _this.$route.fullPath;
    _this.userListM(_this.$route.name, _this.$route.fullPath);
  },
  methods: {
    tabClick(index) {
      this.tabActive = index;
    },
    userListM(name, path) {
      var _this = this;
      if (path.indexOf("center") != -1) {
        _this.dataList = _this.userList;
      } else if (path.indexOf("assets") != -1) {
        _this.dataList = _this.balancesList;
      } else {
        _this.dataList = _this.orderList;
      }
      _this.dataList.filter(function(item, index) {
        if (name == item.link) {
          _this.tabActive = index;
        }
      });
    }
  },
  computed: {
    userList() {
      return [
        {
          name: this.$t("message.personal_center"),
          icon: "el-icon-s-tools",
          link: "my"
        },
        {
          name: this.$t("message.rebate"),
          icon: "el-icon-s-goods",
          link: "invite"
        },
        {
          name: this.$t("message.merchant"),
          icon: "el-icon-s-shop",
          link: "merchant"
        }
      ];
    },
    balancesList() {
      return [
        {
          name: this.$t("message.balances"),
          src: require("../../assets/images/icon-Balances-normal.jpg"),
          newsrc: require("../../assets/images/icon-Balances-active.gif"),
          link: "balances"
        },
        {
          name: this.$t("message.recharge"),
          src: require("../../assets/images/icon-Recharge-normal.gif"),
          newsrc: require("../../assets/images/icon-Recharge-active.jpg"),
          link: "recharge"
        },
        {
          name: this.$t("message.withdraw"),
          src: require("../../assets/images/icon-Withdraw-normal.gif"),
          newsrc: require("../../assets/images/icon-Withdraw-active.jpg"),

          link: "withdraw"
        },
        {
          name: this.$t("message.account_order"),
          src: require("../../assets/images/icon-record-normal.gif"),
          newsrc: require("../../assets/images/icon-record-active.jpg"),
          link: "accountOrder"
        }
      ];
    },
    orderList() {
      return [
        {
          name: this.$t("message.c2c_order"),
          icon: "el-icon-menu",
          link: "c2c_order"
        },
        {
          name: this.$t("message.commission_order"),
          icon: "el-icon-menu",
          link: "trade_order"
        }
      ];
    }
  }
};
</script>

<style lang="less" scoped>
.page-content {
  overflow: hidden;
 background: #f2f3f8;
  .img_box {
    img {
      width: 100%;
    }
  }
}

.main {
  width: 1200px;
  margin: 0 auto;
  min-height: 600px;
  // margin-top: 30px;
  // margin-bottom: 100px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;

  .margin-left {
    margin-bottom: 20px;
    background-color: rgb(45, 54, 93);

    .navMenu {
      display: flex;
      width: 100%;
      justify-content: space-around;

      li {
        cursor: pointer;
        height: 120px;
        flex: 1;

        a {
          display: block;
          color: #999;
          text-align: center;
          line-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          top: 0;
          transition: top 0.2s linear;
        }

        span {
          display: inline-block;
          font-size: 16px;
          margin-left: 5px;
          margin-left: 24px;
        }
      }

      li:hover a {
        color: #fff;
        top: -6px;
      }

      li.active {
        background-color: rgb(30, 37, 63);
      }

      li.active a {
        color: #fff;
      }
    }
  }

  .margin-right {
    color: #fff;
    min-height: 300px;
    background-color: #1e253f;
  }
}
</style>
