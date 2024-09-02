<template>
  <div class="pankou size12">
    <ul class="title flex hei40 line40 v_center bg1 mar-b-1">
      <li class="wid_20">{{ $t('contract.pankou') }}</li>
      <li class="wid_40">{{ $t('message.price') }}({{mainCoin}})</li>
      <li class="wid_40">{{ $t('contract.num') }}({{secondCoin}})</li>
    </ul>
    <div class="sell hei202 bg1 re widall">
      <!-- 数据层 -->
      <div class="ab bottom-0 widall zindex2">
        <ul
          class="flex hei20 line20 v_center item widall pointer"
          v-for="(item,i) in sellData"
          :key="i"
          @click="setMarkPrice(item.price)"
        >
          <li class="wid_20 red">{{ $t('contract.mai2') }} {{sellData.length-i}}</li>
          <li class="wid_40">{{item.price | subStringZreo(currentPairsName =='SHIB/USDT'?8:2)}}</li>
          <li class="wid_40">{{item.num | subStringZreo(2)}}</li>
        </ul>
      </div>
      <!-- 背景条层 -->
      <div class="ab bottom-0 widall zindex1">
        <div class="hei20 re widall" v-for="(item,i) in sellData" :key="i">
          <div class="tiao_red ab hei20" :style="{width: (item.num/maxSell)*80  +'%'}"></div>
        </div>
      </div>
    </div>
    <!-- chPrice: 1262.356578
higPrice: 175.95
lowPrice: 169.81
nowPrice: 175.14
open: 170.32
updown: 0.02829967
    volume: 520808.6338817633-->

    <div v-show="type=='bibi'" class=" hei40 line40 bg1 mar-t-b-1 v-center size12">
      <span>{{$t('contract.sscj')}}</span>
      <!-- <span class="pad-l-r-6 size12 bold" :class="currentPrice.updown>=0?'green':'red'"> -->
      <span class="pad-l-r-6 size12 bold" :class="updown>=0?'green':'red'">
        {{nowPrice | subStringZreo(currentPairsName =='SHIB/USDT'?8:2)}}
      </span>
      <span class="size12">≈￥{{chPrice | subStringZreo(2)}}</span>
    </div>

    <div v-show="type=='contract'" class=" hei40  bg1 mar-t-b-1 v-center size12">
      <div class="flex bet pad-l-r-10">
        <div class="v_left pad-t-4">
          <div>{{$t('contract.zxj')}}</div>
          <div class=" size12 bold" :class="updown>=0?'green':'red'">
            {{nowPrice | subStringZreo(currentPairsName =='SHIB/USDT'?8:2)}}
          </div>
        </div>
        <div class="v_right pad-t-4">
          <div>
            <!-- 指数价 -->
            {{ $t('contract.zhishujia') }}</div>
          <div class=" size12 bold ">
            {{zhishuPrice | subStringZreo(currentPairsName =='SHIB/USDT'?8:2)}}
          </div>
        </div>
      </div>
    </div>

    <div class="buy hei202 bg1 re widall">
      <!-- 数据层 -->
      <div class="ab top-0 widall zindex2">
        <ul class="flex hei20 line20 v_center item widall pointer" v-for="(item,i) in buyData" :key="i"    @click="setMarkPrice(item.price)">
          <li class="wid_20 green">{{ $t('contract.mai1') }} {{i+1}}</li>
          <li class="wid_40">{{item.price | subStringZreo(currentPairsName =='SHIB/USDT'?8:2)}}</li>
          <li class="wid_40">{{item.num | subStringZreo(2)}}</li>
        </ul>
      </div>
      <!-- 背景条层 -->
      <div class="ab top-0 widall zindex1">
        <div class="hei20 re widall" v-for="(item,i) in buyData" :key="i">
          <div class="tiao_green ab hei20" :style="{width: (item.num/maxBuy)*80 +'%'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["pankou","type"],
  data() {
    return {
  
      seter:null,
      zhishuPrice:'',
      secondCoin: "",
      mainCoin: "",
      rate: 7,
      updownRate: 0,
      buyList: [
        {
          num: 123,
          price: 456.3472
        },
        {
          num: 123,
          price: 456.3472
        },
        {
          num: 93,
          price: 46.3432
        },

        {
          num: 123,
          price: 456.3472
        },
        {
          num: 123,
          price: 456.3472
        },
        {
          num: 93,
          price: 46.3432
        },
        {
          num: 453,
          price: 23.987
        },
        {
          num: 453,
          price: 23.987
        }
      ],
      sellList: [
        {
          num: 123,
          price: 456.3472
        },
        {
          num: 123,
          price: 456.3472
        },
        {
          num: 93,
          price: 46.3432
        },

        {
          num: 123,
          price: 456.3472
        },
        {
          num: 123,
          price: 456.3472
        },
        {
          num: 93,
          price: 46.3432
        },
        {
          num: 453,
          price: 23.987
        },
        {
          num: 453,
          price: 23.987
        }
      ],
      buyData: [],
      sellData: [],
      maxSell: 10,
      minSell: 1,
      maxBuy: 10,
      minBuy: 1,
      nowPrice: "",
      chPrice: "",
      updown: ""
    };
  },

  computed: {
    currentPairsName() {
      if(this.type=='bibi'){
         return this.$store.state.pairsName;
      }else{
         return this.$store.state.pairsName1;
      }
     
    },
    currentPrice() {
      var data = this.$store.state.currentPrice;
     
       this.nowPrice = data.nowPrice;
       this.chPrice = data.chPrice;
      this.rate = data.chPrice / data.nowPrice;
      this.updownRate = data.nowPrice / data.updown;
      return this.$store.state.currentPrice;
    }
  },
  watch: {
    type(val){

    },
    currentPrice(data) {
      // this.rate = data.chPrice / data.nowPrice;
      // this.updownRate = data.nowPrice / data.updown;
    },
    pankou(data) {
      this.handerPankouData(data);
    },
    currentPairsName(val) {
      
     if(this.type=='bibi'){
        
      }else{
        this.getZhishu(val);
      }

      this.mainCoin = val.split("/")[1];
      this.secondCoin = val.split("/")[0];
    },
    // 'currentPrice.nowPrice':{
    nowPrice(val) {
      this.chPrice = val * this.rate;
      this.updown = val / this.updownRate;
      // handler(val) {
      //    this.currentPrice.chPrice = val*this.rate;
      //    this.currentPrice.updown = val/this.updownRate;
      // }
    }
  },
  created() {
    // 结合K线的数据到 盘口
    this.$hub.$on("fromRandomCurrentPrice", res => {
      // this.currentPrice.nowPrice = res;
      this.nowPrice = res;
    });
  },

  mounted() {
    // let val = this.$store.state.pairsName;
    // this.mainCoin = val.split("/")[1];
    // this.secondCoin = val.split("/")[0];

   
      if(this.type=='bibi'){
        this.currentPairsName =  this.$store.state.pairsName;
      }else{
        this.currentPairsName =  this.$store.state.pairsName1;
        this.getZhishu(this.currentPairsName);
      }
      this.mainCoin = this.currentPairsName.split("/")[1];
      this.secondCoin = this.currentPairsName.split("/")[0];
     
  },
  destroyed() {
    if(this.seter){
      clearTimeout(this.seter)
    }
  },
  methods: {
    // 设置买卖价格
    setMarkPrice(val) {
      this.$hub.$emit("setMarkPrices",val);
    },
    
    getZhishu(pairsName) {
      if(this.seter){
        clearTimeout(this.seter)
      }
      this.$get("contract/contractMul/getIndexPrice", {
          pairsName
      }).then(res => {
          if (res && res.status == "SUCCEED") {
              let data = res.result;
              this.zhishuPrice = data;
              this.seter = setTimeout(()=>{
                this.getZhishu(pairsName)
              },5000)
          }
      });
  },

    handerPankouData(data) {
      //  console.log(data);

      this.buyData = data.openup.slice(0, 10); //显示10条
      if (data.chengjiao.length == 1 && data.chengjiao[0] == "") {
        this.chengjiaoData = [];
      } else {
        this.chengjiaoData = data.chengjiao.slice(0, 10);
      }

      // console.log(this.buyData)

      this.maxBuy = Math.max.apply(
        Math,
        data.openup.map(ele => ele.num)
      );
      this.minBuy = Math.min.apply(
        Math,
        data.openup.map(ele => ele.num)
      );

      this.sellData = data.opendown.slice(0, 10).reverse();
      // console.log(this.sellData)
      this.maxSell = Math.max.apply(
        Math,
        data.opendown.map(ele => ele.num)
      );
      this.minSell = Math.min.apply(
        Math,
        data.opendown.map(ele => ele.num)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.pankou {
  .tiao_green {
    background: rgba(26, 99, 82, 0.3);
    right: 0;
    top: 0;
  }
  .tiao_red {
    background: rgba(99, 26, 33, 0.3);
    right: 0;
    top: 0;
  }

  .sell {
  }
  .price {
  }
  .buy {
  }
}
</style>

