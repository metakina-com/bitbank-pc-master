<template>
  <div style="width:100%;height:100%">
   
    <div id="trade-view" style="height:100%;width:100%"></div>
  </div>
</template>
<script>
// import { widget as TvWidget } from "/../../../public/tradeview/charting_library/charting_library.min.js";
// import { widget as TvWidget } from "../../../static/tradeview/charting_library/charting_library.min.js";
var TvWidget = window.TradingView.widget;

import socket from "./datafeeds/socket.js";
import datafeeds from "./datafeeds/datafees.js";
import $ from "jquery";

export default {
  props:['type'],
  data() {
    return {
      interTime:400,
      currentClose:'',
      widget: null,
      socket: new socket(),
      datafeeds: new datafeeds(this),
      symbol: null,
      interval: null,
      cacheData: {},
      lastTime: null,
      getBarTimer: null,
      isLoading: true,
      subBars: {}, // 回调方法

      testDta: {
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0
      }
    };
  },
  computed:{
     currentPrice(){
      return this.$store.state.currentPrice
    }
  },
  watch:{
     currentPrice(val){
      // console.log(val)
       this.testDta.close = val.nowPrice;

    },
  },


  created() {
    this.socket.doOpen();
    this.socket.on("open", () => {
      this.socket.send("PING");
    });
    this.socket.on("message", this.onMessage);
    
    // this.$hub.$on('currentPrice',res=>{
    //     this.testDta.close = res;
    // })
    

    //  测试

    // setInterval(()=>{
    //    this.testDta = {
    //       open: (Math.random()*100 + 80) - 0,
    //       high: (Math.random()*100 + 80) - 0,
    //       low: (Math.random()*100 + 80) - 0,
    //       close: (Math.random()*100 + 80) - 0,
    //       volume: (Math.random()*1000 + 80) - 0,
    //    }
    // },1000)
  },
  mounted() {
    //  var x = '":["{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937806412,\"tradeType\":\"OPEN_UP\"}","{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937841786,\"tradeType\":\"OPEN_UP\"}","{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937842123,\"tradeType\":\"OPEN_UP\"}","{\"count\":20,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937881816,\"tradeType\":\"OPEN_DOWN\"}","{\"count\":20,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937883879,\"tradeType\":\"OPEN_DOWN\"}","{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937930462,\"tradeType\":\"OPEN_UP\"}","{\"count\":20,\"pairsName\":\"BTC/USDT\",\"price\":10,\"time\":1577937931059,\"tradeType\":\"OPEN_UP\"}","{\"count\":50,\"pairsName\":\"BTC/USDT\",\"price\":11,\"time\":1577937995203,\"tradeType\":\"OPEN_DOWN\"}","{\"count\":10,\"pairsName\":\"BTC/USDT\",\"price\":12,\"time\":1577937995545,\"tradeType\":\"OPEN_DOWN\"}","{\"count\":9.999999,\"pairsName\":\"BTC/USDT\",\"price\":13,\"time\":1577945077150,\"tradeType\":\"OPEN_UP\"}","{\"count\":9.999999,\"pairsName\":\"BTC/USDT\",\"price\":14.999999,\"time\":1577945129686,\"tradeType\":\"OPEN_UP\"}","{\"count\":9.999999,\"pairsName\":\"BTC/USDT\",\"price\":14.999999,\"time\":1577945228239,\"tradeType\":\"OPEN_UP\"}"],"'
    //  x = x.split(':[')[1].split('],')[0].trim().substr(1);
    //  let x2 = '["'+ x.substr(0,x.length-1) + '"]';
    //  x2 = x2.replace(new RegExp('"{','g'),"'{").replace(new RegExp('}"','g'),"}'").replace("'[",'').replace("]'",'').trim();
  },
  methods: {
   
    init(symbol = "BTC/USDT", interval = 1) {
      this.interval = interval;
      this.symbol = symbol;
      if (!this.widget) {



        // this.widget = new TradingView.widget({
        //   symbol: symbol,
        //   interval: interval,
        //   // fullscreen: true,
        //   preset: "mobile",
        //   container_id: "trade-view",
        //   theme: "Dark" ,
        //   autosize: true,
        //   datafeed: this.datafeeds,
        //   library_path: "./tradeview/charting_library/",
        //   disabled_features: [
        //     "header_symbol_search",
        //     "use_localstorage_for_settings",
        //     "left_toolbar",
        //     "control_bar",

        //     "legend_context_menu",
        //     "border_around_the_chart",
        //     "timeframes_toolbar",
        //     "header_widget_dom_node",

        //     "header_undo_redo",
        //     "header_screenshot",
        //     "header_resolutions",
        //     "header_interval_dialog_button",

        //     "header_settings",
        //     "header_indicators",
        //     "edit_buttons_in_legend",
        //     "header_fullscreen_button",

        //     "property_pages",
        //     "display_market_status",
        //     "go_to_date",
        //     "create_volume_indicator_by_default"
        //   ],
        //   enabled_features: [],
        //   timezone: "Asia/Shanghai",
        //   locale: "zh",
        //   debug: false,
        //   customFormatters: {
        //     dateFormatter: {
        //       format: function(date) {
        //         return (
        //           date.getUTCFullYear() +
        //           "-" +
        //           (date.getUTCMonth() + 1) +
        //           "-" +
        //           date.getUTCDate()
        //         );
        //       }
        //     }
        //   },
        //   overrides: {
        //     // 'mainSeriesProperties.style': 2,
        //     // 'mainSeriesProperties.lineStyle.color': "rgba(0,125,254,.6),"
        //     "mainSeriesProperties.areaStyle.color1": "rgba(2, 123, 255, .1)",
        //     "mainSeriesProperties.areaStyle.color2": "rgba(2, 123, 255, .1)",
        //     "mainSeriesProperties.areaStyle.linecolor": "rgba(2, 123, 255, .5)"
        //   }
        // });




        this.widget = new TvWidget({
          symbol: symbol,
          width: "100%",
          height: "100%",
          interval: interval,
          fullscreen: false,
          container_id: "trade-view",
           theme: "Dark" ,
          datafeed: this.datafeeds,
          library_path: "/static/chartTool/",
           timezone: "Asia/Shanghai",
          locale: "zh",
          debug: false,
          drawings_access: {
          type: "black",
          tools: [{ name: "Regression Trend" }]
        },
        allow_symbol_change: true,
          loading_screen: {
            backgroundColor: "#181b2a"
          },
          toolbar_bg: "#062853", //工具栏背景色
     disabled_features: [
          //off
          "pane_context_menu",
          "go_to_date",
          "header_compare", //对比或叠加品种
          "header_interval_dialog_button", //正在加载
          "header_symbol_search",
          "header_undo_redo",
          "legend_context_menu",

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
          "header_resolutions"
          // 'create_volume_indicator_by_default'
        ],
          enabled_features: [
            //on
            //  "create_volume_indicator_by_default",//成交量幅图
            // "adaptive_logo", //移动端隐藏logo
       
            // "use_localstorage_for_settings",
            // "dont_show_boolean_study_arguments", // 指标参数
            // "same_data_requery",


             "hide_last_na_study_output", //隐藏最后一次指标输出

            
          "use_localstorage_for_settings",
          "dont_show_boolean_study_arguments",
        
          "header_screenshot", //截屏left
          "header_indicators", //指标按钮
          "header_fullscreen_button", //全屏按钮
          "header_settings"
          ],
         
          // preset: "mobile", //手机

          customFormatters: { //时间格式
            dateFormatter: {
              format: function(date) {
                return (
                  date.getUTCFullYear() +
                  "-" +
                  (date.getUTCMonth() + 1) +
                  "-" +
                  date.getUTCDate()
                );
              }
            }
          },
          overrides: {
            //"volumePaneSize" : "large"支持的值: large（默认）, medium, small, tiny//  白色蜡烛样式
            volumePaneSize: "medium",
          
            // "paneProperties.legendProperties.showLegend": true, // 隐藏MA值
            // "paneProperties.legendProperties.showStudyValues": true,

            "paneProperties.background": "#051933", // 图表背景色 黑夜
            // "paneProperties.background": "#e4e5e7", // 图表背景色 白天

              // 网格线颜色
            "paneProperties.vertGridProperties.color": "#1f2943",
            "paneProperties.horzGridProperties.color": "#1f2943",

            // 点击捕捉线
            "paneProperties.crossHairProperties.color": "#989898",
            "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor": "#aaa", // 价格颜色

            // 实心k
            "mainSeriesProperties.candleStyle.upColor": "#51b183",
            "mainSeriesProperties.candleStyle.downColor": "#de5855",
            "mainSeriesProperties.candleStyle.drawWick": true,

            "mainSeriesProperties.candleStyle.borderColor": "#C400CB",
            //  K线边框
            //  "mainSeriesProperties.candleStyle.drawBorder": true,
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
            "scalesProperties.lineColor": "#313441", //边框线条颜色


            "paneProperties.legendProperties.showSeriesTitle": false // 取消symbolInfo
          },
          // client_id: "tradingview.com",
          // user_id: "public_user_id",
          custom_css_url: "./night.css",
         
         studies_overrides: {
              "volume.volume.color.1": "#00bfa6",  //第一根的颜色
              "volume.volume.color.0": "#e52e5f",  //第二根的颜色
              "volume.volume.transparency": 100,    //透明度
          //     "volume.volume ma.color": "#FF0000", //波浪图颜色
          //     "volume.volume ma.transparency": 30, //波浪图透明度
          //     "volume.volume ma.linewidth": 5,    
          //     "volume.show ma": true,    //是否显示
          //     "volume.options.showStudyArguments":false,
          //     "bollinger bands.median.color": "#33FF88",
          //     "bollinger bands.upper.linewidth": 7
          }
        });

        // this.interval = interval;

        // this.symbol = symbol;





        this.widget.onChartReady(() => {
        

        let chart = this.widget.activeChart();









          // 十字线扑捉，获取当前价格 时间戳
          // chart.crossHairMoved(res=>{
          //   console.log(res)
          // });



          // chart.createStudy('MACD', false, false, [14, 30, "close", 9]);
        //   chart.createStudy('Moving Average Exponential', false, false, [26])
        //  chart.createStudy('Stochastic', false, false, [26], null, {"%d.color" : "#FF0000"})



          chart.createStudy("Moving Average", false, false, [5], null, {
            "Plot.color": "#965fc4",
            "Plot.linewidth": 2
          });
          chart.createStudy("Moving Average", false, false, [10], null, {
            "Plot.color": "#84aad5",
            "Plot.linewidth": 2
          });
          chart.createStudy("Moving Average", false, false, [30], null, {
            "Plot.color": "#55b263",
            "Plot.linewidth": 2
          });
          chart.createStudy("Moving Average", false, false, [50], null, {
            "Plot.color": "#b7248a",
            "Plot.linewidth": 2
          });
          chart.createStudy("Moving Average", false, false, [100], null, {
            "Plot.color": "#f00",
            "Plot.linewidth": 2
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
   
      // if(data.indexOf('initEntrust') !=-1){
      //   return
      // }
   

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
      console.log("改变时间和交易对");
      console.log(symbol, interval);
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

    setTime(interval) {
      this.widget.activeChart().setResolution(interval);
    },
    toClose1() {
      this.socket.toClose();
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
    handerCurrentPrice(price){
      let radom = Math.random();
      let isD = radom>0.5?true:false;
      if(price>=2000){
          return  isD? price+(radom*1.5) : price-(radom*1.5)
      }else{

        if(price<1){
             return  isD? price+(radom/9000) : price-(radom/9000)
        }else if(price>=1&&price<10){
           return  isD? price+(radom/500) : price-(radom/500)
        }else if(price>=10&&price<100){
           return  isD? price+(radom/50) : price-(radom/50)
         }else if(price>=100&&price<1000){
           return  isD? price+(radom/5) : price-(radom/5)
        }else if(price>=1000&&price<2000){
           return  isD? price+(radom) : price-(radom)
        }else{
           return  isD? price+(radom/10) : price-(radom/10)
        } 
      }
    },

    onMessage(data) {
      //  盘口数据
      //  console.log(data)

      //历史数据
      if (data.data && data.data.length) {
        console.log("请求来的init数据");
        data.data[data.data.length-1].close = this.testDta.close;
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
      } else if (data.method == "getKline") {
        // 更新数据
        console.log("请求来的实时K线数据");
        console.log(data);
        let _this  = this;
        const ticker = `${this.symbol}-${this.interval}`;
        let barsData = {
          time: data.time - 0,
          open: data.open - 0,
          high: data.high - 0,
          low: data.low - 0,
          close: data.close - 0,
          volume: data.volume - 0
        };

        //  console.log(this.currentClose)
        //  console.log('ccc:'+data.close);
            this.$hub.$emit('fromRandomCurrentPrice',data.close);


        var timer2 = null;
        // timer2 = setInterval(()=>{
        
        //   // 如果当前和上次一样，那么随机变动
        //   if(this.currentClose==data.close){
        //     barsData.close = this.handerCurrentPrice(this.testDta.close);

        //     // 300毫秒一次随机价格 到 页面顶部 当前价格
        //     this.$hub.$emit('fromRandomCurrentPrice',barsData.close);
           
        //       let newdatacallback = _this.subBars; //回调新K线的方法
        //       newdatacallback.listener(barsData);
           
        //   }else{
        //     let newdatacallback = _this.subBars; //回调新K线的方法
        //     newdatacallback.listener(barsData);
        //     this.$hub.$emit('fromRandomCurrentPrice',barsData.close);
             

             
        //   }

        // },_this.interTime);

          let newdatacallback = _this.subBars; //回调新K线的方法
            newdatacallback.listener(barsData);
            this.$hub.$emit('fromRandomCurrentPrice',barsData.close);
             

        this.currentClose =  data.close - 0;

        let radomTime = parseInt(Math.random()*1000 + 3000)
;

        
        setTimeout(()=>{
            clearInterval(timer2)
        },radomTime)

        // radomTime  秒一推 目前


     

        

        // barsData.close = Math.random()*100 + this.testDta.close;
       
      //  ajax获取当前价格
        // barsData.close = this.testDta.close;

        // this.$get("data/data/getCoinInfo",{
        //    pairsName : _this.symbol 
        //    }).then(res => {
        //   if (res && res.status == "SUCCEED") {
        //     let data = JSON.parse(res.result);
        //     let currentPrice = data.nowPrice;
        //     barsData.close = currentPrice;
          
        //   }
        // });

        //  let newdatacallback = _this.subBars; //回调新K线的方法
        //    newdatacallback.listener(barsData);

       
      } else {
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

        // console.log(data)

        this.$emit("pankouData", data);
      }
    },
    getBars(
      symbolInfo,
      resolution,
      rangeStartDate,
      rangeEndDate,
      onLoadedCallback
    ) {
      let prevKey = this.symbol + this.interval;
      // console.log(prevKey)
      let currentKey = symbolInfo.name + resolution;

      // if (this.interval !== resolution ) {  //周期不同 或者商品不同 可以请求
      if (true) {
        // if (prevKey!=currentKey) {
        // this.unSubscribe(this.interval);
        this.interval = resolution;

        // 发送盘口指令
      
        // if(this.type=='bibi'){
             this.sendMessage(`initEntrust-${symbolInfo.name}`);
        // }else{
        //     this.sendMessage(`initMatch-${symbolInfo.name}`);
        // }

        if (resolution < 60) {
          // this.sendMessage({
          //   method: "initKline",
          //   param: "min" + resolution,
          //   market: symbolInfo.name,
          //   startTime: rangeStartDate * 1000,
          //   endTime: rangeEndDate * 1000
          // });
          window.localStorage.setItem("currentTime", resolution);
          this.sendMessage(
            `initKline-${symbolInfo.name}-${resolution}m-${rangeStartDate *
              1000}-${rangeEndDate * 1000}`
          );

          //  _this.ws.send('initKline-BTC/USDT-1m-1577313180000-1577755149000')
        } else if (resolution == 60) {
          // this.sendMessage({
          //   method: "initKline",
          //   param: "H1",
          //   market: symbolInfo.name,
          //   startTime: rangeStartDate * 1000,
          //   endTime: rangeEndDate * 1000
          // });
          window.localStorage.setItem("currentTime", "60");

          this.sendMessage(
            `initKline-${symbolInfo.name}-1h-${rangeStartDate *
              1000}-${rangeEndDate * 1000}`
          );
        } else if (resolution == "D") {
          // this.sendMessage({
          //   method: "initKline",
          //   param: "D1",
          //   market: symbolInfo.name,
          //   startTime: rangeStartDate * 1000,
          //   endTime: rangeEndDate * 1000
          // });
          window.localStorage.setItem("currentTime", "D");

          this.sendMessage(
            `initKline-${symbolInfo.name}-1d-${rangeStartDate *
              1000}-${rangeEndDate * 1000}`
          );
        } else if (resolution == "W") {
          window.localStorage.setItem("currentTime", "W");

          this.sendMessage(
            `initKline-${symbolInfo.name}-1w-${rangeStartDate *
              1000}-${rangeEndDate * 1000}`
          );

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
      let main = this.symbol.split("/")[0];
        main = main.toUpperCase();
   
        let num = 10000;

        if (main == 'BTC') {
            num = 10000000
        }

      
   
      return {
        name: this.symbol,
        ticker: this.symbol,
        description: this.symbol,
         pricescale: num // 价格刻度

        // pricescale: main == "BTC" || main == "ETH" ? 100000000 : 10000 // 价格刻度
      };
    }
  }
};
</script>
<style  scoped>
</style>

