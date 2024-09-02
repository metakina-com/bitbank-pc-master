<template>
  <div class="trading_center">
    <div class="bg_b min-hei400">
      <!-- K线图 -->
      <k-chart></k-chart>
      <deep></deep>
    </div>
  </div>
</template>

<script>
import kChart from "@/components/tradingview.vue";
import market from "@/components/trading-center/market.vue";
import pankou from "@/components/trading-center/pankou.vue";
import commission from "@/components/trading-center/commission.vue";
import announcement from "@/components/trading-center/announcement.vue";
import latest from "@/components/trading-center/latest-transaction.vue";
import commissionRecord from "@/components/trading-center/commission-record.vue";
import Banner from "@/components/banner";
import deep from "@/components/trading-center/deep.vue";

export default {
  components: {
    kChart,
    market,
    pankou,
    commission,
    announcement,
    deep,
    latest,
    commissionRecord,
    Banner
  },
  data() {
    return {
      websocket: null,
      timer: null,
      newNow: [],
      sell: [],
      buy: [],
      nowPrice: "",
      dui: "",
      pariseName: ""
    };
  },
  mounted() {
    let pa = this.$route.query.name;

    // let pa = this.util.getSession("pairsName");

    this.dui = pa.split("/")[1].toLowerCase() + pa.split("/")[0].toLowerCase();
    this.pariseName =
      pa.split("/")[1].toLowerCase() + "-" + pa.split("/")[0].toLowerCase();
    // //console.log(this.dui)
  },
  created() {
    //  this.websocketsend('uct/btc/MIN1')  ;

    // 换交易对
    let _this = this;
    // this.$hub.$on("pairsName", re => {
    //   // //console.log(re)
    //   let pa = re;
    //   _this.dui =
    //     pa.split("/")[1].toLowerCase() + pa.split("/")[0].toLowerCase();
    //   _this.pariseName =
    //     pa.split("/")[1].toLowerCase() + "-" + pa.split("/")[0].toLowerCase();
    //   _this.websocketsend(_this.dui);
    //   _this.websocketsend(_this.pariseName);
    // });
    //

    _this.$hub.$on("toPankouData", res => {
      _this.ToData(res);
    });

    let pa = this.$route.query.name;
    if (pa == null || pa == "" || pa == undefined) {
      this.util.setSession("pairsName", "BTC/USDT");
    } else {
      this.util.setSession("pairsName", pa);
    }

    setTimeout(() => {
      if (this.util.getSession("dd") == undefined) {
        this.util.setSession("dd", 1);
        window.location.reload();
      }
    }, 10);

    //页面刚进入时开启长连接
    // this.initWebSocket();
    // 心跳
    // this.timer = setInterval(() => {
    //   this.websocketsend("PING");
    // }, 10000);
  },
  destroyed: function() {
    sessionStorage.removeItem("dd"); //页面销毁时关闭长连接 关闭心跳
    // this.websocket.close();
    // clearInterval(this.timer);
  },
  methods: {
    initWebSocket() {
      const wsuri = "wss://api.ststoken.com/ws/asset"; //正式
      // const wsuri = "ws://172.20.20.170:7403/ws/asset"; //测试
      this.websocket = new WebSocket(wsuri);
      this.websocket.onopen = this.websocketonopen;
      this.websocket.onerror = this.websocketonerror;
      this.websocket.onmessage = this.websocketonmessage;
      this.websocket.onclose = this.websocketclose;
    },
    websocketonopen() {
      let _this = this;
      //console.log("WebSocket连接成功");
      _this.websocketsend(_this.dui);
      _this.websocketsend(_this.pariseName);
      //  _this.websocketsend('uct/btc/MIN1')  ;
    },
    websocketonerror(e) {
      //错误
      //console.log("WebSocket连接发生错误");
    },
    websocketonmessage(e) {
      let _this = this;
      let blob = e.data;

      let newblob = blob.slice(0, blob.size);
      //js中的blob没有没有直接读出其数据的方法，通过FileReader来读取相关数据
      let reader = new FileReader();
      reader.readAsBinaryString(newblob);
      let imgFlag;
      reader.onload = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
          let res = JSON.parse(evt.target.result);
          console.log(res);
          _this.ToData(res);
        }
      };
    },

    ToData(redata) {
      console.log(redata);
      // this.$hub.$emit("toTradingView", redata);

      // 排序 buy
      redata.buy.sort(function(a, b) {
        return Number(b.price) > Number(a.price) ? 1 : -1;
      });

      // 排序 sell
      redata.sell.sort(function(a, b) {
        return Number(b.price) > Number(a.price) ? 1 : -1;
      });

      let buy = redata.buy.slice(0, 10); //截取10条
      buy.forEach((ele, index) => {
        ele.code = index + 1;
      });
      this.buy = buy;

      let len = null;
      if (redata.sell.length >= 10) {
        len = redata.sell.length - 10;
      } else {
        len = 0;
      }
      let sell = redata.sell.slice(len, redata.sell.length); //截取10条
      let len3 = sell.length;

      sell.forEach((ele, index) => {
        ele.code = len3 - index;
      });

      this.sell = sell;

      this.newNow = redata.dealList;
      this.nowPrice = redata.nowPrice;

      this.$hub.$emit("nowPriceToJiaoyi", redata.nowPrice);

      this.$hub.$emit("keepData", redata);
      let priceMarket = {
        buy: redata.nowPrice,
        sell: redata.nowPrice
      };
      if (buy.length > 0) {
        priceMarket.buy = buy[0].price;
      }
      if (sell.length > 0) {
        priceMarket.sell = sell[sell.length - 1].price;
      }

      this.$hub.$emit("marketPriceNow", priceMarket);
    },

    websocketsend(agentData) {
      //数据发送
      this.websocket.send(agentData);
    },

    websocketclose(e) {
      //关闭
      //console.log("connection closed (" + e.code + ")");
    }
  }
};
</script>
<style lang="scss" scoped >
#app {
  min-width: 0;
}
.trading_center {
  $bg_block: #051933; //每一块背景色
  .bg_b {
    background: $bg_block;
  }
  .cen {
    color: #fff; //字体颜色
    background: #051325; //间隙背景色
    min-height: 400px;
  }
}
</style>
