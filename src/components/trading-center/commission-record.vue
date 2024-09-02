<template>
  <div class="commission_record">
    <div class="title hei40  line40 size14">
      <el-row>
        <el-col :span="16">
          <el-row style="width:300px" class="pointer">
            <div @click="tabs(1)">
              <el-col :class="active==1?'active':''" :span="12">当前委托</el-col>
            </div>
            <div @click="tabs(2)">
              <el-col :class="active==2?'active':''" :span="12">历史委托</el-col>
            </div>
          </el-row>
        </el-col>
        <el-col :span="8" class="v-right pad-r-20">
          <router-link to="Order?index=0">
            <span class="blue pointer">全部</span>
          </router-link>
        </el-col>
        <!-- <el-col :span="12" class="v-right blue pad-r-40  pointer">费率</el-col> -->
      </el-row>
    </div>
    <!-- currentryData 当前 -->
    <div class="content pad-t-b-10 pad-l-40 pad-r-20 v-left" v-if="active==1">
      <el-row class="hei40 line40 cb1efff size12">
        <el-col :span="4">委托时间</el-col>
        <el-col :span="2">交易对</el-col>
        <el-col :span="2">盘口</el-col>
        <el-col :span="3">价格</el-col>

        <el-col :span="3">委托量</el-col>
        <el-col :span="3">委托总额</el-col>
        <el-col :span="3">成交量</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="2" class="v-right">操作</el-col>
      </el-row>

      <div class="scroll_bar hei400">
        <div v-if="currentryData.length<=0" class="pad-t-b-100 v-center">
           <nodata></nodata>
        </div>
        <el-row
          v-else
          class="line36 c8fb6cc size14"
          v-for="(item,index) in currentryData"
          :key="index"
        >
          <el-col :span="4">{{item.time|nyrsfm}}</el-col>
          <el-col :span="2" class="size12">
            <span class="size14 cfff">{{util.toU(item.secondary_cur)}}</span>/
            <span>{{util.toU(item.main_cur)}}</span>
          </el-col>
          <el-col :span="2">
            <span v-if="item.direction==0" class="green">买入</span>
            <span v-else class="red">卖出</span>
          </el-col>
          <el-col :span="3">{{filter.toFixed(item.price,4)}}</el-col>
          <el-col :span="3">{{filter.toFixed(item.total,4)}}</el-col>
          <el-col :span="3">{{filter.toFixed(item.price*item.total,4)}}</el-col>
          <el-col :span="3">{{item.entrustNum}}</el-col>

          <el-col v-if="item.entrustNum==0" :span="2">未成交</el-col>
          <el-col v-else-if="item.entrustNum!=item.total" :span="2">部分成交</el-col>
          <el-col v-else :span="2">已成交</el-col>

          <!-- <el-col :span="2" class="pointer c00a2ff">撤销</el-col> -->
          <div @click="delteRecord(item)" class="v-right">
            <el-col :span="2" class="pointer c00a2ff">撤销</el-col>
          </div>
        </el-row>
      </div>
      <!-- <div class="hei60  v-center pad-t-15">
              <el-pagination
                background
              
                prev-text="上一页"
                next-text="下一页"
                pager-count="5"
                layout="prev, pager, next"
                :total="200">
                </el-pagination>
      </div>-->
    </div>
    <!-- 历史 -->
    <div class="content pad-t-b-10 pad-l-40 pad-r-20 v-left" v-else>
      <el-row class="hei40 line40 cb1efff size12">
        <el-col :span="3">委托时间</el-col>
        <el-col :span="3">交易对</el-col>
        <el-col :span="3">盘口</el-col>
        <el-col :span="3">委托价格</el-col>
        <el-col :span="3">成交价格</el-col>

        <el-col :span="3">成交量</el-col>
        <el-col :span="3">成交总额</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="1">详情</el-col>
      </el-row>

      <div class="scroll_bar hei400">
        <div v-if="hisroryData.length<=0" class="pad-t-b-100 v-center">
       
           <nodata></nodata>

        </div>
        <el-row
          v-else
          class="line36 c8fb6cc size14"
          v-for="(item,index) in hisroryData"
          :key="index"
        >
          <el-col :span="3">{{item.create_time|nyrsfm}}</el-col>
          <el-col :span="3" class="size12">
            <span class="size14 cfff">{{util.toU(item.secondary_cur)}}</span>/
            <span>{{util.toU(item.main_cur)}}</span>
          </el-col>
          <el-col :span="3">
            <span v-if="item.direction==0" class="green">买入</span>
            <span v-else class="red">卖出</span>
          </el-col>
          <el-col :span="3">{{item.price}}</el-col>
          <el-col :span="3">{{item.dealPrice}}</el-col>

          <el-col :span="3">{{item.total}}</el-col>
          <el-col :span="3">{{filter.toFixed(item.price*item.total,4)}}</el-col>

          <el-col :span="2">
            <span v-if="item.status==0">交易中</span>
            <span v-else-if="item.status==1">已成交</span>
            <span v-else>已撤销</span>
          </el-col>
          <el-col :span="1">
            <span class="pointer" @click="lookhistory(item)">查看</span>
          </el-col>
        </el-row>
      </div>
      <div v-if="hisroryData.length>0" class="hei60 v-center pad-t-15">
        <el-pagination
          background
          page-size="10"
          @current-change="currentPages"
          prev-text="上一页"
          next-text="下一页"
          pager-count="5"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 历史委托详情 -->
    <el-dialog title="成交明细" :visible.sync="historyxiangqing">
      <el-table :data="historyxiangqinglist" height="250" :empty-text="$t('common.nodata')">
        <el-table-column property="create_time" label="日期" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.create_time |nyrsfm }}</span>
          </template>
        </el-table-column>
        <el-table-column property="pairs_name" label="交易对" width="200"></el-table-column>
        <el-table-column property="price" label="价格" width="200"></el-table-column>
        <el-table-column property="total" label="数量" width="200">
          <template slot-scope="scope">{{scope.row.total}}</template>
        </el-table-column>
        <el-table-column label="盘口" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.direction==0">买入</span>
            <span v-else>卖出</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      timer: null,
      currentPage: 1,
      hisroryData: [],
      currentryData: [
        // {
        //   total: 1.0,
        //   create_time: 1554088878000,
        //   user_id: 2,
        //   price: 20044.0,
        //   direction: "1",
        //   status: "2"
        // }
      ],
      historyxiangqing: false,
      historyxiangqinglist: []
    };
  },
  created() {
    let _t = this;
    this.$hub.$on("toReloadRecord", re => {
      if (this.active == 1) {
        this.getRecord("0");
      } else {
        this.currentPage = 1;
        this.getRecord("1");
      }
    });

    if (this.$store.state.isLogin) {
      this.timer = setInterval(() => {
        _t.getRecord("0");
      }, 5000);
    }
  },
  mounted() {
    //console.log(this.active);
    if (this.$store.state.isLogin) {
      this.getRecord("0");
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    tabs(val) {
      //1 当前 2 历史

      if (window.sessionStorage.getItem("isLogin")) {
        //console.log(val);
        this.active = val;
        if (val == 1) {
          this.getRecord("0");
        } else {
          this.currentPage = 1;
          this.getRecord("1");
        }
      } else {
        this.$message.error("请先登录");
      }
    },
    currentPages(val) {
      this.currentPage = val;
      this.getRecord("1");
    },
    getRecord(type) {
      //状态 0：当前委托 1：历史委托

      let perise = this.util.getSession("pairsName");
      this.api
        .commissionRecord({
          main_cur: perise.split("/")[1].toLowerCase(),
          secondary_cur: perise.split("/")[0].toLowerCase(),
          userId: this.util.getUser().id,
          page: this.currentPage + "",
          size: "10",
          status: type + ""
        })
        .then(res => {
          // alert(type)
          //console.log(res)
          if (type == 0) {
            // let data1 = []

            // res.data.forEach((element,i) => {
            //      data1.push(JSON.parse(element))
            // });

            this.currentryData = res.data;

            //console.log(data1)
          } else {
            //  let data1 = []

            //  data1 = JSON.parse(res.data)
            this.hisroryData = res.data;
            this.total = res.total;
          }
        });
    },
    //    撤单
    delteRecord(item) {
      console.log(item);
      this.api
        .delteRecord({
          entrustnum: item.entrustNum,
          entrustNum: item.entrustNum, //委托量
          user_id: this.util.getUser().id, //String	是	用户ID
          main_cur: item.main_cur, //String	是	交易对
          secondary_cur: item.secondary_cur, //String	是	币种
          direction: item.direction, //String	是	买1卖2
          price: item.price, //String	是	价格
          total: item.total, //String	是	数量
          id: item.id, //String	是	撤销ID
          time: item.time //String	是	时间
        })
        .then(res => {
          this.$message.success("操作成功");
          this.$hub.$emit("initCommitent", "");
          setTimeout(() => {
            if (this.$store.state.isLogin) {
              this.getRecord("0");
            }
          }, 100);
        });
    },
    lookhistory(item) {
      let params = {
        entrustId: item.id
      };
      this.api.getEntrust(params).then(res => {
        (this.historyxiangqinglist = res), (this.historyxiangqing = true);
      });
    }
  }
};
</script>

<style lang="scss" >
.commission_record {
  .title {
    .active {
      background: #062853;
    }
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: $bg_block_t;
    color: #fff;
    border: 1px solid #093c80;
    border-radius: 2px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #357ce1;
    color: #fff;
  }
}
</style>

