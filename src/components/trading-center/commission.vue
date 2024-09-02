<template>
  <div class="commission">
    <div class="title size14">
      <el-row class="line40 hei40 ">
        <el-col :span="12">
          <el-row style="width:300px" class="pointer">
            <div @click="tabs(1)">
              <el-col :class="active==1?'active':''" :span="12">限价交易</el-col>
            </div>
            <div @click="tabs(2)">
              <el-col :class="active==2?'active':''" :span="12">市价交易</el-col>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12"  class="v-right blue pad-r-40 size14">
            <span class="pointer" @click="torate()">
                费率
            </span>
        </el-col>
      </el-row>
      <!-- 限价交易 -->
      <el-row class="min-hei340 pad-t-10 pad-l-r-50" v-if="active==1">
        <el-col :span="12" class="pad-r-40">
          <!-- 限价买入 -->
          <commission :type="1"></commission>
        </el-col>
        <el-col :span="12" class="pad-l-40">
          <!-- 限价卖出 -->
          <commission :type="2"></commission>
        </el-col>
      </el-row>
      <!-- 市价交易 -->
      <el-row class="min-hei340 pad-t-10 pad-l-r-50" v-else>
        <el-col :span="12" class="pad-r-40">
          <!-- 市价买入 -->
          <commission :type="3"></commission>
        </el-col>
        <el-col :span="12" class="pad-l-40">
          <!-- 市价卖出 -->
          <commission :type="4"></commission>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import commission from "@/components/commission/commission";
export default {
  components: {
    commission
  },
  data() {
    return {
      active: 1
    };
  },
  mounted() {
    //  //console.log(this.active);
  },
  methods: {
    tabs(val) {
      //    //console.log(val);
      this.active = val;
      this.$hub.$emit("initCommitent", "");
    },
    torate(){
        this.$router.push({
            name:'rate'
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.commission {
  .title {
    .active {
      background: #062853;
    }
  }
}
</style>

