<template>
  <div style="position: relative">
    <!-- banner -->
    <el-carousel :autoplay="true" :loop="true" :interval="3000" style="
        overflow: initial;
        min-height: 100%;
        height: 95vh;
        position: relative;
      " @change="swiperChange" @mouseenter.native="delHandleMouseEnter" ref="carousel" arrow="never">
      <el-carousel-item v-for="(val, index) in bannerList" :key="index" style="height: 95vh">
        <img :class="inAnimation ? 'Anim' : ''" :src="val.bannerUrl"
          style="width: 100%; min-height: 95vh; object-fit: cover" @load="imgLoad" />
        <div class="swiper_bot">
          <div style="width: 1100px; margin: 0 auto; color: #fff">
            <!-- <div class="mar-b-15 size20 bold">{{ val.title }}</div>
            <div class="mar-b-15 bold" style="font-size: 50px">
              {{ val.content }}
            </div> -->
            <div>
              <!-- <el-button type="primary" style="background: #125bff; width: 150px; height: 50px">{{ val.btnText }}
              </el-button> -->
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- 一键购币 -->
    <!-- <div class="pur-back">
      <div class="pur-content">
        <div class="pur-text">
          <div class="pur-title">{{ $t('message.buy_now') }}</div>
          <div class="pur-reference">{{ $t('message.negotiable') }} {{ newPriceByPairo }} CNY / USDT</div>
        </div>
        <div class="pur-input">
          <el-input
            class="elInput"
            size="medium"
            v-model="inputNum"
            style="width: 304px;font-weight: bold;"
            :placeholder="$t('message.low') + '100USDT'"
          >
            <template slot="append">
              <img class="el_img" src="../assets/images/banner-text-usdt.png" />
              <span class="el_span">USDT</span>
            </template>
          </el-input>
          <el-button
            class="pur_button"
            type="primary"
            size="medium"
            @click="hopRoute"
          >{{$t('message.keyCurrency')}}</el-button>
        </div>
      </div>
    </div> -->

    <div v-if="false" class="coin_card hei120 flex">
      <div class="item" v-if="i < 7" v-for="(item, i) in indexCoin" :key="i" @click="switchCoinName(item)">
        <div>
          <div class="flex bet">
            <strong class="coin_name">{{ item.pairsName }}</strong>
            <div v-if="item.updown >= 0" class="size16 green">
              +{{ (item.updown * 100) | SubStringZreo(2) }}%
            </div>
            <div v-else class="size16 red">
              {{ (item.updown * 100) | SubStringZreo(2) }}%
            </div>
          </div>

          <div class="pad-t-8">
            <span class="size20 linehei20 price bold">{{
                item.price | SubStringZreo(2)
            }}</span>
            <em class="size12 CNY bold">
              ≈ {{ item.chPrice | SubStringZreo(2) }}CNY</em>
          </div>
          <div class="pad-t-8">
            <span class="size12 bold vol">24H量 {{ parseInt(item.volume - 0).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card_box hei110" style="
        background: #125bff;
        display: flex;
        justify-content: center;
        align-items: center;
      ">
      <div class="flex" style="
          width: 1100px;
          justify-content: space-around;
          align-items: center;
        ">
        <div class="bold" style="color: #fff">{{ i18n.home1 }}</div>
        <div class="flex">
          <div class="hei60 flex mar-r-10" style="
              border: 1px solid rgb(150, 169, 176);
              min-width: 330px;
              font-size: 16px;
              color: rgb(245, 249, 250);
              border-radius: 5px;
              align-items: center;
            ">
            <el-input :placeholder="i18n.home2" style="background: rgba(0, 0, 0, 0)"></el-input>
          </div>
          <el-button style="min-width: 120px">{{ i18n.home3 }}</el-button>
        </div>
      </div>
    </div>

    <div class="wrap">
      <div class="list_item">
        <img src="../../src/assets/img/home/list1.png" class="list_img" alt="" />
        <div class="pad-15">
          <div class="mar-b-15 bold" style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- BitBANK 手机版更新 -->
            {{ i18n.homeTop1 }}
          </div>
          <div style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- 您现在可以在随时随地交易期货、永续合约、现货对以及更多。 -->
            {{ i18n.homeTop2 }}
          </div>
        </div>
      </div>
      <div class="list_item">
        <img src="../../src/assets/img/home/list2.png" class="list_img" alt="" />
        <div class="pad-15">
          <div class="mar-b-15 bold" style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- 新的永续 合约挂牌 -->
            {{ i18n.homeTop3 }}
          </div>
          <div style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- Galaxy 项目、Tron 和其他 ApeCoin 的上架 -->
            {{ i18n.homeTop4 }}
          </div>
        </div>
      </div>
      <div class="list_item">
        <img src="../../src/assets/img/home/list3.png" class="list_img" alt="" />
        <div class="pad-15">
          <div class="mar-b-15 bold" style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- 传染报告 -->
            {{ i18n.homeTop5 }}
          </div>
          <div style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- 熊市是为了建设，也是为了汲取教训。 -->
            {{ i18n.homeTop6 }}
          </div>
        </div>
      </div>
      <div class="list_item">
        <img src="../../src/assets/img/home/list4.png" class="list_img" alt="" />
        <div class="pad-15">
          <div class="mar-b-15 bold" style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- 现已上线：XBTN22 期货合约 -->
            {{ i18n.homeTop7 }}
          </div>
          <div style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- 我们刚刚上架了我们新的月度比特币期货合约。 -->
            {{ i18n.homeTop8 }}
          </div>
        </div>
      </div>
      <div class="list_item">
        <img src="../../src/assets/img/home/list5.png" class="list_img" alt="" />
        <div class="pad-15">
          <div class="mar-b-15 bold" style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- ETH 保证金 合约 -->
            {{ i18n.homeTop9 }}
          </div>
          <div style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- 一套以 ETH 为保证金和结算的新合约 -->
            {{ i18n.homeTop10 }}
          </div>
        </div>
      </div>
      <div class="list_item">
        <img src="../../src/assets/img/home/list6.png" class="list_img" alt="" />
        <div class="pad-15">
          <div class="mar-b-15 bold" style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- BMEX 代币公告 -->
            {{ i18n.homeTop11 }}
          </div>
          <div style="color: #fff; font-size: 14px; font-weight: 600">
            <!-- 致我们尊敬的 BitBANK 交易员社区 – 我们已决定推迟 BMEX 代币在我们的现货交易所上架。 -->
            {{ i18n.homeTop12 }}
          </div>
        </div>
      </div>
    </div>

    <div class="" style="display: flex; justify-content: center; align-items: center">
      <div style="
          background: rgb(18, 91, 255);
          width: 1100px;
          height: 450px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
        <div class="pad-30" style="
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
          ">
          <h2>{{ i18n.homeTip1 }}</h2>
          <div class="mar-t-15 mar-b-15" style="max-width: 400px">
            {{ i18n.homeTip2 }}
          </div>
          <div>
            <div style="
                border: 1px solid white;
                min-width: 120px;
                height: 47px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
              ">
              {{ i18n.homeTip4 }}
            </div>
          </div>
        </div>
        <div class="" style="height: 360px; border-right: 3px solid #fff"></div>
        <div class="flex" style="
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 500px;
          ">
          <h1 style="font-size: 156px">0</h1>
          <div class="mar-l-15 mar-r-15 size18 bold" style="width: 160px">
            {{ i18n.homeTip3 }}
          </div>
          <img src="../../src/assets/img/home/anquan.png" style="width: 270px; height: 345px" alt="" />
        </div>
      </div>
    </div>

    <!-- 公告 -->
    <!-- <div class="banner-announce">
      <div class="banner-announce-title">
        <img src="../assets/images/icon_notic.png" alt />
        <span>{{ $t('message.banner_announce_title') }}</span>
      </div>

      <div class="banner-announce-more">
        <router-link to="/article/gfgg">{{ $t('message.more') }}</router-link>
      </div>
    </div> -->

    <!-- <div class="notice_index">
      <div class="auto_center">
        <ul>
          <li v-for="(val, index) in noticList" :key="index" v-show="index<6">
            <a @click="jumpInfo(val.id)">{{ val.title }}</a>
            <div class="bor_li" v-show="index<5">/</div>
          </li>
        </ul>
      </div>
    </div> -->

    <!-- <div class="quote flex">
      <div class="item size16 pad-l-r-20 pad-t-b-10" v-for="(item,i) in coinDta" :key="i">
        <div class="flex_bet">
          <div class="c_fff bold hei30 line30">{{item.cur}}</div>
          <div
            v-if="item.updown>=0"
            class="c_fff btn_green"
          >+{{item.updown*100 | SubStringZreo(2)}}%</div>
          <div v-else class="c_fff btn_red">{{item.updown*100 | SubStringZreo(2)}}%</div>
        </div>

        <div class="flex_bet mar-t-40">
          <div
            class="bold hei30 line30 size22"
            :class="item.updown>=0?'green':'red'"
          >{{item.nowPrice | SubStringZreo(4)}}</div>
          <div class="c_fff size16 tr flex align-center">￥ {{item.chPrice | SubStringZreo(4)}}</div>
        </div>
      </div>
    </div> -->

    <div v-if="false">
      <div class="v_center adver">
        <div class="adv_title">
          BitBANK，近24小时成交量{{ vol24.toLocaleString() }}美元
        </div>
        <div class="adv_sub_title">
          为全球超过3个国家的百万用户提供安全，可信赖的数字资产交易及资产管理服务
        </div>
        <div class="ad_list">
          <div class="ad_item">
            <img src="./../assets/img/home/ad2.png" alt="" />
            <div class="ad_tt1">交易量全球前100</div>
            <div class="ad_tt2">强大的流动性 交易种类齐全</div>
          </div>
          <div class="ad_item">
            <img src="./../assets/img/home/ad1.png" alt="" />
            <div class="ad_tt1">1年创新交易所</div>
            <div class="ad_tt2">创新币交易更加灵活</div>
          </div>
          <div class="ad_item">
            <img src="./../assets/img/home/ad3.png" alt="" />
            <div class="ad_tt1">百万用户首选</div>
            <div class="ad_tt2">建立先行赔付机制 设立投资者保护基金</div>
          </div>
        </div>
      </div>
    </div>
    <div class="download_app" style="height: 330px">
      <div class="" style="width: 360px; margin: 100px auto; font-size: 20px; color: #fff">
        <div class="flex mar-b-15" style="justify-content: center; width: 100%">
          {{ i18n.homeTip5 }}
        </div>

        <div class="flex mar-b-30" style="justify-content: center; text-align: center">
          {{ i18n.homeTip6 }}
        </div>
        <div class="flex " style="align-items: center">
          <div class="ios" style="position: relative;">
            <img style="height: 42px;border-radius: 5px;" src="../../src/assets/img/home/apple.png" alt="" />
            <div class="ios_qr">
              <img class="wid150 hei150" src="./../assets/img/home/lzzg_app_download.png" alt="">
              <div class="c666 size12 v_center bold pad-t-5 bold">IOS</div>
            </div>
          </div>
          <div class="mar-l-15 android" style="position: relative;">
            <img style="height: 40px" src="../../src/assets/img/home/google.png" alt="" />
            <div class="android_qr">
              <img class="wid150 hei150" src="./../assets/img/home/lzzg_app_download_anzhuo.png" alt="">
              <div class="c666 size12 v_center bold pad-t-5 bold">Andoird</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="app_load" v-if="false">
      <div class="v_center">
        <div class="size30 bold c666 pad-t-120">随时随地 多平台终端交易</div>
        <div class="mar-t-20 mar-b-60 size16 c999">
          覆盖IOS、Android、PC多个平台，支持全企业功能
        </div>
      </div>
      <div class="auto_center flex bet">
        <div class="qr">
          <img class="wid150 hei150" src="./../assets/img/home/lzzg_app_download.png" alt="" />
          <div class="c666 size12 v_center bold pad-t-5 bold">IOS 扫码下载</div>
        </div>
        <div class="qr">
          <img class="wid150 hei150" src="./../assets/img/home/lzzg_app_download_anzhuo.png" alt="" />
          <div class="c666 size12 v_center bold pad-t-5 bold">
            Andoird 扫码下载
          </div>
        </div>
        <div class="kline_img">
          <img src="./../assets/img/home/kline1.jpg" alt="" />
        </div>
      </div>
    </div>

    <div class="reg_index" v-if="false">
      <div class="c333 size30 bold">注册BitBANK账号 开启数字货币之旅</div>
      <div class="mar-t-40 flex acc_in">
        <el-input class="bold" style="width: 480px; font-size: 16px; min-width: 120px" v-model="account"
          placeholder="请输入你的手机号或邮箱"></el-input>
        <el-button @click="toView('/register')" class="mar-l-10" style="
            height: 48px;
            color: #fff;
            font-size: 18px;
            min-width: 120px;
            background-color: #357ce1;
          " type="primary">注册</el-button>
      </div>
    </div>
    <div class="layout_content" v-show="false">
      <div class="tab-box" :style="
        pairsList.length > 6
          ? 'border-bottom: none;'
          : 'border-bottom: 1px solid #c8defb;'
      ">
        <div class="tab_box_t"></div>
        <div class="tab_box_b">
          <ul>
            <li class="tab_box_b_t">
              <p>{{ $t("message.pair") }}</p>
              <p style="width: 20%">{{ $t("message.price") }}</p>
              <p>24H {{ $t("message.change") }}</p>
              <p>24H {{ $t("message.high") }}</p>
              <p>24H {{ $t("message.low") }}</p>
              <p style="width: 10%">24H {{ $t("message.vol") }}</p>
            </li>
            <li v-for="(val, index) in coinPairList" style="cursor: pointer" :key="index" @click="jumpBB(val, val)">
              <p>
                <em :class="
                  val.iconSelected ? 'el-icon-star-on' : 'el-icon-star-off'
                " @click.stop="icon_click(val, index)"></em>
                {{ val.pairsName }}
              </p>
              <p style="width: 20%">
                {{ val.price }}
                <span style="
                    color: rgb(112, 166, 226);
                    font-size: 12px;
                    margin-left: 6px;
                  ">/ ￥{{ Number(val.chPrice).toFixed(2) }}</span>
              </p>
              <p :style="
                val.updown * 100 > 0 ? 'color:#00c39b' : 'color:#ff4767'
              ">
                {{ Number(val.updown * 100).toFixed(2) }}%
              </p>
              <p>{{ val.higPrice }}</p>
              <p>{{ val.lowPrice }}</p>
              <p style="width: 10%">{{ Number(val.volume).toFixed(2) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "index",
  data() {
    return {
      account: "",
      vol24: parseInt(new Date().getTime() / 40000),
      setTimer: null,
      coinDta: [],
      cdat: [],
      bannerList: [
        {
          bannerUrl: require("./../assets/img/banner/1.png"),
          title: "this.i18n.news1",
          content: "this.i18n.news2",
          btnText: "this.i18n.news3",
        },
        {
          bannerUrl: require("./../assets/img/banner/2.png"),
          title: "this.i18n.news4",
          content: "this.i18n.news5",
          btnText: "this.i18n.news6",
        },
        {
          bannerUrl: require("./../assets/img/banner/3.png"),
          title: "this.i18n.news7",
          content: "this.i18n.news8",
          btnText: "this.i18n.news9",
        },
        {
          bannerUrl: require("./../assets/img/banner/4.png"),
          title: "this.i18n.news1",
          content: "this.i18n.news1",
          btnText: "this.i18n.news1",
        },
      ],
      bannerHeight: 100,
      inputNum: "",
      newPriceByPairo: 0,
      noticList: [],
      coinPairList: [],
      pairsList: [],
      coinPairTab: 0,
      indexCoin: [],
      inAnimation: false,
    };
  },
  beforeDestroy() {
    clearTimeout(this.setTimer);
  },
  watch: {
    i18n(val) {
      
    },
  },
  mounted() {
    this.init();
    // console.log(this.i18n.news1);
    this.getBanner();
    this.getNewPriceCny();
    this.getCoinDetail();
    this.getPairsByMainCur();
    
  },
  methods: {
    ...mapActions(["setPairsName", "setPairsName1", "setContractMulId"]),
    //获取交易对列表
    getPairsByMainCur() {
      this.$get("data/data/getIndexCoin", {
        // mainCur: "USDT",
        member: this.$store.state.userId ? this.$store.state.userId : "",
        getCoinType: "UPDOWN",
      }).then((res) => {
        // console.log("indexCoin");
        if (res && res.status == "SUCCEED" && res.result) {
          // console.log(res.result, "////");
          this.indexCoin = res.result;

          setTimeout(() => {
            this.getPairsByMainCur();
          }, 5000);
        }
      });
    },
    swiperChange() {
      console.log("/swiperChangeswiperChange");
      this.inAnimation = true;
      setTimeout(() => {
        this.inAnimation = false;
      }, 2990);
    },
    delHandleMouseEnter() {
      this.$refs.carousel.handleMouseEnter = () => { };
    },
    switchCoinName(item) {
      // console.log(item)
      this.setPairsName(item.cur);
      // this.setContractMulId(id);
      setTimeout(() => {
        this.$router.push({
          path: "/market",
        });
      }, 10);
    },
    getCoinDetail() {
      let coinlist = [
        "BTC/USDT",
        "ETC/USDT",
        "ETH/USDT",
        "EOS/USDT",
        "LTC/USDT",
        "ADA/USDT",
      ];
      coinlist.forEach((ele) => {
        this.getCoinInfo(ele);
      });

      this.setTimer = setTimeout(() => {
        this.cdat = [];
        this.getCoinDetail();
      }, 5000);
    },
    jumpInfo(id) {
      this.$router.push({
        path: "/noticeDetail",
        query: {
          id,
        },
      });
    },
    // 公告列表  banner图
    init() {
      let typeKey = "gfgg";
      let size = 3;
      Promise.all([
        this.$get("/data/data/getBanners"),
        this.$get("/data/data/getNotices/", {
          noticeType: "OFFICIAL",
          global: "CHINESE_SIM",
        }),
        this.$get("/data/data/getPairsByMainCur", {
          mainCur: "usdt",
          type: "SPOT",
        }),
      ]).then((res) => {
        // console.log(res);
        // this.bannerList = res[0].result;
        if (res[1].result.length > 0) {
          this.noticList = res[1].result;
        }
        this.coinPairList = res[2].result;
      });
    },

    getCoinInfo(pairsName) {
      this.$get("/data/data/getCoinInfo", {
        pairsName,
      }).then((res) => {
        if (res.status == "SUCCEED") {
          let data = JSON.parse(res.result);
          // data.cur = pairsName;
          // this.cdat.push(data);
          // if (this.cdat.length >= 6) {
          //   this.cdat.sort((a, b) => b.nowPrice - a.nowPrice);
          //   this.coinDta = this.cdat;
          // }
        }
      });
    },
    // 初始化页面
    getBanner() {
      let data = {
        bannerType: "PC_BANNER", //DATA_BANNER主页,WEL_BANNER邀请返佣,PROJECT_BANNER项目方
        global: "CHINESE_SIM",
      };
      //获取轮播图
      this.$get("data/data/getBanners", data).then((res) => {
        if (res && res.status == "SUCCEED") {
          // this.bannerList = res.result || [];
          this.bannerList[0].title = this.i18n.news1;
          this.bannerList[0].content = this.i18n.news2;
          this.bannerList[0].btnText = this.i18n.news3;
          this.bannerList[1].title = this.i18n.news4;
          this.bannerList[1].content = this.i18n.news5;
          this.bannerList[1].btnText = this.i18n.news6;
          this.bannerList[2].title = this.i18n.news7;
          this.bannerList[2].content = this.i18n.news8;
          this.bannerList[2].btnText = this.i18n.news9;
          this.bannerList[3].title = this.i18n.news10;
          this.bannerList[3].content = this.i18n.news11;
          this.bannerList[3].btnText = this.i18n.news12;
        }
      });
    },
    // 获取图片高度
    imgLoad() {
      // console.log('获取图片高度')
      // this.$nextTick(() => {
      //   if (this.$refs.bannerHeight == undefined) {
      //     return;
      //   }
      //   this.bannerHeight = this.$refs.bannerHeight[0].height;
      // });
    },
    //一键购币
    hopRoute() {
      this.$router.push({
        name: "ShopUsdt",
        query: this.inputNum,
      });
    },
    //刷新交易对
    jumpBB(val1, val2) {
      this.$router.push({
        name: `market`,
        query: {
          symbol: val1 + "_" + val2,
        },
      });
    },
    getNewPriceCny(coin, num) {
      this.$get("/data/data/getCoinInfo?pairsName=USDT").then((res) => {
        this.newPriceByPairo = JSON.parse(res.result).high;
      });
    },
  },
  computed: {
    i18n() {
      return this.$t("message");
    },
    // bannerList() {
    //   return [{
    //       bannerUrl: require("../assets/images/banner-bg1.png")
    //     },
    //     {
    //       bannerUrl: require("../assets/images/banner-bg1.png")
    //     },
    //     {
    //       bannerUrl: require("../assets/images/banner-bg1.png")
    //     }
    //   ]
    // }
  },
};
</script>

<style lang="less" src="./less/index.less" scoped>
</style>
<style>
.el-input--medium .el-input__inner {
  height: 48px !important;
  line-height: 48px;
  width: 280px;
}
</style>
<style lang="scss">
.el-input__inner {
  background: rgba(0, 0, 0, 0);
  border: 0;
}

.swiper_bot {
  height: 300px;
  // background: red;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
}

.wrap {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  width: 1100px;
  margin: 30px auto;
}

.Anim {
  animation: showMsg 3s;
}

@keyframes showMsg {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.2);
  }
}

.list_item {
  background: rgb(25, 35, 50);
  border-radius: 10px;
  min-width: 330px;
  width: 330px;
  margin-bottom: 15px;
  overflow: hidden;

  img {
    width: 100%;
  }
}

.list_item:hover img {
  transform: scale(1.1);
  transition: all 0.5s;
}

.download_app {
  .ios_qr {
    position: absolute;
    top: -180px;
    left: 10px;
    display: none;
  }

  .android_qr {
    position: absolute;
    top: -180px;
    display: none;
  }

  .android:hover .android_qr {
    display: block;

  }

  .ios:hover .ios_qr {
    display: block;
  }
}

.coin_card {
  background: #000923;
  color: #fff;
  padding: 0 10px;

  .item {
    width: 16.6666%;
    border-right: 1px solid hsla(0, 0%, 100%, 0.15);
    padding: 18px 24px;
    cursor: pointer;

    &:hover {
      background: hsla(0, 0%, 100%, 0.15);
      border-right: none;
    }

    .coin_name,
    .CNY {
      color: #b0b8db;
    }

    .price {
      color: #d2d6ec;
    }

    .vol {
      color: #61698a;
    }
  }

  .item:last-of-type {
    border: none;
  }
}

.notice_index {
  height: 52px;
  background: #f6f9fc;
  line-height: 52px;

  ul {
    width: 100%;
    display: flex;

    li {
      width: 16.6666%;
      overflow: hidden;
      height: 52px;
      padding: 0 10px;
      text-align: center;
      position: relative;
      transition: all 0.2s;
      cursor: pointer;

      a {
        color: #1c242c;

        &:hover {
          color: #357ce1;
        }
      }

      .bor_li {
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0;
        z-index: 10;
        color: #1c242c;
      }
    }
  }
}

.adver {
  min-height: 500px;
  padding: 120px 0 85px;
  width: 70%;
  margin: 0 auto;

  .adv_title {
    font-size: 30px;
    color: #192544;
    margin-bottom: 20px;
    font-weight: 500;
  }

  .adv_sub_title {
    color: #495666;
    font-size: 16px;
    font-weight: 500;
  }

  .ad_list {
    padding-top: 70px;
    display: flex;
    justify-content: space-around;

    .ad_item {
      img {
        width: 60px;
        height: 56px;
      }

      .ad_tt1 {
        padding: 15px 0 10px;
        font-weight: 400;
        font-size: 18px;
        color: #1c242c;
      }

      .ad_tt2 {
        font-size: 14px;
        line-height: 28px;
        color: #54748f;
      }
    }
  }
}

.app_load {
  background: url("./../assets/img/home/bg_loadapp.png") no-repeat center center;
  // background: chartreuse;
  background-size: 100% 1130px;
  height: 860px;

  .qr {
    padding: 200px 0 0 20px;
    border: 1px solid red;

    img {
      outline: 1px solid #e1e1e1;
    }
  }

  .kline_img {
    padding-right: 20px;

    img {
      width: 800px;
      height: 444px;
    }
  }
}

.reg_index {
  height: 300px;
  border-top: 1px solid #fcfcfc;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .acc_in {
    .el-input__inner {
      height: 48px;
    }
  }
}
</style>
