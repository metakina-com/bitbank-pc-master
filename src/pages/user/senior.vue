<template>
  <div class="auth_bg pad-b-20">
    <div class="auth_section pad-t-40">
      <!-- <div class="bg-fff hei60 line60 size20 pad-l-30">
        <router-link to="/personalCenter" class="pointer blue" style="color: #357ce1;">个人中心 ></router-link>
        <span class="size16">高级认证</span>
       
      </div> -->
       <div class="bg-fff hei60 flex align-center size20 pad-l-30">
          <el-page-header @back="goBack" content="高级认证" title></el-page-header>
        </div>
      <div class="auth_content bg-fff mar-t-20 pad-30 min-hei400" v-if="isInit">
        <div v-if="!isRenzhang">
          <div
            class="senior pad-t-15"
            v-if="userInfo.cardState==null||userInfo.cardState=='REFUSE'"
          >
            <div class="flex mar-b-20">
              <div class="min-wid120">上传身份证正反面</div>
              <div class="flex mar-l-20">
                <div class="imgItems">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="(file,list)=>{handleChange(file,list,1)}"
                    action
                  >
                    <img v-if="imgBox.img1" :src="imgBox.img1" class="imgs hei194 wid269 pointer" />
                    <img
                      v-else
                      src="../../assets/images/realnameImg1.png"
                      alt
                      class="imgs hei194 wid269 pointer"
                    />
                  </el-upload>
                </div>
                <div class="imgItems">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="(file,list)=>{handleChange(file,list,2)}"
                    action
                  >
                    <img v-if="imgBox.img2" :src="imgBox.img2" class="imgs hei194 wid269 pointer" />
                    <img
                      v-else
                      src="../../assets/images/realnameImg2.png"
                      alt
                      class="imgs hei194 wid269 pointer"
                    />
                  </el-upload>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="min-wid120">上传手持证件照</div>
              <div class="imgItems mar-l-20">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="(file,list)=>{handleChange(file,list,3)}"
                  action
                >
                  <img v-if="imgBox.img3" :src="imgBox.img3" class="imgs hei194 wid269 pointer" />
                  <img
                    v-else
                    src="../../assets/images/realnameImg3.png"
                    alt
                    class="imgs hei194 wid269 pointer"
                  />
                </el-upload>
              </div>
            </div>
            <div class="mar-t-20 v-center">
              <el-button @click="close">取 消</el-button>
              <el-button type="primary" :loading="loading" class @click="submit">提交</el-button>
            </div>
          </div>
          <div class="flex flex-column align_center pad-t-50" v-else>
            <img src="../../assets/images/examine.png" alt srcset class="wid160 hei160" />
            <div class="size20 c222 bold mar-t-20">高级认证审核中</div>
            <p class="size15 c222" style="margin-top:10px">请等待审核结果</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "auth",
  data() {
    return {
      name: "",
      idCard: "",
      loading: false,
      isRenzhang: false,
      imgBox: {
        img1: "", //正面
        img2: "", //反面
        img3: "", //反面
      }, //图片上传
      userInfo: {},
      isInit: false,
    };
  },
  watch: {
    name(val) {
      this.name = val.replace(/\s+/g, "");
    },
    idCard(val) {
      this.idCard = val.replace(/\s+/g, "");
    },
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
     goBack() {
      this.$router.go(-1);
    },
    handleChange(file, fileList, index) {
      this.$util.getBase64(file.raw).then((res) => {
        this.$util.dealImage(res, 500, (data) => {
          if (index == 1) {
            this.imgBox.img1 = data;
          } else if (index == 2) {
            this.imgBox.img2 = data;
          } else {
            this.imgBox.img3 = data;
          }
        });
      });
    },

    //提交
    submit() {
      if (!this.imgBox.img1) {
        this.$util.Toast("请上传身份证正面", "warning");
        return;
      }
      if (!this.imgBox.img2) {
        this.$util.Toast("请上传身份证反面", "warning");
        return;
      }
      if (!this.imgBox.img3) {
        thiswarning.Toast("请上传手持证件照", "warning");
        return;
      }
      this.loading = true;
      // 上传身份证照片
      var data = {
        positiveFile: this.imgBox.img1,
        sideFile: this.imgBox.img2,
        handLink: this.imgBox.img3,
      };

      var fd = new FormData();
      fd.append("positiveFile", this.$util.base64toFile(data.positiveFile));
      fd.append("sideFile", this.$util.base64toFile(data.sideFile));
      fd.append("handLink", this.$util.base64toFile(data.handLink));
      this.$post1(
        "member/member/setCardImg",
        {
          member: this.$store.state.userId,
        },
        fd
      )
        .then((res) => {
          this.loading = false;
          if (res && res.status == "SUCCEED") {
            this.$util.Toast("上传成功，请等待审核", "success");
            this.getUserInfo();
          } else {
            this.$util.Toast(res.errorMessage);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //返回上一页
    close() {
      this.$router.go(-1);
      this.loading = false;
    },
    getUserInfo() {
      var _this = this;
      this.$get("member/member/getMember", {
        member: this.$store.state.userId,
      }).then((res) => {
        if (res.status == "FAILED") {
        } else if (res.status == "SUCCEED") {
          let data = res.result;
          this.userInfo = data;
          this.isInit = true;
          if (data.cardNo == "") {
            this.isRenzhang = false;
            // this.$alert("请先进行初级实名认证", "提示", {
            //   confirmButtonText: "确定",
            //   showClose: false,
            //   callback: action => {
            //     if (action == "confirm") {
            //       _this.$router.replace("/personalCenter");
            //     }
            //   }
            // });
          } else {
            this.isRenzhang = true;
          }
        }
      });
    },
  },
  computed: {},
};
</script>

<style lang="less" scoped>
.auth_bg {
  background: #f2f3f8;

  .auth_section {
    width: 1200px;
    margin: 0 auto;
  }
  .senior {
    .imgItems {
      margin-right: 40px;
    }
  }
}
</style>
