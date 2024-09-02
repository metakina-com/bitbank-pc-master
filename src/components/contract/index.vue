<template>
  <div class="contract">

    <div class="pad-b-15">
      <!-- 交易 -->
      <div class="flex">
        <div class="wid180 ">
          <el-tabs v-model="updownType">
            <el-tab-pane :label="$t('contract.kc')" name="1"></el-tab-pane>
            <!-- <el-tab-pane label="平仓" name="2"></el-tab-pane> -->
          </el-tabs>
        </div>
         <div class="flex1 v_center line40 blue bold size16">{{currentPairsName}}{{ $t('contract.kc') }}</div>
         <div class="wid180"></div>
      </div>

      <div class="flex btn_type pad-t-5 flex_middle">
        <div class="item pointer" @click="priceType=1" :class="{'active':priceType==1}">{{$t('contract.sjwt')}}</div>
        <div class="item pointer" @click="priceType=2" :class="{'active':priceType==2}">{{$t('contract.xjwt')}}</div>
        <div style="position:relative">
          <transition name="el-zoom-in-bottom">
            <div v-show="isTip" style="position:absolute;bottom:30px;left:-20px;z-index:999" >
                <div class="tip">
                  <!-- 当市场价满足触发价时，将按照委托价和委托数量帮您下单 -->
                  {{ $t('contract.wtTips') }}
                </div>
            </div>
          </transition>
          <img @mouseenter="isTip=true" @mouseleave="isTip=false" class="wid16 hei16 pointer" src="./../../assets/img/hy/point.png" alt="">
        </div>
        <div class="flex1"></div>
        <div @mouseenter="isTip2=true" @mouseleave="isTip2=false" style="position:relative">
          <transition name="el-zoom-in-bottom">
            <div v-show="isTip2" style="position:absolute;bottom:35px;left:-20px;z-index:999" >
                <div class="tip2">
                  <!-- 点击切换倍数 -->
                  {{ $t('contract.wtTips1') }}
                </div>
            </div>
          </transition>
          <el-select  v-model="ganggan" :placeholder="$t('contract.xzbs')" size="mini" style="width:80px;border:none;background:none">
            <el-option
              v-for="item in gangganSet"
              :key="item.id"
              :label="item.leverDesc"
              :value="item.lever">
            </el-option>
          </el-select>
        </div>
        <!-- <div class="item pointer">限价委托</div> -->
        <div style="position:relative" class="mar-l-8">
          <transition name="el-zoom-in-bottom">
            <div v-show="isTip1" style="position:absolute;bottom:30px;right:-20px;z-index:999" >
                <div class="tip1">
                  <!-- 倍数越高，发生强制平仓的风险越高 -->
                  {{ $t('contract.swapTip1') }}
                </div>
            </div>
          </transition>
          <img @mouseenter="isTip1=true" @mouseleave="isTip1=false" class="wid16 hei16 pointer" src="./../../assets/img/hy/point.png" alt="">
        </div>
        
      </div>
      <div class="flex_bet">
        <div class="flex1 pad-r-20">
          <!-- 开多 -->
          <contract  :priceType="priceType" :kekaishoushu="kekaishoushu" :marginRatio="marginRatio" :gangganSet="gangganSet" :ganggan="ganggan" @getAsset="getAsset" :updownType="updownType"  subType="1" />
        </div>
        <!-- 开空 -->
        <div class="flex1 pad-l-20">
          <contract  :priceType="priceType" :kekaishoushu="kekaishoushu" :marginRatio="marginRatio" :gangganSet="gangganSet" :ganggan="ganggan" :updownType="updownType" subType="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import contract from "./contract.vue";
export default {
  components: {
    contract
  },
  data() {
    return {
      gangganSet: [],
      ganggan:'100',
      isTip:false,
      isTip1:false,
      isTip2:false,
      priceType: "1", //1市价，2限价
      updownType:"1", //1 开仓 2平仓
      assets: {
        balance: 0,
        blockedBalance: 0
      }, //可用资产
      operationType: "open", //open买
      kekaishoushu:'',//可开手数
      marginRatio:'',//资金可用比例
    };
  },
  computed: {
    currentPairsName() {
      return this.$store.state.pairsName1;
    },
    contractMulId() {
      return this.$store.state.contractMulId;
    },
    isLogin() {
      return this.$store.state.isLogin;
    }
  },
  watch: {
    marketCount: function(val) {
      this.setCount = val;
    },
    currentPairsName(val) {
      this.getGangganList(val)
    },
    ganggan(val) {
      // console.log(val)
    }
  },
  mounted() {
    this.getGangganList(this.currentPairsName);
    this.getMarginRote()
  },
  methods: {
    getAsset(data) {
      this.assets = data;
    },
    getMarginRote() {
      // 获取 可开手数 资产比例
      this.$get("contract/contractMul/getMarginProportion", {
        pairsName: this.currentPairsName,
      }).then((res) => {
        this.marginRatio = res.result;
        console.log(this.marginRatio,'this.marginRatio ')
      });
    },
            // 杠杆配置
    getGangganList(pairsName) {
        this.$get("contract/contractMul/getLevers", {
            pairsName
        }).then(res => {
            if (res && res.status == "SUCCEED") {
              console.log()
                let data = res.result;
                this.gangganSet = data;
                console.log(this.gangganSet,'gangganset')
                // handsMax: 0
                // id: "a94279463b266534cf58184473abacf2"
                // lever: 10
                // leverDesc: "10X"
                // pairsName: "ETC/USDT"
        

                // this.columns = this.gangganSet.map(ele => {
                //     return `${ele.lever}X`;
                // });

                // let item = this.gangganSet.find(ele => ele.lever == 100); //默认100倍

                // this.currentGangganType = item.lever;

                // this.leverId = item.id;

                // this.getMaxHand(
                //     this.currentGangganType,
                //     this.currentName,
                //     this.price,
                //     this.currentPrice
                // );

              
            }
        });
    },
  }
};
</script>

<style lang='scss'>
.el-tabs__nav-wrap::after {
  background-color: rgba(19, 22, 37, 0.2) !important;
}
.orders .inputBox .el-input__inner {
  color: #fff!important;
}
.contract{
.el-tabs__item {
  color: #fff!important;
  padding:0 50px
}
}
.btn_type{
   .el-input__inner{
      background: none;
      color: $blue;
      // border:1px solid $blue
      
    }
}

</style>
<style lang="less" scoped>
.contract {
  background-color: #171b2b;
  .btn_type{
    .item{
      border:1px solid #f5f5f5;
      color: #f5f5f5;
      margin-right: 10px;
      padding:2px 10px;
       border-radius: 2px;
    }
    .active{
        border:1px solid #357ce1;
         color: #357ce1;
        
    }
    
  }
  .tip{
    width: 300px;
    height: auto;
    color:#333;
    font-size: 13px;
    font-weight: 500;
    padding:10px;
    // border: 1px solid #f5f5f5;
    border-radius: 5px;
    position: relative;
    background: #fff;
    color: #666;
    &::before{
			content: '';
			width: 0;
			height: 0;
			border: 6px solid;
			position: absolute;
			bottom: -12px;
			left: 20px;
			border-color:  #fff transparent transparent;
    }
  }
  .tip1{
    width: 200px;
    height: auto;
    color:#333;
    font-size: 13px;
    font-weight: 500;
    padding:10px;
    // border: 1px solid #f5f5f5;
    border-radius: 5px;
    position: relative;
    background: #fff;
    color: #666;
    &::before{
			content: '';
			width: 0;
			height: 0;
			border: 6px solid;
			position: absolute;
			bottom: -12px;
			right: 20px;
			border-color:  #fff transparent transparent;
    }
  }
  .tip2{
    width: 120px;
    height: auto;
    color:#333;
    font-size: 13px;
    font-weight: 500;
    padding:10px;
    // border: 1px solid #f5f5f5;
    border-radius: 5px;
    position: relative;
    background: #fff;
    color: #666;
    &::before{
			content: '';
			width: 0;
			height: 0;
			border: 6px solid;
			position: absolute;
			bottom: -12px;
      left: 50px;
     
			border-color:  #fff transparent transparent;
    }
  }
}
</style>