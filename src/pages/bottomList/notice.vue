<template>
  <div class="page-content bgColor_1" style="min-height: 900px;">
    <div class="main-content">
      <div class="menu">
        <div class="menu-tit">{{ typeName }}</div>
        <ul class="menu-item">
          <li
            v-for="(val, index) in tempList"
            :key="index"
            :class="{active:menuActive == index}"
            @click="infoTab(index)"
          >{{ val.title }}</li>
        </ul>
        <el-pagination
          layout="prev, pager, next"
          :page-size="pagesize"
          @current-change="current_change"
          :current-page.sync="currentPage"
          :pager-count="5"
          :total="total"
          
        ></el-pagination>
      </div>
      <div class="content-box">
        <div class="content-text bgColor_2" style="overflow: hidden;">
          <h2 class="content-title">{{ articleTitle }}</h2>
          <p class="time">{{ articleTime }}</p>
          <div class="ql-container">
            <p v-html="articleHtml"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { noticeList } from "./single";

export default {
  name: "notice",
  data() {
    return {
      menuActive: 0,
      typeName: "",
      articleTitle: "",
      articleTime: "",
      articleHtml: "",
      articleList: [],
      tempList: [],
      typeKey: "",
      total: 0,
      currentPage: 1,
      pagesize: 10
    };
  },
  watch: {
    $route(to, from) {
      this.typeKey = to.params.name;
      this.getlist(this.typeKey);
    }
  },
  created() {
    this.typeKey = this.$route.params.name;
    this.getlist(this.typeKey);
  },
  methods: {
    getlist(name) {
      for (const item in noticeList) {
        let res = noticeList[item];
        if (res.typeKey == name) {
          this.typeName = res.typeName;
          this.articleList = res.rows;
          this.total = res.rows.length;
          let newList = this.articleList.concat([]);
          this.tempList = newList.splice(0, 10);
          this.infoTab();
        }
      }
    },

    infoTab(index) {
      if (!index) {
        index = 0;
      }
      this.menuActive = index;
      this.articleTitle = this.tempList[index].title;
      this.articleTime = this.utils.formatDate(
        new Date(this.tempList[index].createTime),
        "yyyy-MM-dd hh:mm"
      );
      this.articleHtml = this.tempList[index].content;
    },

    current_change(val) {
      let newList = this.articleList.concat([]);
      this.tempList = newList.splice(--val * 10, 10);
      this.infoTab();
    }
  }
};
</script>

<style lang="less" scoped>
.page-content{
  overflow: hidden;
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
</style><style lang="less">
.el-pagination {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: -30px;
}

.el-pager li,
.el-pagination button,
.el-pagination button:disabled,
.el-pagination .btn-next,
.el-pagination .btn-prev {
  color: rgba(153, 153, 153, 1);
  background: transparent;
}

.el-pager li.active,
.el-pager li:hover,
.el-pagination button:hover {
  color: #fff !important;
}
</style>
