<template>
  <div class="x-bar" id="highcharts" style="width:100%;height:100%">
  </div>
</template>
<script>
import HighCharts from 'highcharts'
export default {
    data(){
        return {
          chart:null
        }
    },
  // 验证类型
  props: {
  
    toBuy: {
      type: Array
    },
    toSell: {
      type: Array
    }
  },
  watch: {
  toBuy(val){
    // console.log(val)

    // let val1 = val.sort((a,b)=>{
    //   return a.price - b.price
    // })
    // console.log(val1)

      // let buy = [
      //   {price:5,num:100},
      //   {price:6,num:1000},
      //   {price:7.4,num:500},
      //   {price:8.5,num:1000},
      // ];
      let count = 0;
      let a = val.map(ele=>{
        count += ele.num
        return {
           price: ele.price,
           num: count
        }
      })
      // console.log(a)

   
       this.chart.series[0].setData(a.map(ele=>[ele.price,ele.num]));
     
      
  },
  toSell(val){
    // console.log(val)

     let count = 0;
      let a = val.map(ele=>{
        count += ele.num
        return {
           price: ele.price,
           num: count
        }
      })
       this.chart.series[1].setData(a.map(ele=>[ele.price,ele.num]));
  }
},
  mounted() {

    setTimeout(()=>{
        this.initDeep();
    },500)

  
  },
  methods:{
      initDeep(){
        this.chart = HighCharts.chart('highcharts',{
            chart: {
            panning: false, //禁用放大
            pinchType: '', //禁用手势操作
            type: 'area',
            zoomType: 'xy',
            backgroundColor: '#0F1523'
            },
            title: {
            text: '', 
            style:{
                fontSize:'24px',
                fontWeight: 'bold',
            }
            },
            credits: {
                enabled: false
            },
            xAxis: {
               lineWidth: 1,
               lineColor: "#333",
                tickColor:'#333', //刻线

                minPadding: 0,
                maxPadding: 0,
                plotLines: [{
                    color: '#888',
                    value: 0.1523,
                    width: 0,
                }],
                title: {
                    text: ''
                }
            },
            yAxis: [{
                lineWidth: 1,
                lineColor: "#333",
                tickColor:'#333', //刻线

                gridLineWidth: 0,
                title: null,
                tickWidth: 1,
                tickLength: 5,
                tickPosition: 'inside',
                labels: {
                    align: 'left',
                    x: 8
                }
            }, {
                opposite: true,
                linkedTo: 0,
                lineWidth: 1,
                  lineColor: "#333",
                gridLineWidth: 0,
                tickColor:'#333', //刻线
                title: null,
                tickWidth: 1,
                tickLength: 5,
                tickPosition: 'inside',
                labels: {
                    align: 'right',
                    x: -8
                }
            }],
            legend: {
                enabled: false
            },
            // plotOptions: {
            //     area: {
            //         fillOpacity: 0.2,
            //         lineWidth: 1,
            //         step: 'center',
            //         marker: {
            //             enabled: false
            //         }
            //     },
            //     series: {
            //         marker: {
            //             enabled: false
            //         },
            //         enableMouseTracking: false
            //     }
            // },
            // plotOptions: {
            //     area: {
            //         fillOpacity: 0.2,
            //         lineWidth: 1,
            //         step: 'center'
            //     }
            // },
            plotOptions: {
              area: {
                fillOpacity: 0.2,
                lineWidth: 2,
                marker: {
                  enabled: false,
                  symbol: 'circle',
                  radius: 2,
                  states: {
                    hover: {
                      enabled: true
                    }
                  }
                }
              }
            },
    
           
            tooltip: {
                headerFormat: '<span style="font-size=30px;">价格: {point.key}</span><br/>',
                valueDecimals: 2
            },
            series: [{
                name: '买入',
                data: [],
                color: '#03a7a8'
            }, {
                name: '卖出',
                data: [],
                color: '#fc5857'
            }]

        })



      }
  }

}
</script>
<style lang="scss">
.highcharts-container {
  width:100%!important;
}
</style>