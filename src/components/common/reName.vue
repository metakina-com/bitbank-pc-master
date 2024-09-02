<template>
  <div class="reName">
    <el-dialog title="设置昵称" :visible.sync="show" class="updateBox" width="380px" height="310px" 
      @close="close" :close-on-click-modal="false">
      <div class="content flex flex-column size14 c_222 left_text align-center">
        <img src="../../assets/images/editeBg.png" alt srcset class="wid250 hei168" />
        <el-input v-model="name" placeholder="昵称只能设置一次" class="size15 c999 mar_t_10" clearable></el-input>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
var mam;
export default {
  data() {
    return {
      show: true,
      // reason: {} //更新信息
      reason: {}, //更新信息
      name: "",
      loading: false
    };
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    //关闭
    close() {
      this.$emit("editeClose");
    },
    submit() {
      // console.log(this.name);
      if (!this.name) {
        this.$util.Toast("请输入昵称", "warning");
        return;
      }
      let data = {
        member: this.$store.state.userId,
        nickName: this.name
      };
      // this.$util.showLoading();
      this.loading = true;
      this.$post1("member/member/setNickName", data)
        .then(res => {
          this.loading = false;
          if (res && res.status == "SUCCEED") {
            this.$util.Toast("设置昵称成功", "success");
            this.$emit("setNickName");
            // this.$emit("getUserInfo");
          } else {
            this.$util.Toast(res.errorMessage);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  computed: {}
};
</script>
<style lang="scss">
.reName {
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__wrapper{
    overflow: hidden;
  }
}
</style>
<style lang="scss" scoped>
.reName {
  .updateBox {

    .content {
      padding: 0 25px 30px;

      .userName {
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 6px;
        padding: 10px;
      }
    }

    .confirmBtn {
      width: 100%;
      height: 50px;
      line-height: 49px;
      border-radius: 4px;
      text-align: center;
      border-top: 1px solid rgba(227, 227, 227, 0.7);
      font-size: 15px;
    }
  }
}
</style>
