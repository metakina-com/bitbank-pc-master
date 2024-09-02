<template>
  <div class="pankou size12 mar-t-10">
  

    <!-- chPrice: 1262.356578
higPrice: 175.95
lowPrice: 169.81
nowPrice: 175.14
open: 170.32
updown: 0.02829967
volume: 520808.6338817633 -->

     <div class="price hei50 line25  bg1 mar-t-b-1 v-center size12">
       <div class="v_left pad-l-10">
        <!-- 最新成交 -->
        {{ $t('quotes.zxcj') }}
       </div>
       <div class="flex v-center">
         <div class="wid_30">{{$t('quotes.time')}}</div>
         <div class="wid_20">{{$t('contract.pankou')}}</div>
         <div class="wid_30">{{$t('message.price')}}</div>
         <div class="wid_20">{{$t('contract.num')}}</div>
       </div>
    </div>

     <!-- count: 0.97748828
pairsName: "BTC/USDT"
price: 7133.04424861
time: 1587609066024
tradeType: "OPEN_DOWN" -->
  
      <div class="bg1 widall hei340  overflow gundong ">
          <ul class=" flex hei20 line20 v_center item widall "  v-for="(item,i) in chengjiaoData" :key="i">
            <li class="wid_30 ">{{item.time | hms}}</li>
            <li v-if="item.tradeType=='OPEN_DOWN'" class="wid_20 red">{{$t('contract.sell')}}</li>
            <li v-else class="wid_20 green">{{$t('contract.buy')}}</li>
            <li class="wid_30">{{item.price | subStringZreo(4)}}</li>
            <li class="wid_20">{{item.count | subStringZreo(2)}}</li>
          </ul>
  
      
  
    </div>
      

      


  </div>
</template>

<script>
export default {
  props:['pankou'],
  data() {
    return {
      secondCoin:'',
      mainCoin:'',
      buyList:[
        {
          num:123,
          price:456.3472
        },
         {
          num:123,
          price:456.3472
        },
         {
          num:93,
          price:46.3432
        },
      
         {
          num:123,
          price:456.3472
        },
         {
          num:123,
          price:456.3472
        },
         {
          num:93,
          price:46.3432
        },
         {
          num:453,
          price:23.9870
        },
        {
          num:453,
          price:23.9870
        },
      ],
            sellList:[
        {
          num:123,
          price:456.3472
        },
         {
          num:123,
          price:456.3472
        },
         {
          num:93,
          price:46.3432
        },
      
         {
          num:123,
          price:456.3472
        },
         {
          num:123,
          price:456.3472
        },
         {
          num:93,
          price:46.3432
        },
         {
          num:453,
          price:23.9870
        },
        {
          num:453,
          price:23.9870
        },
      ],
      buyData:[],
      sellData:[],
      maxSell:10,
      minSell:1,
      maxBuy:10,
      minBuy:1,
      chengjiaoData:[]
     
    };
  },

  computed: {
    currentPairsName(){
      return  this.$store.state.pairsName
    },
    currentPrice(){
      return this.$store.state.currentPrice
    }
  },
  watch:{
    currentPrice(val){
     
    },
    pankou(data){
    
      this.handerPankouData(data)
    },
    currentPairsName(val){
      this.mainCoin = val.split('/')[1];
      this.secondCoin = val.split('/')[0];
    }
  },
  created(){
   

  },

  mounted() {
    let val =   this.$store.state.pairsName;
    this.mainCoin = val.split('/')[1];
    this.secondCoin = val.split('/')[0];
  },
  destroyed() {
   
  },
  methods: {

    handerPankouData(data){
          //  console.log(data);
         
            if (data.chengjiao.length == 1 && data.chengjiao[0] == "") {
                this.chengjiaoData = [];
            } else {
                this.chengjiaoData = data.chengjiao.slice(0,100);
            }
    }
 
   
  }
};
</script>

<style lang="scss" scoped>
.pankou {
    
  .sell{
   


  }
  .price{

  }
  .buy{
   
  }

}
</style>

