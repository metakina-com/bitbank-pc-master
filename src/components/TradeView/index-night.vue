<template>
  <div>
    <div id="trade-view" style="height:100%"></div>
  </div>
</template>
<script>
// import { widget as TvWidget } from "/../../../public/tradeview/charting_library/charting_library.min.js";
// import { widget as TvWidget } from "../../../static/tradeview/charting_library/charting_library.min.js";
var TvWidget = window.TradingView.widget;
console.log(TvWidget)
import socket from "./datafeeds/socket.js";
import datafeeds from "./datafeeds/datafees.js";
import $ from "jquery";

export default {
  data() {
    return {
      widget: null,
      socket: new socket(),
      datafeeds: new datafeeds(this),
      symbol: null,
      interval: null,
      cacheData: {},
      lastTime: null,
      getBarTimer: null,
      isLoading: true,
      subBars: {} // 回调方法
    };
  },

  created() {
    this.socket.doOpen();
    this.socket.on("open", () => {
      this.socket.send("PING");
    });
    this.socket.on("message", this.onMessage);
  },
  mounted(){
  //  var x = '":["{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937806412,\"tradeType\":\"OPEN_UP\"}","{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937841786,\"tradeType\":\"OPEN_UP\"}","{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937842123,\"tradeType\":\"OPEN_UP\"}","{\"count\":20,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937881816,\"tradeType\":\"OPEN_DOWN\"}","{\"count\":20,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937883879,\"tradeType\":\"OPEN_DOWN\"}","{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937930462,\"tradeType\":\"OPEN_UP\"}","{\"count\":20,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937931059,\"tradeType\":\"OPEN_UP\"}","{\"count\":50,\"pairsName\":\"BTC/USDT\",\"price\":11,\"time\":1577937995203,\"tradeType\":\"OPEN_DOWN\"}","{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":12,\"time\":1577937995545,\"tradeType\":\"OPEN_DOWN\"}","{\"count\":9.999999,\"pairsName\":\"BTC/USDT\",\"price\":13,\"time\":1577945077150,\"tradeType\":\"OPEN_UP\"}","{\"count\":9.999999,\"pairsName\":\"BTC/USDT\",\"price\":14.999999,\"time\":1577945129686,\"tradeType\":\"OPEN_UP\"}","{\"count\":9.999999,\"pairsName\":\"BTC/USDT\",\"price\":14.999999,\"time\":1577945228239,\"tradeType\":\"OPEN_UP\"}"],"'

  //  x = x.split(':[')[1].split('],')[0].trim().substr(1);
  //  let x2 = '["'+ x.substr(0,x.length-1) + '"]'; 
  //  x2 = x2.replace(new RegExp('"{','g'),"'{").replace(new RegExp('}"','g'),"}'").replace("'[",'').replace("]'",'').trim();

       
       

  },
  methods: {
  
    init(symbol = "BTC/USDT", interval = 15) {
      this.interval = interval;
      this.symbol = symbol;
      if (!this.widget) {
        this.widget = new TvWidget({
          symbol: symbol,
          width: "100%",
          height: "100%",
          interval: interval,
          fullscreen: false,
          container_id: "trade-view",
          datafeed: this.datafeeds,
          // library_path: "/tradeview/charting_library/",
          library_path: "./tradeview/charting_library/",
          disabled_features: [
            "header_symbol_search",
            "go_to_date",
            "header_compare", //对比或叠加品种
            "timeframes_toolbar",
            "header_resolutions", //更换周期
            "header_undo_redo", //撤销重做按钮
            "show_hide_button_in_legend",
            "symbol_info",
            "volume_force_overlay",
            "items_favoriting",
            "header_layouttoggle",
            "symbol_search_hot_key",
            "control_bar",
            "save_chart_properties_to_local_storage",
            "display_market_status",
            "timeframes_toolbar",
            "use_localstorage_for_settings",
             "header_screenshot", //截屏left
            "header_indicators", //指标按钮
            "header_fullscreen_button", //全屏按钮
            "header_settings",
            "left_toolbar"  ,// 左侧工具栏
             "adaptive_logo", //移动端隐藏logo
         
            "header_widget_dom_node" //顶部工具栏
            
          ],
          enabled_features: [
            //on
           
            "hide_last_na_study_output",
            "use_localstorage_for_settings",
            "dont_show_boolean_study_arguments",
            "same_data_requery"
           
           
          ],
          timezone: "Asia/Shanghai",
          locale: "zh",
          debug: false,
          loading_screen: {
            backgroundColor: "#181b2a"
          },
          toolbar_bg: "#062853", //工具栏背景色
          overrides: {
            volumePaneSize: "small",
             "paneProperties.legendProperties.showLegend":false, // 隐藏MA值
            // "paneProperties.legendProperties.showStudyValues": true,
            "paneProperties.background": "#051933", // 图表背景色 黑夜
            // "paneProperties.background": "#e4e5e7", // 图表背景色 白天
            
            "paneProperties.vertGridProperties.color": "#1f2943",
            "paneProperties.horzGridProperties.color": "#1f2943",
            "paneProperties.crossHairProperties.color": "#989898",
            // "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor": "#ffffff",
            

            // 实心k
            "mainSeriesProperties.candleStyle.upColor": "#00bfa6",
            "mainSeriesProperties.candleStyle.downColor": "#e52e5f",
            "mainSeriesProperties.candleStyle.drawWick": true,
            "mainSeriesProperties.candleStyle.drawBorder": true,
            "mainSeriesProperties.candleStyle.borderColor": "#C400CB",
            // "mainSeriesProperties.candleStyle.borderUpColor": "rgb(0, 255, 0)",
            // "mainSeriesProperties.candleStyle.borderDownColor": "rgb(255, 0, 0)",
            "mainSeriesProperties.candleStyle.wickUpColor": "#589065",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ae4e54",
            // 空心k
            "mainSeriesProperties.hollowCandleStyle.upColor": "#00bfa6",
            "mainSeriesProperties.hollowCandleStyle.downColor": "#e52e5f",
            "mainSeriesProperties.hollowCandleStyle.drawWick": true,
            // "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
            // "mainSeriesProperties.hollowCandleStyle.borderColor": "#C400CB",
            // "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#589065",
            //'mainSeriesProperties.hollowCandleStyle.borderDownColor': '#ae4e54',
            "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#acaea4",
            "mainSeriesProperties.hollowCandleStyle.wickUpColor": "#589065",
            // 'mainSeriesProperties.hollowCandleStyle.wickDownColor': '#ae4e54',
            "mainSeriesProperties.hollowCandleStyle.wickDownColor": "#acaea4",
            "scalesProperties.lineColor": "#61688a",

            "paneProperties.legendProperties.showSeriesTitle": false // 取消symbolInfo
          },
          client_id: "tradingview.com",
          user_id: "public_user_id",
          custom_css_url: "./night.css"
        });
        
        // this.interval = interval;
       
        // this.symbol = symbol;
    
        console.log(this.widget);
        this.widget.onChartReady(() => {
          let chart = this.widget.activeChart();
          chart.createStudy("Moving Average", false, false, [5], null, {
            "Plot.color": "#965fc4",
            "Plot.linewidth": 1
          });
          chart.createStudy("Moving Average", false, false, [10], null, {
            "Plot.color": "#84aad5",
            "Plot.linewidth": 1
          });
          chart.createStudy("Moving Average", false, false, [30], null, {
            "Plot.color": "#55b263",
            "Plot.linewidth": 1
          });
          chart.createStudy("Moving Average", false, false, [60], null, {
            "Plot.color": "#b7248a",
            "Plot.linewidth": 1
          });
        //        chart.onIntervalChanged().subscribe(null, (interval, obj) => {
        //   localStorage.setItem("tradingview.interval", interval);
        // });

          let buttonArr = [
            {
              value: "1",
              period: "1m",
              text: "1min"
            },
            {
              value: "5",
              period: "5m",
              text: "5min"
            },
            {
              value: "15",
              period: "15m",
              text: "15min"
            },
            {
              value: "30",
              period: "30m",
              text: "30min"
            },
            {
              value: "60",
              period: "1h",
              text: "1hour"
            },
            {
              value: "D",
              period: "1D",
              text: "1day"
            },
            {
              value: "W",
              period: "1W",
              text: "1week"
            }
          ];
          let btn = {};
          let self = this;
          // 显示当前K线分辨率按钮
          buttonArr.forEach((v, i) => {
            btn = this.widget.createButton();
            btn[0].setAttribute("type", "button");
            btn[0].innerHTML = v.text;
            btn[0].addEventListener("click", function(e) {
              chart.setResolution(v.value);

              $(e.target)
                .addClass("select")
                .closest("div.space-single")
                .siblings("div.space-single")
                .find("div.button")
                .removeClass("select");
              setTimeout(() => {
                // window.location.reload()
              }, 300);
            });
            let klineTime = this.interval;
            if (v.value == klineTime) {
              console.log(btn);
              $(btn[0]).addClass("select");
            }
          });
        });
      }
    },
    sendMessage(data) {
      if (this.socket.checkOpen()) {
        this.socket.send(data);
      } else {
        this.socket.on("open", () => {
          this.socket.send(data);
        });
      }
    },
    // 改变时间和交易对
    setSymbol(symbol, interval) {
      this.symbol = symbol;
       console.log('改变时间和交易对')
       console.log(symbol,interval)
      this.widget.setSymbol(symbol, interval);
    }, 

    // 改变交易对
    // setName(symbol) {
    //   this.symbol = symbol;
    //   let interval = this.interval;

    //   console.log(interval);
    //   this.widget.setSymbol(symbol, interval);
    // }, 
    
    // 改变时间
    setTime(interval){
        this.widget.activeChart().setResolution(interval);
    },
    toClose1(){
      this.socket.toClose()
    },
    unSubscribe(interval) {
      // if (interval < 60) {
      //   this.sendMessage({ cmd: 'unsub', args: [`candle.M${interval}.${this.symbol.toLowerCase()}`, 1440, parseInt(Date.now() / 1000)] })
      // } else if (interval >= 60) {
      //   this.sendMessage({ cmd: 'unsub', args: [`candle.H${interval / 60}.${this.symbol.toLowerCase()}`, 1440, parseInt(Date.now() / 1000)] })
      // } else {
      //   this.sendMessage({ cmd: 'unsub', args: [`candle.D1.${this.symbol.toLowerCase()}`, 207, parseInt(Date.now() / 1000)] })
      // }
    },
    subscribe(resolution) {


  
      // if (resolution < 60) {
      //   console.log("min" + resolution + "k线");
      //   this.sendMessage({
      //     method: "getKline",
      //     param: "min" + resolution,
      //     market: this.symbol,
      //     startTime: 0 * 1000,
      //     endTime: 0 * 1000
      //   });
      // } else if (resolution == 60) {
      //    console.log("H1" + resolution + "k线");
      //   this.sendMessage({
      //     method: "getKline",
      //     param: "H1",
      //     market: this.symbol,
      //     startTime: 0 * 1000,
      //     endTime: 0 * 1000
      //   });
      // } else if (resolution == "D") {
      //    console.log("D1" + resolution + "k线");
      //   this.sendMessage({
      //     method: "getKline",
      //     param: "D1",
      //     market: this.symbol,
      //     startTime: 0 * 1000,
      //     endTime: 0 * 1000
      //   });
      // } else if (resolution == "W") {
      //    console.log("W1" + resolution + "k线");
      //   this.sendMessage({
      //     method: "getKline",
      //     param: "W1",
      //     market: this.symbol,
      //     startTime: 0 * 1000,
      //     endTime: 0 * 1000
      //   });
      // }
    },

    onMessage(data) {
      //  盘口数据
//  console.log(data)


       //历史数据
      if (data.data && data.data.length) {
        // console.log("请求来的init数据");
        // console.log(data);
        let list = [];
        let dataarray = data.data;
        const ticker = `${this.symbol}-${this.interval}`;
        list = dataarray.map(ele => ({
          time: ele.time - 0,
          open: ele.open - 0,
          close: ele.close - 0,
          high: ele.high - 0,
          low: ele.low - 0,
          volume: ele.volume - 0
        }));
        this.cacheData[ticker] = list;
        this.lastTime = list[list.length - 1].time;
        this.subscribe(this.interval);
      }else if (data.method == "getKline") {    // 更新数据
        console.log("请求来的实时K线数据");
        console.log(data);
        const ticker = `${this.symbol}-${this.interval}`;
        const barsData = {
          time: data.time - 0,
          open: data.open - 0,
          high: data.high - 0,
          low: data.low - 0,
          close: data.close - 0,
          volume: data.volume - 0
        };
        let newdatacallback = this.subBars; //回调新K线的方法
        newdatacallback.listener(barsData);
      }else{

        // console.log(data)
        // let data={
        //   openup:[
        //   ],
        //   opendown:[
        //   ]
        // }

        //   for (let i = 0; i < 10; i++) {

        //       let pr = i + (i*Math.random());
              
        //       data.openup.push({
        //         price: pr >30 ? i   :  pr ,
        //         num: (30-i + (30-(i * Math.random())))
        //       })

        //       // 根据价格从高到底，排序

        //        data.openup =  data.openup.sort(function(a,b){
        //         return  b.price - a.price;
        //       })

        //       data.opendown.push({
        //         price: i+30+ (i*Math.random()),
        //         num: i + (i * Math.random())
        //       })
        //   }


         this.$emit('pankouData',data)
      }

    },
    getBars(
      symbolInfo,
      resolution,
      rangeStartDate,
      rangeEndDate,
      onLoadedCallback
    ) {
   

      // if (this.interval !== resolution ) {  //周期不同 或者商品不同 可以请求
      if (true) {
        // this.unSubscribe(this.interval);
        this.interval = resolution;

        // 发送盘口指令
        this.sendMessage(`initMatch-${symbolInfo.name}`);
       
        if (resolution < 60) {
          // this.sendMessage({
          //   method: "initKline",
          //   param: "min" + resolution,
          //   market: symbolInfo.name,
          //   startTime: rangeStartDate * 1000,
          //   endTime: rangeEndDate * 1000
          // });
           window.localStorage.setItem('currentTime',resolution)
          this.sendMessage(`initKline-${symbolInfo.name}-${resolution}m-${rangeStartDate * 1000}-${rangeEndDate * 1000}`);

          //  _this.ws.send('initKline-BTC/USDT-1m-1577313180000-1577755149000')

        } else if (resolution == 60) {
          // this.sendMessage({
          //   method: "initKline",
          //   param: "H1",
          //   market: symbolInfo.name,
          //   startTime: rangeStartDate * 1000,
          //   endTime: rangeEndDate * 1000
          // });
           window.localStorage.setItem('currentTime','60')

          this.sendMessage(`initKline-${symbolInfo.name}-1h-${rangeStartDate * 1000}-${rangeEndDate * 1000}`);

        } else if (resolution == "D") {
          // this.sendMessage({
          //   method: "initKline",
          //   param: "D1",
          //   market: symbolInfo.name,
          //   startTime: rangeStartDate * 1000,
          //   endTime: rangeEndDate * 1000
          // });
           window.localStorage.setItem('currentTime','D')

          this.sendMessage(`initKline-${symbolInfo.name}-1d-${rangeStartDate * 1000}-${rangeEndDate * 1000}`);

        } else if (resolution == "W") {
           window.localStorage.setItem('currentTime','W')

          this.sendMessage(`initKline-${symbolInfo.name}-1w-${rangeStartDate * 1000}-${rangeEndDate * 1000}`);

          // this.sendMessage({
          //   method: "initKline",
          //   param: "W1",
          //   market: symbolInfo.name,
          //   startTime: rangeStartDate * 1000,
          //   endTime: rangeEndDate * 1000
          // });
        }
      }
      const ticker = `${this.symbol}-${this.interval}`;
      if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        this.isLoading = false;
        const newBars = [];

        this.cacheData[ticker].forEach(item => {
          if (
            item.time >= rangeStartDate * 1000 &&
            item.time <= rangeEndDate * 1000
          ) {
            newBars.push(item);
          }
        });

        onLoadedCallback(newBars);
      } else {
        const self = this;
        this.getBarTimer = setTimeout(function() {
          self.getBars(
            symbolInfo,
            resolution,
            rangeStartDate,
            rangeEndDate,
            onLoadedCallback
          );
        }, 10);
      }
    },
    // 订阅K线
    subscribeBars(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback
    ) {
      this.subBars = {
        listener: onRealtimeCallback,
        resolution: resolution,
        symbolInfo: symbolInfo
      };
    },
    //获取商品信息
    getSymbol() {
      let main = this.symbol.split("/")[1];
      return {
        name: this.symbol,
        ticker: this.symbol,
        description: this.symbol,
        pricescale: main == "BTC" || main == "ETH" ? 100000000 : 10000 // 价格刻度
      };
    }

  }
};
</script>
<style  scoped>

</style>

