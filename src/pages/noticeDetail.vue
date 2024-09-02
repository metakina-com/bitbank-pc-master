<template>
  <div class="notices  bg_main_fff">
    <div class="auto_center bg_fff list_con">
      <el-row class="min-hei500 c666 ">
        <el-col :span="4" class="notice_left">
          <div class="item " v-for="item in noticeList" :key="item.id" :class="currentId==item.id?'active':''" @click="currentFun(item.id)">
            {{item.title}}
          </div>

        </el-col>
    
        <el-col :span="20" class="notoce_right ">
          <div class="size32 bold400 title pad-10">{{currentDetail.title}}</div>
          <div v-html="currentDetail.content" class="pad-10 size16"></div>
        </el-col> 
    </el-row>
    </div>


    <!--   
          <div v-else class="pad-l-r-40 pad-t-60">
           <nodata></nodata>
          </div> -->

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
      noticeList:[],
      currentId:'',
      currentDetail:{},
    };
  },
  computed: {
 
  },
  created() {
   
  },
  watch: {
  
  },
  mounted() {
    this.getNoticeList();

     
  },
  beforeDestroy() {
  
 
  },
  methods:{
  
    ...mapActions(["setPairsName", "setPairsName1", "setContractMulId"]),
    getNoticeList(){
      let data = {
        noticeType: "OFFICIAL",
        global: "CHINESE_SIM",
        page:1,
        size:100
      };
      this.$get("data/data/getNotices", data).then(res => {
        if (res && res.status == "SUCCEED") {
          this.noticeList = res.result || [];
              if(this.$route.query.id){
                this.currentId = this.$route.query.id;
                this.currentDetail = this.noticeList.find(ele=>ele.id==this.currentId);
              }else{
                this.currentId = this.noticeList[0].id;
                this.currentDetail = this.noticeList[0];
              }
        }
      });
    },
    currentFun(id){
      this.currentId = id;
      console.log(id)
      this.currentDetail = this.noticeList.find(ele=>ele.id==this.currentId);
      // this.$router.push({
      //   path:'/noticeDetail',
      //   query:{
      //     id
      //   }
      // })
      
    }


  }
};
</script>

<style lang="scss"  scoped>
.notices {
  padding: 60px 0;
  .notice_left{
    font-size: 14px;
    .item{
      cursor: pointer;
      min-height:40px;
      border-radius: 4px;
      color: rgba(28, 36, 44, 1);
      font-weight: 300;
      margin-bottom: 10px;
      padding: 10px;
      &:hover{
            background-color: rgba(53, 124, 225, 1);
            color: #FFFFFF;
      }
    }
    .active{
          background-color: rgba(53, 124, 225, 1);
          color: #FFFFFF;
    }
  }
  .notoce_right{
    padding: 0 30px;
    .title{
      color: rgba(21, 27, 33, 1);
    }
  }


  }




</style>
