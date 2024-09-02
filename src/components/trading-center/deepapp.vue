<template>
  <div>
    <h3 v-show="wan">累计单位（万）</h3>
    <e-charts
      style="height:300px;width:100%"
      :options="deptChartOption"
      @legendselectchanged="legendSelectChanged"
    ></e-charts>
  </div>
</template>

<script>
import $ from "jquery";
import { promiseBreaker } from "./../../../src/assets/tools";
import util from "./../../../src/util/util";
import ECharts from "vue-echarts/components/ECharts";
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legendScroll");

export default {
  components: { ECharts },
  data() {
    return {
      wan: false,
      deptChartOption: {},
      buy: [10, 9, 8, 5, 1],
      sell: ["", "", "", "", "", 0, 2, 3, 6, 8, 12, 13, 15],
      price: [],
      wid: 500,
      timer3: null,
      self_CLOSE: false,
      aaa: 0,
      count: 0,
      ws: null,
      connectReady: promiseBreaker(), // 将是可外部决议的promise
      from: 0,
      to: 0,
      period: util.toL(window.localStorage.getItem("klineTime") || "min5"),
      lockReconnect: false, //避免重复连接
      tt: null,
      priceMarkets: null
    };
  },
  props: ["priceMarket"],
  watch: {
    priceMarket(news) {
      function sortNumber(a, b) {
        return a - b;
      }
      // console.log(res)
      let buy = [];
      let sell = [];
      let price = [];
      let price1 = [];
      let kong = [];
      news.buy.forEach(ele => {
        buy.unshift(ele.total - 0);
        price.push(ele.price - 0);
        kong.push("");
      });
      price.sort(sortNumber);
      // console.log(price);  //小到大
      news.sell.forEach(ele => {
        sell.unshift(ele.total - 0);
        price1.push(ele.price - 0);
      });
      price1.sort(sortNumber);

      this.price = price.concat(price1);

      // console.log('sell')
      // console.log(sell)

      let ar1 = buy; // [1,2,4,7,11]

      let a1 = [];
      let count1 = 0;

      ar1.reverse();
      ar1.forEach(ele => {
        count1 += ele;
        a1.unshift(count1);
      });

      // console.log(a1)
      if (a1[0] >= 10000) {
        this.wan = true;
        let a11 = [];
        a1.forEach(ele => {
          a11.push(ele / 10000);
        });

        a1 = a11;
      } else {
        this.wan = false;
      }

      // console.log(a1)
      buy = a1;
      let ar2 = sell; // [1,2,4,7,11]
      let a2 = [];
      let count2 = 0;

      ar2.forEach(ele => {
        count2 += ele;
        a2.push(count2);
      });

      if (this.wan) {
        let a22 = [];
        a2.forEach(ele => {
          a22.push(ele / 10000);
        });
        a2 = a22;
        //  console.log(a2)
      }

      sell = a2;

      this.buy = buy;
      this.sell = kong.concat(sell);
      this.init();
    }
  },

  created() {},
  destroyed() {},
  methods: {
    handerParseName(time) {
      let name = this.util.getSession("pairsName");
      if (time != undefined) {
        return (
          name.split("/")[1].toLowerCase() +
          "/" +
          name.split("/")[0].toLowerCase() +
          "/" +
          time.toLowerCase()
        );
      } else {
        return (
          name.split("/")[1].toLowerCase() +
          "-" +
          name.split("/")[0].toLowerCase()
        );
      }
    },
    // 去重
    arrayUnique2(arr, name) {
      var hash = {};

      return arr.reduce(function(item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));

        return item;
      }, []);
    },

    init() {
      this.deptChartOption = {
        grid: { left: 20, top: 50, right: 40, bottom: 30 },
        tooltip: {
          confine: true,
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: { color: "#999", type: "dashed", opacity: 0.5 }
          },
          backgroundColor: "#355475",
          textStyle: { color: "#fff", fontSize: "14px" },
          extraCssText:
            "box-shadow: 0 0 16px 0 rgba(0, 0, 0, .2);border-radius: 4px;"
        },
        //          legend: {
        //            data: [
        //              {name: '买单', icon: 'rect'},
        //              {name: '卖单', icon: 'rect'}
        //            ],
        //            selected: {
        //              '买单': true,
        //              '卖单': true
        //            },
        //            itemWidth: 10,
        //            itemHeight: 10,
        //            textStyle: {color: '#fff'},
        //            pageIconColor: '#4CC453'
        //          },
        xAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#666"
            }
          },
          // axisTick: {show: false},
          // axisLabel: {show: false},
          boundaryGap: false,
          data: this.price
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#666"
              }
            },

            show: true,
            position: "right",

            axisTick: { show: true },
            axisLabel: { show: true },
            splitLine: { show: false }
          }
        ],
        series: [
          {
            // name: '买单',
            type: "line",
            smooth: true,
            symbol: "circle",
            showSymbol: false,
            // symbolSize: 3,
            sampling: "average",
            itemStyle: { normal: { color: "#4cc453" } },
            lineStyle: { normal: { color: "#243235" } },
            areaStyle: { color: "#243235" },
            data: this.buy
          },
          {
            // name: '卖单',
            type: "line",
            //              smooth: true,
            symbol: "circle",
            showSymbol: false,
            // symbolSize: 3,
            sampling: "average",
            itemStyle: { normal: { color: "#e94c4c" } },
            lineStyle: { normal: { color: "#392332" } },
            areaStyle: { color: "#392332" },
            data: this.sell
          }
        ]
      };
      this.deptChartOption.tooltip.formatter = this.deptChartHover;
    },
    legendSelectChanged(obj) {
      const selected = obj.selected;
      if (selected) {
        this.deptChartOption.legend.selected[obj.name] = selected[obj.name];
      }
    },
    deptChartHover(value) {
      let result = "";
      value.map(item => {
        if (item.value !== "") {
          result =
            "委托价：" +
            value[0].axisValue +
            "<br/>" +
            "累计：" +
            this.hanler(item.value);
        }
      });
      return result;
    },
    hanler(val) {
      if (this.wan) {
        return val.toFixed(2) - 0 + "W";
      } else {
        return val.toFixed(2) - 0;
      }
    }
  }
};
</script>

