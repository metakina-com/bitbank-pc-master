<template>
  <div class="orders marketRoader">
    <!-- 当前委托/历史委托 -->
    <div class="commission_total">
      <div class="commission_tab" style="display:flex;justify-content:space-between">
       <ul>
         <li
          :class="{active:orderIndex === 0}"
          @click="_setOrderIndex(0)"
        >{{ $t('message.currentCommission') }}</li>
        <!-- 當前持倉 -->
        <li
          :class="{active:orderIndex === 1}"
          @click="_setOrderIndex(1)"
        >{{ $t('message.momalCommission') }}</li>
       </ul>
        <div style="margin-right:100px"><el-button type="primary" size="mini" class="hei32" @click="yijianPingcang">{{ $t('contract.yjpc') }}</el-button></div>
      </div>
     
      <!-- 当前委托 -->
      <div  class="pad-l-r-20 hei400  overflow gundong" >
        <ul>
          <!-- 当前持仓 -->
          <div v-if="orderIndex==0">
            <el-table :data="chicangList">
              <el-table-column fixed prop="date" :label="$t('contract.jcsj')">
                <template slot-scope="scope">
                  <span>{{scope.row.createTime|yndhms('M')}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed prop="date" :label="$t('contract.pcsj')">
                <template slot-scope="scope">
                  <span>{{scope.row.matchTime|yndhms('M')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pairsName" :label="$t('message.pair')">
                <template  slot-scope="scope">
                    <!-- 多 -->
                  <span v-show="scope.row.tradeType=='OPEN_UP'" class="green_text ">
                    <span class="red_text" v-if="scope.row.orderState=='FINAL'">
                      {{scope.row.closeType=='BURST'?'多强平':'平多'}} {{scope.row.pairsName}}{{$t('contract.swap')}} {{scope.row.leverNum | toFixed(2)}}X
                    </span>
                    <span class="" v-else > 
                      <span  class="green_text ">{{scope.row.pairsName}}{{$t('contract.swap')}} {{scope.row.leverNum | toFixed(2)}}X</span>
                    </span>
                  </span>
                  <!-- 空 -->
                  <span v-show="scope.row.tradeType=='OPEN_DOWN'" class="green_text ">
                    <span class="green_text" v-if="scope.row.orderState=='FINAL'">
                      <span >
                      {{(scope.row.closeType=='BURST'?'空强平':'平空')}} {{scope.row.pairsName}}{{$t('contract.swap')}} {{scope.row.leverNum | toFixed(2)}}X
                    </span>
                    </span>
                    <span class="" v-else > 
                      <span  class="red_text ">{{scope.row.pairsName}}{{$t('contract.swap')}} {{scope.row.leverNum | toFixed(2)}}X</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="币种">
                <template slot-scope="scope">
                  <span>{{scope.row.pairsName}}</span>
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('contract.bzj')">
                <template slot-scope="scope">
                  <span>{{scope.row.margin | SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.kcj')">
                <template slot-scope="scope">
                  <span>{{scope.row.price|SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.pcj')">
                <template slot-scope="scope">
                  <span>{{scope.row.matchPrice | SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.yk')">
                <template slot-scope="scope">
                  <span v-if="scope.row.unProfitLoss > 0" style="color:green" class="green_text">{{scope.row.unProfitLoss|SubStringZreo(4)}}</span>
                  <span v-else class="" style="color:red">{{scope.row.unProfitLoss|SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.num')">
                <template slot-scope="scope">
                  <span>{{ scope.row.contractHands}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.handFee')">
                <template slot-scope="scope">
                  <span>{{ scope.row.takeFee|SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.fx')" fixed="right">
                <template slot-scope="scope">
                  <span class="green1" v-if="scope.row.tradeType.indexOf('UP')!=-1">{{ $t('contract.zuoduo') }}</span>
                  <span class="red1" v-else>{{$t('contract.zuokong')}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.caozuo')" fixed="right" min-width="150px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="pingcangClick(scope)"
                  >{{$t('contract.pc')}}</el-button>
                  <!-- <el-button
                    type="text"
                    @click="jiacangClick(scope)"
                  >加仓</el-button> -->
                </template>
              </el-table-column>
            </el-table>
k
            <div
              v-if="chicangList.lenght<=0"
              style="border: none;text-align: center;line-height: 16;color: #999"
            >
              <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                  <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7" />
                  <g fill-rule="nonzero" stroke="#D9D9D9">
                    <path
                      d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
                    />
                    <path
                      d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                      fill="#FAFAFA"
                    />
                  </g>
                </g>
              </svg>
              <span
                style="position: relative;top:24px;left:-63px;text-align: center;color:#9bacbd"
              >NO DATA</span>
            </div>
          </div>
          <div v-else>
            <el-table :data="entrustList">
              <el-table-column fixed prop="date" :label="$t('message.time')">
                <template slot-scope="scope">
                  <span>{{scope.row.createTime|yndhms('M')}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.pair')">
                <template  slot-scope="scope">
                  <span v-show="scope.row.tradeType=='OPEN_UP'" class="green_text ">{{$t('contract.zuoduo')}} {{scope.row.pairsName}}{{$t('contract.swap')}}{{scope.row.avgLevel | toFixed(2)}}X</span>
                  <span v-show="scope.row.tradeType=='OPEN_DOWN'" class="green_text red_text">{{$t('contract.zuokong')}} {{scope.row.pairsName}}{{$t('contract.swap')}}{{scope.row.avgLevel | toFixed(2)}}X</span>
                  <span v-show="scope.row.tradeType=='CLOSE_UP'" class="green_text ">
                    <span class="red_text">
                      {{scope.row.closeType=='BURST'?'多强平':'平多'}} {{scope.row.pairsName}}{{$t('contract.swap')}}{{scope.row.avgLevel | toFixed(2)}}X
                    </span>
                  </span>
                  <span v-show="scope.row.tradeType=='OPEN_DOWN'" class="green_text ">
                    <span class="red_text ">
                    {{$t('contract.zuokong')}} {{scope.row.pairsName}}{{$t('contract.swap')}}{{scope.row.avgLevel | toFixed(2)}}X
                    </span>
                  </span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="币种">
                <template slot-scope="scope">
                  <span>{{scope.row.pairsName}}</span>
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('contract.bzj')">
                <template slot-scope="scope">
                  <span>{{scope.row.margin | SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.kcj')">
                <template slot-scope="scope">
                  <span>{{scope.row.price|SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.now_price')">
                <template slot-scope="scope">
                  <span>{{scope.row.currentPrice | SubStringZreo(4)}}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('contract.zhisun')">
                <template slot-scope="scope">
                  <span>{{scope.row.ordPrice|SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.zhiying')">
                <template slot-scope="scope">
                  <span>{{scope.row.triggerPrice|SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.yk')">
                <template slot-scope="scope">
                  <span class="green_text" v-if="scope.row.unProfitLoss > 0">{{scope.row.unProfitLoss|SubStringZreo(4)}}</span>
                  <span class="red_text" v-else>{{scope.row.unProfitLoss|SubStringZreo(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.handNum')">
                <template slot-scope="scope">
                  <span>{{ scope.row.contractHands}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.fx')" fixed="right">
                <template slot-scope="scope">
                  <span class="red" v-show="scope.row.tradeType=='OPEN_DOWN'">{{$t('contract.zuokong')}}</span>
                  <span class="green" v-show="scope.row.tradeType=='OPEN_UP'">{{$t('contract.zuoduo')}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('contract.caozuo')" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="cancelorder(scope.row.id)"
                  >{{$t('message.cancel') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ul>
      </div>

      <el-dialog
        :title="$t('contract.pc') + pingcangData.pairsName"
        :visible.sync="PCdialogVisible"
        width="60%">
        <div>
          <div><span>{{$t('contract.jyd')}}</span><span style="font-size:bold">{{pingcangData.pairsName}}</span></div>
          <div>
            <span>{{$t('contract.yjsy')}}</span>
            <span>{{pingcangData.unProfitLoss}}</span>
          </div>
          <!-- <div><span>指数价格</span><span>{{pingcangData.indexPrice}}</span></div> -->
          <div class="" style="margin-bottom:10px">
            <el-input v-model="shouNumPing" :placeholder="请输入平仓手数"></el-input>
          </div>
          <div class="">
                <div class="progress_bar">
                  <div
                    class="progress_bar_item"
                    :class="currentProgressBarPing == 1 ? 'bar_select' : ''"
                    @click="changeSlidePingHands(25, 1)"
                  >
                    25%
                  </div>
                  <div
                    class="progress_bar_item"
                    :class="currentProgressBarPing == 2 ? 'bar_select' : ''"
                    @click="changeSlidePingHands(50, 2)"
                  >
                    50%
                  </div>
                  <div
                    class="progress_bar_item"
                    :class="currentProgressBarPing == 3 ? 'bar_select' : ''"
                    @click="changeSlidePingHands(75, 3)"
                  >
                    75%
                  </div>
                  <div
                    class="progress_bar_item"
                    :class="currentProgressBarPing == 4 ? 'bar_select' : ''"
                    @click="changeSlidePingHands(100, 4)"
                  >
                    100%
                  </div>
                </div>
              </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="PCdialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="pingcangSub">{{ $t('common.confirm') }}</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="$t('contract.jiacang')"
        :visible.sync="JCdialogVisible"
        width="60%">
        <div>
          <div><span>{{ $t('contract.jyd') }}</span><span style="font-size:bold">{{pingcangData.pairsName}}</span></div>
          <div>
            <span>{{$t('contract.yjsy')}}</span>
            <span>{{pingcangData.unProfitLoss}}</span>
          </div>
          <!-- <div><span>指数价格</span><span>{{pingcangData.indexPrice}}</span></div> -->
          <div class="" style="margin-bottom:10px">
            <el-input v-model="shouNumPing" placeholder="请输入平仓手数"></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="JCdialogVisible = false">{{$t('common.cancel')}}</el-button>
          <el-button type="primary" @click="jiacangSub">{{ $t('contract.confirm') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
export default {
  name: "market",
  data() {
    return {
      PCdialogVisible:false,//平仓提示框
      JCdialogVisible:false,//加仓提示

      // 禁止点击
      currentProgressBarPing:4,
      noClick: false,
      // 当前选中
      orderIndex: 0,
      // 当前委托 历史委托
      orderList: [],
      // 总数 当前委托 历史委托
      totalList: [0, 0],
      timer1: null, //获取当前委托定时
      entrustList: [], //委托列表
      chicangList: [], //当前持仓
      pingcangData:{},//平仓数据

      shouNumPing:'',//pingcang手数
    };
  },
  computed: {
    i18n() {
      return $t("message");
    },
    currentPairsName() {
      return this.$store.state.pairsName;
    },
    currentPrice() {
      return this.$store.state.currentPrice;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  watch: {
    currentPairsName: function (val) {
      if (this.timer1) {
        clearTimeout(this.timer1);
      }
      if (this.isLogin) {
        if (this.orderIndex == 0) {
          this.getEntrustList(1);
        } else {
          this.getchicangList(0);
        }
      }
    },
    isLogin(val) {
      this.isLogin = val;
    },
  },
  created() {
    if (this.$store.state.isLogin) {
      if (this.orderIndex == 0) {
        this.getchicangList(1);
      } else {
        this.getEntrustList(1);
      }
    } else {
      (this.entrustList = []), //委托列表
        (this.chicangList = []); //历史记录
    }
    this.$hub.$on("getList", (res) => {
      window.clearTimeout(this.timer1);
      window.clearTimeout(this.timer2);
      if (this.isLogin) {
        if (this.orderIndex == 0) {
          this.getEntrustList();
        } else {
          this.getchicangList();
        }
      }
    });
    // this._getOrderList();
  },
  methods: {
    // 一键平仓
    yijianPingcang() {
      this.$confirm(this.$t('contract.pcTips1'), this.$t('contract.tx'), {
          confirmButtonText: this.$t('common.cancel'),
          cancelButtonText: this.$t('common.confirm'),
          type: 'warning',
          center: true
        }).then(() => {
          let data = {
            member: this.$store.state.userId,
            pairsName: "",
            hands: "",
            id: "",
            isGroup:'NOGROUP'
          };
          // console.log(data, "一键平仓");
          this.$post1("contract/contractOrder/closeContract", data).then(
            (res) => {
              if (res && res.status == "SUCCEED") {
                this.Toast(this.$t('contract.pccg'));
                this.getchicangList(this.currentName);
              } else {
                this.Toast(res.errorMessage);
              }
            }
          );
        })
    },
    pingcangSub(){
      console.log(this.pingcangData,'pingcangData')
      let httpData = {
        id: "",
        hands: this.shouNumPing,
        member: this.$store.state.userId,
        pairsName: this.pingcangData.pairsName,
        tradeType: this.pingcangData.tradeType,
      };
      // console.log(httpData);
      if (this.pingcangData && this.pingcangData.isCompany == "张") {
        httpData.hands =
          httpData.hands /
          (this.pingcangData.pairsName.split("/")[0] == "BTC" ? 100 : 10);
      } else {
      }
      // if (this.pingcangData.tradeType == "OPEN_UP") {
      //   //平多
      //   httpData.tradeType = "OPEN_UP";
      //   httpData.pairsName = this.pairsName;
      // } else if (type == "OPEN_DOWN") {
      //   //平空
      //   httpData.pairsName = this.pairsName;
      //   httpData.tradeType = "OPEN_DOWN";
      // }
      httpData.id = this.pingcangData.id ? this.pingcangData.id : "";
      if (httpData.hands == 0) {
        this.Toast(this.$t('contract.tips2'));
        return;
      }
      // if (this.isMerge) {
      //   httpData.isGroup = "GROUP";
      // } else {
        httpData.isGroup = "NOGROUP";
      // }
      // console.log(httpData, "平仓");
      //  平仓
      this.$post1("contract/contractOrder/closeContract", httpData).then(
        (res) => {
          if (res && res.status == "SUCCEED") {
            let data = res.result;
            this.$util.Toast(this.$t('contract.pccg'), "success");
            this.PCdialogVisible = false;
            // this.getContractHandsMax(); // 获取最大可平手数
          } else {
            this.Toast(res.errorMessage);
          }
        }
      );
    },
    pingcangClick(row){
      this.pingcangData = row.row;
      // console.log(this.pingcangData,'this.pingcangData',this.currentProgressBarPing,)
      if(this.currentProgressBarPing == 1){
        this.shouNumPing = this.pingcangData.isContractHands * 0.25
      }else if(this.currentProgressBarPing == 2){
        this.shouNumPing = this.pingcangData.isContractHands * 0.5
      }else if(this.currentProgressBarPing == 3){
        this.shouNumPing  = this.pingcangData.isContractHands * 0.75
      }else if(this.currentProgressBarPing == 4){
        this.shouNumPing = this.pingcangData.isContractHands
      }
      this.PCdialogVisible = true;
    },
    jiacangClick(row){
      this.jiacangData = row.row;
      this.JCdialogVisible = true;
    },
    jiacangSub(){
      console.log(this.jiacangData,'jiacang')
    },
    
    //获取委托列表
    getEntrustList(type) {
      let pairsName = this.currentPairsName;
      this.$get("contract/contractOrder/getContractEntrust", {
        pairsName: this.currentPairsName,
        member: this.$store.state.userId,
      }).then((res) => {
        if (res && res.status == "SUCCEED") {
          let data = res.result;
          // console.log(data, "委托单列表");
          this.entrustList = res.result.entrust;
          this.additionalEntrust = res.result.additionalEntrust;
        }
      });
    },
   
    //获取当前持仓
    getchicangList(type) {
      var loading;
      if (type) {
        // loading = this.$util.showLoading();
      }
      this.$get("contract/contractOrder/getContractOrder", {
      // this.$get("entrust/entrust/getchicangList", {
        member: this.$store.state.userId,
        pairsName: '',
        type: "NOGROUP"
      })
        .then((res) => {
          // if (loading) loading.close();
          if (res && res.status == "SUCCEED") {
            this.chicangList = res.result || [];
            if (this.isLogin) {
              this.timer1 = setTimeout((res) => {
                this.getchicangList();
              }, 5000);
            }
          }
        })
        .catch((err) => {
          // if (loading) loading.close();
          // if (this.isLogin) {
          //   this.getchicangList();
          // }
        });
    },
    changeSlidePingHands(val,index){
      this.currentProgressBarPing = index;
      if(this.currentProgressBarPing == 1){
        this.shouNumPing = this.pingcangData.contractHands * 0.25
      }else if(this.currentProgressBarPing == 2){
        this.shouNumPing = this.pingcangData.contractHands * 0.5
      }else if(this.currentProgressBarPing == 3){
        this.shouNumPing  = this.pingcangData.contractHands * 0.75
      }else if(this.currentProgressBarPing == 4){
        this.shouNumPing = this.pingcangData.contractHands
      }
    },
    //撤单
    cancelorder(id) {
      if (!this.$util.isLogin()) {
        return;
      }
      this.$confirm(this.$t('contract.tips3'), this.$t('contract.tx'))
        .then(() => {
          //   this.$util.showLoading();
          let loading = this.$util.showLoading();
          this.$post1("contract/contractOrder/closeEntrust", {
            id: id,
            member: this.$store.state.userId,
          })
            .then((res) => {
              //   this.Toast.clear();
              loading.close();
              if (res && res.status == "SUCCEED") {
                if (res.result == true) {
                  this.$util.Toast(this.$t('contract.tips4'), "success");
                  this.entrustList.forEach((item, i) => {
                    if (item.id == id) {
                      this.entrustList.splice(i, 1);
                    }
                  });
                }
              } else {
                this.$util.Toast(res.errorMessage);
              }
            })
            .catch((err) => {
              //   this.Toast.clear();
              loading.close();
            });
        })
        .catch(() => {});
    },
    // 普通撤单
    cancelorder1(id) {
      if (!this.$util.isLogin()) {
        return;
      }
      this.$confirm(this.$t('contract.tips3'), this.$t('contract.tx'))
        .then(() => {
          //   this.$util.showLoading();
          let loading = this.$util.showLoading();
          this.$post1("contract/contractOrder/closeEntrust", {
            id:id,
            member: this.$store.state.userId,
          })
            .then((res) => {
              //   this.Toast.clear();
              loading.close();
              if (res && res.status == "SUCCEED") {
                if (res.result == true) {
                  this.$util.Toast(this.$t('contract.tips4'), "success");
                  this.chicangList.forEach((item, i) => {
                    if (item.id == id) {
                      this.chicangList.splice(i, 1);
                    }
                  });
                }
              } else {
                this.$util.Toast(res.errorMessage);
              }
            })
            .catch((err) => {
              //   this.Toast.clear();
              loading.close();
            });
        })
        .catch(() => {});
    },
    // 撤单
    chedanFun(item) {
      let data = {
        id: item.id,
        member: this.$store.state.userId,
      };
      this.$post1("contract/contractOrder/closeEntrust", data).then((res) => {
        if (res && res.status == "SUCCEED") {
          this.Toast(this.$t('contract.tips4'));
          setTimeout(() => {
            this.getPutong(this.currentName, this.currentType); // 全部类型  普通委托
          }, 500);
        } else if (res.status == "FAILED") {
          this.Toast(res.errorMessage);
        }
      });
    },
    // 取消委托 当前委托/历史委托
    _cancelOrder(index) {
      if (this.noClick) {
        return;
      }
      let order = this.orderList[this.orderIndex];
    },
    // 切换 当前委托/历史委托
    _setOrderIndex(index) {
      if (!this.$util.isLogin()) {
        return;
      }
      if (this.orderIndex !== index) {
        if (this.timer1) clearTimeout(this.timer1);
        this.orderIndex = index;
        if (index == 0) {
          this.getchicangList(1); //持仓列表
        } else {
          this.getEntrustList(1); //委托列表

        }
      }
    },
  },
  destroyed() {
    if (this.timer1) {
      clearTimeout(this.timer1);
    }
  },
};
</script>
<style lang="less">
.marketRoader {
  .el-table,
  .el-table__expanded-cell {
    background: transparent !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #33363e;
  }
  .el-table {
    color: rgb(176, 184, 219);
  }
  .el-table th,
  .el-table tr {
    background: transparent !important;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: #606266 !important;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    background: #606266 !important;
  }
  .el-table tbody tr:hover > td {
    background-color: transparent !important;
  }
  .hover-row {
    background: transparent !important;
  }
  .el-table tbody tr.hover-row > td {
    background-color: transparent;
  }
}
</style>
<style lang="less" scoped>
.orders {
  //   background: #252732;

  // 当前委托 历史委托
  .commission_total {
    min-height: 280px;

    .commission_tab {
      //   background: #292d39;
      height: 46px;
      line-height: 46px;
      font-weight: 500;
      color: #9bacbd;
      font-size: 14px;
      cursor: pointer;

      li {
        display: inline-block;
        padding: 0 20px;

        &.active {
          color: #17a7f3;
          //   background-color: #252732;
        }
      }
    }

    .commTabalBar {
      height: 46px;
      line-height: 46px;
      font-weight: 500;
      color: #9bacbd;
      font-size: 14px;
      padding: 0 20px;
      display: flex;
    }

    .comm_last_child {
      width: 10%;
    }

    .comm_last_child:hover {
      cursor: pointer;
      color: #17a7f3;
    }

    .activeTab:hover {
      //   background: #292d39;
      //   color: #fff;
    }
  }
    .progress_bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .progress_bar_item {
      width: 60px;
      height: 30px;
      border: 1px solid #a9a7aa;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .bar_select {
      background-color: #fcd425;
      border: 1px solid #fcd425;
    }
}
</style>
