<template>
  <div class="trade-view-comp cont-box">
    <div id="trad_viw_root"></div>
  </div>
</template>

<script>
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
        disabled_features: [
          "header_symbol_search",
          "use_localstorage_for_settings",
          "left_toolbar", // 左侧工具栏
          "control_bar",
          "legend_context_menu", //?
          "border_around_the_chart", //?
          "timeframes_toolbar", //?
          "header_widget_dom_node", //顶部工具栏
          "header_undo_redo", //撤销重做按钮
          "header_screenshot", //截屏left
          "header_resolutions", //更换周期
          "header_interval_dialog_button", //?
          "header_settings",
          "header_indicators", //指标按钮
          "edit_buttons_in_legend",
          "header_fullscreen_button", //全屏按钮
          "property_pages",
          "display_market_status",
          "go_to_date",
          // "header_compare", //对比或叠加品种
          "show_hide_button_in_legend",
          "symbol_info",
          "volume_force_overlay", // 主图和幅图不要叠加 在主数据量列的窗格上放置成交量指标
          "items_favoriting",
          "header_layouttoggle",
          "symbol_search_hot_key",
          "save_chart_properties_to_local_storage",
          "source_selection_markers"
        ],
        enabled_features: [
          //on
          "create_volume_indicator_by_default", //成交量幅图
          "adaptive_logo", //移动端隐藏logo

          "use_localstorage_for_settings",
          "hide_last_na_study_output", //隐藏最后一次指标输出
          "dont_show_boolean_study_arguments", // 指标参数
          "same_data_requery"
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
          volumePaneSize: "medium",

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
        // custom_css_url: "./night.css"

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
      });
    },
    setTime(interval) {
      this.widget.activeChart().setResolution(interval);
    },

    setSymbol(symbol, interval) {
      console.log(symbol,interval);
      this.symbol = symbol;
      this.widget.activeChart().setSymbol(symbol, interval);
    }
  }
};
</script>

<style type="text/css">
#trad_viw_root {
  height: 100%;
}
</style>