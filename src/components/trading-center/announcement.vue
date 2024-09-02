<template>
  <div class="announcement">
    <div class="bor-b-051325 hei40 line40 pad-l-20 size14 v-left">公告</div>
    <div class="hei360 pad-t-b-5 scroll_bar pointer">
      <!-- <el-row class="pad-t-b-20 c8fb6cc bor-b" :key="index" v-for="(item,index) in newslist">
        <div @click="toDetails(item,'news')">
          <el-col class="v-left pad-l-20 size14" :span="14" style="overflow:hidden">{{item.title}}</el-col>

          <el-col class="v-right pad-r-20 size12" :span="10">{{item.updateTime | nyrsfm}}</el-col>
        </div>
      </el-row> -->

      <el-row class="pad-t-b-20 c8fb6cc bor-b" :key="index" v-for="(item,index) in list">
        <div @click="toDetails(item,'')">
          <el-col class="v-left pad-l-20 size12" :span="14" style="overflow:hidden">{{item.title}}</el-col>
          <el-col class="v-right pad-r-20 size12" :span="10">{{item.updateTime | nyrsfm}}</el-col>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // newslist: [],
      list: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.api.getAnnounce().then(res => {
        this.list = res;
      });

      // this.api.getAnnounceNew().then(res => {
      //   this.newslist = res;
      // });
    },
    // 跳转公告详情
    toDetails(item) {
      //console.log(item);
      this.$router.push({
        name: "advisotyNotice",
        params: {
          pid: item.id,
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.announcement {
  .bor-b {
    border-bottom: 1px solid #0e284e;
  }
}
</style>

