<template>
  <div class="trade-view-comp cont-box">
    <div id="trad_viw_root"></div>
  </div>
</template>

<script>
import $ from "jquery";
import wsBus from "./datafeeds/wsBus";
import Datafeeds from "./datafeeds/myDatafeeds";
export default {
   props: ['type'],
  name: "kline-comp",
  data() {
    return {
      widget: null
    };
  },
  destroyed(){
  
  //  wsBus.doClose()

  },
  mounted(){
   


      window.MV.$on('pankData',red=>{
       
          this.$emit("pankouData", red);

      })

  },
  methods: {
    tradingViewInit(symbol, interval) {
      console.log(window.TradingView.widget)
      this.widget = new window.TradingView.widget({
        symbol: symbol,
        width: "100%",
        height: "100%",
        interval: interval,
        fullscreen: false,
        container_id: "trad_viw_root",
        theme: "Dark",
        datafeed: new Datafeeds(),
        // library_path: "./tradeview/charting_library/",
         library_path: "/static/chartTool/",
        //  library_path: "/static/tradeview/charting_library/",
         allow_symbol_change: true,
  
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
          "hide_last_na_study_output",
          "use_localstorage_for_settings",
          "dont_show_boolean_study_arguments",
          "hide_last_na_study_output",
          "header_screenshot", //截屏left
          "header_indicators", //指标按钮
          "header_fullscreen_button", //全屏按钮
          "header_settings"
        ],
        timezone: "Asia/Shanghai",
        locale: "zh",
        debug: false,
        loading_screen: {
          backgroundColor: "#181b2a"
        },
        drawings_access: {
          type: "black",
          tools: [{ name: "Regression Trend" }]
        },
        allow_symbol_change: true,
        toolbar_bg: "#062853", //工具栏背景色
        // preset: "mobile", //手机

        customFormatters: {
          //时间格式
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
          volumePaneSize: "small",
          "paneProperties.legendProperties.showStudyValues": true,


          "paneProperties.background": "#051933", // 图表背景色 黑夜

          // 网格线颜色
          "paneProperties.vertGridProperties.color": "#1f2943",
          "paneProperties.horzGridProperties.color": "#1f2943",

          // 点击捕捉线
          "paneProperties.crossHairProperties.color": "#989898",
          "symbolWatermarkProperties.transparency": 90,
          "scalesProperties.textColor": "#aaa", // 价格颜色

          // 实心k
          "mainSeriesProperties.candleStyle.upColor": "#05AC90",
          "mainSeriesProperties.candleStyle.downColor": "#D14B64",
          "mainSeriesProperties.candleStyle.drawWick": true,

          "mainSeriesProperties.candleStyle.borderColor": "#C400CB",

          "mainSeriesProperties.candleStyle.wickUpColor": "#589065",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ae4e54",
          // 空心k
          "mainSeriesProperties.hollowCandleStyle.upColor": "#00bfa6",
          "mainSeriesProperties.hollowCandleStyle.downColor": "#e52e5f",
          "mainSeriesProperties.hollowCandleStyle.drawWick": true,
          "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#acaea4",
          "mainSeriesProperties.hollowCandleStyle.wickUpColor": "#589065",
          "mainSeriesProperties.hollowCandleStyle.wickDownColor": "#acaea4",
          "scalesProperties.lineColor": "#313441", //边框线条颜色
          "paneProperties.legendProperties.showSeriesTitle": false // 取消symbolInfo
        },
        // client_id: "tradingview.com",
        // user_id: "public_user_id",
        custom_css_url: "./night.css",
        studies_overrides: {
          "volume.volume.color.1": "#00bfa6", //第一根的颜色
          "volume.volume.color.0": "#e52e5f", //第二根的颜色
          "volume.volume.transparency": 100 //透明度
        }
      });
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
        chart.createStudy("Moving Average", false, false, [203], null, {
          "Plot.color": "#b7248a",
          "Plot.linewidth": 1
        });
          chart.createStudy("Moving Average", false, false, [35], null, {
          "Plot.color": "#ff0",
          "Plot.linewidth": 1
        });
        chart.onIntervalChanged().subscribe(null, (interval, obj) => {
          localStorage.setItem("tradingview.interval", interval);
        });

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
        let _t = this;
        let btn = {};
        let nowTime = "";
        let handleClick = (e, value) => {
          // debugger
          // //console.log(e.target)
          // alert(value)
          this.widget.chart().setResolution(value);
          $(e.target)
            .addClass("select")
            .closest("div.space-single")
            .siblings("div.space-single")
            .find("div.button")
            .removeClass("select");
          setTimeout(() => {
           
          }, 300);
          //
        };
        // 显示当前K线分辨率按钮
        buttonArr.forEach((v, i) => {
          btn = _t.widget.createButton().on("click", function(e) {
            //  alert(v.value)
            handleClick(e, v.value);
          });

          

    
          btn[0].innerHTML = v.text;
          btn[0].title = v.text;

          if(btn[0].innerText=='15min'){
             $(btn[0]).addClass("select");
          }

          let klineTime = localStorage.getItem("klineTime");

          let hour = 0,
            day = 0,
            week = 0;
          if (klineTime.replace("H", "") == 1) {
            hour = 60;
          }
          if (klineTime.replace("D", "") == 1) {
            day = "D";
          }
          if (klineTime.replace("W", "") == 1) {
            week = "W";
          }
          if (
            v.value == klineTime.replace("MIN", "") ||
            v.value == day ||
            v.value == hour ||
            v.value == week
          ) {
            // console.log(btn)
            $(btn[0]).addClass("select");
          }
        });
         

      });
    },
    setTime(interval) {
      this.widget.activeChart().setResolution(interval);
    },

    setSymbol(symbol, interval) {
      console.log(symbol,interval);
      this.symbol = symbol;
      this.widget.activeChart().setSymbol(symbol);
    },
    toClose1(){
      // wsBus.doClose()
    }
  }
};
</script>

<style type="text/css">
#trad_viw_root {
  height: 100%;
}
.select{
  background: #ce5b5b;
  color:#fff
}
</style>