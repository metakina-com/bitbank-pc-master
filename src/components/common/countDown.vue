<template>
  <div class="countTime" v-if="type">{{timer*1000|hms('m')}}</div>
  <div class="countTime" v-else>{{timer}}</div>
</template>
<script>
export default {
  props: ["time", "type"],
  data() {
    return {
      setInt: null,
      timer: 0,
    };
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      this.timer = this.time - 0;
      this.setInt = setInterval((res) => {
        this.timer = this.timer - 1;
        if (this.timer <= 0) {
          this.$emit("finish");
          clearInterval(this.setInt);
        }
      }, 1000);
    },
    stop() {
      clearInterval(this.setInt);
    },
  },
};
</script>
<style scoped lang='less'>
</style>
