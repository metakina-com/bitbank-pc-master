<template>
  <div class="nodata pad-t-b-15">
     <img src="./../../assets/img/nodata/nodata.png" />
    <div class=" c888 size14 pad-l-10 titles">{{title}}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "No data"
    }
  },
  data() {
    return {};
  },
  computed: {},

  created() {},
  methods: {}
};
</script>
<style lang="scss" scope >
.nodata {
  min-height: 60px;
  text-align: center;
  width: 100%;
  display: flex;
  
  justify-content: center;
  // flex-direction: column;

  align-items: center;
  img{
    width:40px;
    height:40px
  }
  .titles{
    
    color: #909399;
  }
}
</style>
