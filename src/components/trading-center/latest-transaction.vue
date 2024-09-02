<template>
  <div class="latest">
    <div class="bor-b-051325">
      <el-row>
        <el-col :span="12">
          <div class="size14 cfff pad-t-2 v-left pad-l-15">最新成交</div>
        </el-col>
      </el-row>

      <el-row class="size12 pad-b-3">
        <el-col :span="6">
          <div class="v-left pad-l-15">时间</div>
        </el-col>
        <el-col :span="6">盘口</el-col>
        <el-col :span="6">价格</el-col>
        <el-col :span="6">数量</el-col>
      </el-row>
    </div>

    <div class="hei350 pad-t-b-5 scroll_bar">
      <el-row class="con size12 line20 c8fb6cc" :key="index" v-for="(item,index) in newNow">
        <el-col :span="6">
          <div class>{{item.time|sfm}}</div>
        </el-col>

        <el-col v-if="item.direction==0" class="green" :span="6">买入</el-col>
        <el-col v-else class="red" :span="6">卖出</el-col>

        <el-col
          v-if="main=='ETH' || main=='BTC' "
          :span="6"
        >{{filter.toFixed(Number(item.price),priceScale)}}</el-col>
        <el-col v-else :span="6">{{filter.toFixed(Number(item.price),priceScale)}}</el-col>

        <el-col class="v-right pad-r-5" :span="6">{{filter.toFixed(Number(item.total),amountScale)}}</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: ["newNow"],
  data() {
    return {
      main: null,
      amountScale: "", //数量小数位数
      priceScale: "" //价格小数位数
    };
  },
  created() {
    this.$hub.$on("pairsName", re => {
      this.main = re.split("/")[1];
    });
    this.$hub.$on("scale", res => {
      this.amountScale = res.amountScale;
      this.priceScale = res.priceScale;
          // console.log(res)

    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.latest {
}
</style>

