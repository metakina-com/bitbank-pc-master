<template>
  <div class="markets  bg_main_fff">
    <div class="markets_tabs ">
      <div class="auto_center flex size16 v_center c999">
          <div class="item pointer" :class="indexTab==1?'c_fff':''" @click="tabsFun(1)">币币</div>
          <div class="item pointer" :class="indexTab==2?'c_fff':''" @click="tabsFun(2)">合约</div>
      </div>
    </div>

      <!-- 币币 的tabs -->
    <div class="tab_wrap " v-show="curType=='bibi'">
        <div class="bibi_tabs auto_center flex size14 flex_middle">
          <div class="flex1 flex v_center">
              <div v-for="item in tabs" :key="item.val" @click="bibiTabFun(item)"  class="bibi_item flex flex_center flex_middle" :class="currentVal==item.val?'active':''">
                <img v-show="item.val=='self'" class="wid14 hei14 v_middle mar-r-2" src="./../assets/img/hangqing/five.png" alt="">
                <span>{{item.title}}</span>
              </div>
          </div>
          <div class=" pad-r-20">
            
              <div class="input">
                <!-- <input type="text" placeholder="搜索币种"> -->
                <el-input
                  placeholder="搜索币种"
                  v-model="serchInput"
                    size="mini"
                    prefix-icon="el-icon-search"
                  clearable>
                </el-input>
              </div>
          </div>
          
        </div>
    </div>

      <!--币币 币种 tabs -->
    <div class="tab_wrap_coin "  v-show="(curType=='bibi'&&currentVal=='all')||curType=='contract'">
        <div class="bibi_tabs_coin auto_center v_center flex size14 flex_middle">
          <div v-for="item in tabsCoin" :key="item.val" @click="bibiTabFunCoin(item)"  class="bibi_item_coin " >
           
            <span :class="currentValCoin==item.val?'active':''">{{item.title}}</span>
          </div>
        </div>
    </div>


      
      

    <div class="auto_center bg_fff list_con">

      <el-row class="min-hei500 c666 ">
        <el-col :span="24">
          <!-- 列表头 -->
          <el-row  class="sortList pad-l-r-40 ">
            <el-col v-for="(item,i) in sortList" :key="i"  :span="4" class="items bold " :class="i==0?'self_start':''" >
                <span v-if="item.type==''" class="bold size12" >  {{item.name}}</span>
                <div v-else>
                 <div v-if="currentVal=='all'" @click="switchSortType(item.type)" :class="sortType==item.type?isSort?'cur upper':'cur lower':''" class="items pointer" :style="{'justify-content':i==sortList.length-1?'flex-end':'flex-star'}">
                      <span class="bold size12"> {{item.name}}</span>
                      <span  class="icons"></span>
                </div>
                 <span v-else class="bold size12" >  {{item.name}}</span>
                </div>

            </el-col>
          </el-row>
<!-- 
          chPrice: 0.91164011
      entrust: true
      higPrice: 0.135
      id: "b3c1bfc696c4e0929f9ac451df7ad6c3"
      image: ""
      isOpen: "1"
      lowPrice: 0.127069
    mainCur: "USDT"
    mainFrom: "ETH"
    open: 0.127069
    openPrice: 0
    optional: false
    pairsName: "ADA/USDT"
    price: 0.130225
    projectAdd: ""
    sort: 7
    state: "NORMAL"
    tokenCur: "ADA"
    top: false
    tradeMax: 1000000
    tradeMin: 1
    tradeRate: 0.003
    type: "MAIN_COIN"
    updown: 0.0248369
    volume: 149697546.07416737 -->

          <div v-if="pairsList.length>0" class="pad-l-r-40 list_wrap">
            <div  v-for="(item,i) in pairsList" :key="i"  @click="switchCoinName(item)">
              <el-row  class=" v_right list_con_con" >
                <el-col :span="4" class="v_left item">
                  <div v-show="curType!='contract'" class="flex flex_middle">
                    <div v-show="currentVal!='all'">
                      <img v-show="!item.optional" @click.stop="collectFun(item)" class="wid14 hei14 v_middle mar-r-2" src="./../assets/img/hangqing/start.png" alt="">
                      <img v-show="item.optional" @click.stop="collectFun(item)" class="wid14 hei14 v_middle mar-r-2" src="./../assets/img/hangqing/started.png" alt="">
                    </div>

                    <span class="size16" style="font-weight:500">{{item.pairsName}}</span>
                  </div>
                  <div v-show="curType=='contract'" >
                    <span>
                      <span class="size16" style="font-weight:500">{{item.tokenCur}}</span>
                      <span class="size14 c999"> /{{item.mainCur}}永续</span>
                    </span>

                  </div>
                </el-col>
                <el-col :span="4" class="item">
                  <div>{{item.price | SubStringZreo(6)}}</div>
                  <div class="ch">≈￥{{item.chPrice| SubStringZreo(2)}}</div>
                </el-col>
                <el-col :span="4" class="item flex flex_end flex_middle">
                  <div v-show="item.updown>0" class="updown green">+{{item.updown*100 | SubStringZreo(2)}}%</div>
                  <div v-show="item.updown<0" class="updown red">{{item.updown*100 | SubStringZreo(2)}}%</div>
                  <div v-show="item.updown==0" class="updown huise">{{item.updown*100 | SubStringZreo(2)}}%</div>
                  
                </el-col>
                
                <el-col :span="4" class="item">
                  <div>{{item.higPrice | SubStringZreo(6)}}</div>
                </el-col>
                <el-col :span="4" class="item">
                  <div>{{item.lowPrice | SubStringZreo(6)}}</div>
                </el-col>
                <el-col :span="4" class="item">
                  <div>{{parseInt(item.volume).toLocaleString()}}</div>
                </el-col>
              </el-row>
            
            </div>
          </div>

          <div v-else class="pad-l-r-40 pad-t-60">
           <nodata></nodata>
          </div>







        </el-col>
    
        <!-- <el-col :span="6">
        ferhyjh
        </el-col> -->
    </el-row>
    </div>

  </div>
</template>

<script>
import { mapActions } from "vuex";


export default {
  name: "market",
  components: {

  },
  data() {
    return {
      set:null,
      serchInput:'',
      indexTab:1,
      curType: "bibi", //当前tab所在项
      pairsList: [], //交易对列表

      tabs:[
        {title:'自选',val:'self'},
        {title:'全部行情',val:'all'},
        {title:'涨幅榜',val:'updown'},
        {title:'成交额榜',val:'vol'},
        {title:'新币榜',val:'newCoin'}
      ],
      tabsCoin:[
       
      ],
      sortList:[{
                    name: '交易对',
                    type: "0"
                },
                {
                    name: '最新价',
                    type: "2"
                },
                {
                    name: '涨幅',
                    type: "1"
                },
                     {
                    name: '最高价',
                    type: ""
                },
                     {
                    name: '最低价',
                    type: ""
                },
                     {
                    name: '24H量',
                    type: ""
                },
      ],
      currentVal:'all',
      currentValCoin:'',
      sortType: 0, //筛选分类所在项  0 交易对名称  1 最新价   2涨跌幅
      isSort: false, //true升序,false降序
      getCoinType:''
    };
  },
  computed: {
 
  },
  created() {
   
  },
  watch: {
    serchInput(val){
      let _this = this;
      let pairsList = this.pairsList;
      if(this.currentVal=='all'){
          this.getPairsByMainCur();
        }else if(this.currentVal=='self'){
          this.getSelfData()
        }else{
          this.getPairList()
      }
      if(val!=''){
         this.serchInput = val.toUpperCase();
         
         let liST = pairsList.filter(ele=>{
           return ele.tokenCur.indexOf(_this.serchInput)!=-1
         })
        //  console.log(liST);
        //  console.log(this.serchInput)
         this.pairsList = liST
         
      }
      if(val==''){
        // if(this.currentVal=='all'){
        //   this.getPairsByMainCur();
        // }else if(this.currentVal=='self'){
        //   this.getSelfData()
        // }else{
        //   this.getPairList()
        // }
      }
    }
  },
  mounted() {
    this.getMainCurs()

  },
  beforeDestroy() {
    let set = this.set;
    if (set) {
      clearTimeout(set);
    }
 
  },
  methods:{
    handerSerch(data){
      let _this = this;
      let pairsList = data;
    
      if(this.serchInput!=''){
        let liST = pairsList.filter(ele=>{
           return ele.tokenCur.indexOf(_this.serchInput)!=-1
         })
         this.pairsList = liST
      }else{
         this.pairsList = data;
      }
     
    },
    ...mapActions(["setPairsName", "setPairsName1", "setContractMulId"]),

    switchCoinName(item) {
      // console.log(item)
     
         if(this.curType=='bibi'){
            this.setPairsName(item.pairsName);
            setTimeout(()=>{
               this.$router.push({
                path:'/market'
              })
            },10)
           
         }else{
            this.setPairsName1(item.pairsName);
            setTimeout(()=>{
              this.$router.push({
                path:'/match'
              })
            },10)
  
         }

     
    },
    tabsFun(i){
       if(this.indexTab!=i){
          this.indexTab = i;
          this.sortType = 0; //筛选分类所在项  0 交易对名称  1 最新价   2涨跌幅
          this.isSort = false; //true升序,false降序
          if(i==1){
              this.currentVal = 'all';
              this.curType = "bibi" //当前tab所在项
          }else{
              this.curType = "contract" //当前tab所在项

          }
          this.getPairsByMainCur();

       }

    },
    
    bibiTabFunCoin(item){
      this.currentValCoin = item.val;

    },

    bibiTabFun(item){
      this.serchInput = '';
      this.currentVal = item.val;
      // console.log(this.currentVal)
      if(this.currentVal=='self'){

        if (!this.$util.isLogin()) {
            return;
        }
        this.getSelfData()
      }

      if(this.currentVal=='vol'){
          this.getCoinType = 'VOLUME';
          this.getPairList()
      }
       if(this.currentVal=='updown'){
          this.getCoinType = 'UPDOWN';
          this.getPairList()

      }
       if(this.currentVal=='newCoin'){
          this.getCoinType = 'PROJECT';
          this.getPairList()
      } 

      if(this.currentVal=='all'){
        this.sortType = 0; //筛选分类所在项  0 交易对名称  1 最新价   2涨跌幅
        this.isSort = false; //true升序,false降序
        this.getPairsByMainCur();
      }else{
           let set = this.set;
          if (set) {
            clearTimeout(set);
          }
      }
    },
    collectFun(item){


        if (!this.$util.isLogin()) {
            return;
        }

        let data = {
          member:this.$store.state.userId,
          pairs:item.id
        };


        // 添加自选

        // subOptional  //取消自选

      if(item.optional){
          this.$post1("member/member/subOptional", data).then(res => {
                if (res && res.status == "SUCCEED") {
                    if (res.result == true) {
                        this.Toast({
                           type: "success",
                           message: "取消收藏成功!"
                        })
                      
                        if(this.currentVal=='self'){
                          this.getSelfData()
                        }else{
                          this.getPairList()
                        }
                    } else {
                        this.Toast(res.errorMessage);
                    }
                } else {
                    this.Toast(res.errorMessage);
                }
        });
      }else{
            this.$post1("member/member/addOptional", data).then(res => {
                if (res && res.status == "SUCCEED") {
                    if (res.result == true) {
                        
                        this.Toast({
                           type: "success",
                           message: "收藏成功!"
                        })
                        if(this.currentVal=='self'){
                          this.getSelfData()
                        }else{
                          this.getPairList()
                        }
                    } else {
                        this.Toast(res.errorMessage);
                    }
                } else {
                    this.Toast(res.errorMessage);
                }
        });

      }



    },
    getSelfData(){
        if (this.set) {
            clearTimeout(this.set);
        }
        this.$get("member/member/getMemberOptional", {
            member: this.$store.state.userId
        }).then(res => {
                if (res && res.status == "SUCCEED") {
                        let dada = res.result;
                        dada.forEach(ele=>{
                            ele.optional = true
                        })
                        // this.pairsList = dada;
                        this.handerSerch(dada)

                } else {
                    this.Toast(res.errorMessage);
                }
              this.set = setTimeout(res => {
               
                this.getSelfData();
                
            }, 5000);
        });
    },
      //行情列表
    getPairList() {
        if (this.set) {
            clearTimeout(this.set);
        }
        let data = {
            member: this.$store.state.userId?this.$store.state.userId:'',
            getCoinType: this.getCoinType
        };
        //获取详情列表
        this.$get("data/data/getIndexCoin", data).then(res => {
            if (res && res.status == "SUCCEED") {
                // this.pairsList = res.result || [];
                this.handerSerch(res.result)


            }
            this.set = setTimeout(res => {
               
                this.getPairList();
                
            }, 5000);
        });
    },
    //获取交易对主币列表
    getMainCurs() {
        let subTabList = [];
        this.$get("data/data/getMainCurs", {}).then(res => {
            if (res && res.status == "SUCCEED") {
                if (res.result) {
                    res.result.forEach((item, i) => {
                        if (item) {
                            subTabList.push({
                                val: item,
                                title: item
                            });
                        }
                    });
                    this.currentValCoin = subTabList[0].val;
                    this.tabsCoin = subTabList || [];
                    this.getPairsByMainCur();
                }
            }
        });
    },
    //获取交易对列表
    getPairsByMainCur() {
       console.log(this.set)
       console.log(111)
        if (this.set) {
            clearTimeout(this.set);
        }

        let getCoinSort =
            this.sortType == 0 ?
            this.isSort ?
            "NAME_UP" :
            "NAME_DOWN" :
            this.sortType == 1 ?
            this.isSort ?
            "UP" :
            "DOWN" :
            this.isSort ?
            "PRICE_UP" :
            "PRICE_DOWN";
        this.$get("data/data/getCoinQuotation", {
            // mainCur: this.subTabList[this.curSubType].name,
            getCoinSort: getCoinSort,
            coinType: this.curType == "contract" ? "CONTRACT" : "SPOT"
        }).then(res => {
            if (res && res.status == "SUCCEED") {
                // this.pairsList = res.result || [];
                this.handerSerch(res.result)

            }
            this.set = setTimeout(() => {
                this.getPairsByMainCur();
            }, 5000);
        });
    },
      //筛选分类
    switchSortType(type) {
       
        if (type == this.sortType) {
            this.isSort = !this.isSort;
        } else {
            this.sortType = type;
            this.isSort = false;
        }

        //  console.log(this.isSort,this.sortType);

        if (this.set) {
            clearTimeout(this.set);
        }
        this.getPairsByMainCur();
    },
  }
};
</script>

<style lang="scss"  scoped>
.markets {
  .markets_tabs{
    height: 40px;
    line-height: 40px;
    background: #1b2945;
    border-top:1px solid #17232f;
    .item{
      width:145px;
     
      &:hover{
        color: $blue;
      }
    }

  }
  .tab_wrap{
    background: #1b2945;
    .bibi_tabs{
      background: #f2f6fa;
      .bibi_item{
        padding: 0 16px;
        height:40px;
        font-weight: 500;
        color:#596a7a;
        cursor: pointer;
      }
      .active{
        color: #1c242c;
        background: #fff;
      }
      .input{
      
        width:110px;
     
      }
    }
  }

  .tab_wrap_coin{
 
     
    .bibi_tabs_coin{
      border-bottom: 1px solid #e6ecf2;
      background: #fff;
    
      .bibi_item_coin{
        
        height:60px;
        font-weight: 500;
        color:#596a7a;
        span{
          display: block;
          width:70px;
          height:28px;
          line-height: 28px;
          margin:16px;
          border-radius:2px;
          cursor: pointer;
        }
        .active{
          color: #fff;
          background: #357ce1;
        }
       
      }
 
    
    }
  }
  .list_con{
    .sortList {
      // display: flex;
      // justify-content: space-between;
      font-size: 12px;
      color: #999;
      font-weight: 400;
      height:40px;
      line-height: 40px;
          box-shadow: 0 2px 4px rgba(28,36,44,.05);


      .items {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .icons {
              display: flex;
              flex-direction: column;
              margin-left: 12px;
          }

          .icons::before {
              content: "";
              width: 0;
              height: 0;
              border-bottom: 5px solid #999;
              border-right: 4px solid transparent;
              border-left: 4px solid transparent;
          }

          .icons::after {
              content: "";
              width: 0;
              height: 0;
              border-top: 5px solid #999;
              border-right: 4px solid transparent;
              border-left: 4px solid transparent;
              margin-top: 2px;
          }
      }
      .self_start{
        justify-content: flex-start;
      }

      .cur {
          color: #3d77e0;

          &.upper {
              .icons::before {
                  border-bottom-color: #4d6ec2;
              }
          }

          &.lower {
              .icons::after {
                  border-top-color: #4d6ec2;
              }
          }
      }
  }
  .list_wrap{
     height:500px;
     overflow: auto;
    .list_con_con{
      
      // line-height: 40px;
      font-size:14px;
      border-bottom: 1px solid #ededed;
      &:hover{
        background-color: rgba(242,246,250,.7);
      }
      .item{
          color:#1c242c;
          cursor: pointer;
          height:56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .ch{
            color: #9ca9b5;
            font-size: 12px;
            font-weight: 500;
          }
          .updown{
            
            width:90px;
            padding: 4px 14px;
            border-radius: 2px;
            text-align: center;

          }
          .huise{
            background-color: rgba(156,169,181,.1);;
          }
          .red{
            color: #ef5656;
            background-color: rgba(239,86,86,.1);
          }
          .green{
            color: #0da88b;
            background-color: rgba(13,168,139,.1);
          }
        
      }
    }
  }


  }



}
</style>
