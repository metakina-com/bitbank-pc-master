<template>
  <div >
    {{wid2}}
    <!-- <h2>深度图</h2> -->
    <e-charts style="height:460px" :style="{width: wid2 + 'px'}"  :options="deptChartOption" @legendselectchanged="legendSelectChanged"></e-charts>
  </div>
</template>

<script>
  import $ from 'jquery'
  import ECharts from 'vue-echarts/components/ECharts';
  require('echarts/lib/chart/line');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/legendScroll');

  export default {
    props:['wid'],
    components: {ECharts},
    data() {
      return {
        deptChartOption:{},
        buy:[10, 9, 8, 5, 1],
        sell:['', '', '', '', '', 0, 2, 3, 6, 8,12,13,15],
        price:[],
        wid2:600

      };
    },
    mounted() {
    //   this.init()
    },
    watch:{
      wid(val){
          this.wid2 = val;
          setTimeout(()=>{ 
            // alert(1)
//  this.deptChartOption.resize();

          },2000)
         
      }
    },
    created(){
      
      
          this.$hub.$on("toPankouData",res=>{
            
              function sortNumber(a,b)
              {
              return a - b
              }
                // console.log(res)
                let buy = [];
                let sell = [];
                let price = [];
                let price1 = [];
                let kong = [];
                 res.buy.forEach(ele => {
                    buy.unshift(ele.total - 0);
                    price.push(ele.price - 0);
                    kong.push('');

                 });
                 price.sort(sortNumber)
                // console.log(price);  //小到大
                  res.sell.forEach(ele => {
                    sell.unshift(ele.total - 0);
                     price1.push(ele.price - 0);
                 });
                 price1.sort(sortNumber)
                 
                this.price = price.concat(price1);

              // console.log('sell')
              // console.log(sell)


              let ar1 =  buy; // [1,2,4,7,11]
              let a1 =[];
              let count1 = 0;
              ar1.reverse();
              ar1.forEach(ele=>{
                  count1 += ele;
                  a1.unshift(count1)
              })
              // console.log(a1)
              buy = a1;


              let ar2 =  sell; // [1,2,4,7,11]
              let a2 =[];
              let count2 = 0;

              ar2.forEach(ele=>{
                  count2 += ele;
                  a2.push(count2)
              })
              // console.log(a2)
              sell = a2;












                this.buy = buy;
                this.sell = kong.concat(sell)
               this.init()
          });
    },
    methods: {
        init(){
            this.deptChartOption =  {
            grid: {left: 10, top: 50, right: 60, bottom: 30 },
          tooltip: {
            confine: true,
            trigger: 'axis',
            axisPointer: {type: 'line', lineStyle: {color: '#999',type:'dashed',opacity:0.5}},
            backgroundColor: '#355475',
            textStyle: {color: '#fff', fontSize: '14px'},
            extraCssText: 'box-shadow: 0 0 16px 0 rgba(0, 0, 0, .2);border-radius: 4px;'
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
            type: 'category',
             axisLine: {
               show: true,
              lineStyle:{
                  color:'#666'
                }
               },
            // axisTick: {show: false},
            // axisLabel: {show: false},
            boundaryGap: false,
            data: this.price
          },
          yAxis: [{
            type: 'value',
            axisLine:{
              show: true,
              lineStyle:{
                color:'#666'
              }
            },

            show:true,
            position:'right',
           
            axisTick: {show: true},
            axisLabel: {show: true},
            splitLine: {show: false},
          }],
          series: [
            {
              // name: '买单',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              showSymbol: false,
              // symbolSize: 3,
              sampling: 'average',
              itemStyle: {normal: {color: '#4cc453'}},
              lineStyle: {normal: {color: '#243235'}},
              areaStyle: {color: '#243235'},
              data: this.buy
            },
            {
              // name: '卖单',
              type: 'line',
//              smooth: true,
              symbol: 'circle',
              showSymbol: false,
              // symbolSize: 3,
              sampling: 'average',
              itemStyle: {normal: {color: '#e94c4c'}},
              lineStyle: {normal: {color: '#392332'}},
              areaStyle: {color: '#392332'},
              data: this.sell
            }
          ]
        }
          this.deptChartOption.tooltip.formatter = this.deptChartHover;
        },
      legendSelectChanged(obj) {
        const selected = obj.selected;
        if (selected) {
          this.deptChartOption.legend.selected[obj.name] = selected[obj.name];
        }
      },
      deptChartHover(value) {
        let result = '';
        value.map(item => {
          if (item.value !== '') {
            result = '委托价：'+ value[0].axisValue +
              '<br/>'+
              '累计：'+ item.value;
          }
        });
        return result;
      }
    }
  };
</script>

