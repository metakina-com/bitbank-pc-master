<template>
  <div class="page-content bgColor_1" style="min-height: 900px;">
    <div class="main-content">
      <div class="title">{{ articleTitle }}</div>
      <div class="content-box" style="padding-left: 0;">
        <div class="content-text bgColor_2">
          <h2 class="content-title">{{ articleTitle }}</h2>
          <div class="ql-container">
            <p v-html="articleHtml"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { singleList } from "./single.js";
export default {
  name: "single",
  data() {
    return {
      articleTitle: "",
      articleHtml: "",
      name: ""
    };
  },
  watch: {
    $route(to, from) {
      this.name = to.params.name;
      this.getlist(this.name);
    }
  },
  created() {
    this.name = this.$route.params.name;
    this.getlist(this.name);
  },
  methods: {
    getlist(name) {
      for (const item in singleList) {
        if (singleList[item].params == name){
          this.articleTitle = singleList[item].articleTitle;
          this.articleHtml = singleList[item].articleHtml;
        }
        
      }
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  color: #fff;
  font-size: 15px;
  margin-bottom: 20px;
}
.page-content{
  overflow: hidden;
  padding-bottom: 60px;
}
.main-content {
  width: 1180px;
  margin: 40px auto 0;
  .menu {
    width: 250px;
    float: left;
    color: #fff;
    position: relative;
    min-height: 780px;
    .menu-tit {
      font-size: 16px;
      line-height: 32px;
      margin-bottom: 20px;
    }
    .menu-item {
      li {
        padding: 14px 25px 14px 20px;
        font-size: 14px;
        line-height: 20px;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border-radius: 2px;
        color: #999;
        transition: all 0.3s;
      }
      li:hover {
        background-color: rgba(40, 43, 50, 0.5);
      }
      .active {
        color: #fff;
        background-color: rgba(40, 43, 50, 0.5);
      }
    }
  }
  .content-box {
    padding-left: 270px;
    .content-text {
      color: #999;
      min-height: 780px;
      padding: 40px 60px 60px;
      position: relative;
      border-radius: 2px;
      .content-title {
        color: #fff;
        font-size: 22px;
        font-weight: 400;
        line-height: 30px;
      }
      .time {
        width: 100px;
        margin-top: 20px;
        font-size: 12px;
        line-height: 16px;
      }
      .ql-container {
        margin-top: 30px;
        box-sizing: border-box;
        line-height: 1.42;
        height: 100%;
        outline: none;
        overflow-y: auto;
        padding: 12px 15px;
        text-align: left;
        word-wrap: break-word;
        p {
          line-height: 24px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>

