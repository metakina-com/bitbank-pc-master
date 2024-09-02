<template>
  <div class="ddd" style="position: relative;width:100%">
    <el-select v-model="value1" placeholder="请选择" @input="change($event)" style="width: 100%;">
      <!-- <el-option v-for="(item,index) in options" :key="item.value" :label="`+${item.n}${item.c}(${item.o})`" :value="index"> -->
      <el-option
        v-for="item in balanceList"
        :key="item.id"
        :label="item.currency"
        :value="item.currency"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "choose-coin",
  props:['balanceList',"currency"],
  data() {
    return {
      value1:this.currency
    };
  },
  watch:{

  },
  mounted() {
  },
  methods: {
    change(val) {
      this.$emit("input", val);
    },
  }
};
</script>
<style scoped>
/* 
    max-width: 80%;
    left: 15px; */
.ddd .el-select-dropdown {
  position: absolute !important;
  width: 200px;
}

/* input {
    border: none !important;
    border-bottom: 1px solid #F4F8FD !important;
    padding-left: 0 !important;
  } */
</style>