<template>
  <div id="app" class="flex flex-column v_re">
    <!-- 头部 -->
    <indexNav ref="header" :class="NavTap?'tap_top':'tap_top1'"></indexNav>

    <div :style="{'min-height':fullHeight+'px'}" class="relative" style="overflow:hidden;">
      <keep-alive>
        <router-view :style="{'min-height':fullHeight+'px'}" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view
        :style="{'min-height':fullHeight+'px'}"
        v-if="!$route.meta||!$route.meta.keepAlive"
      ></router-view>
    </div>

    <!-- 尾部 -->
    <indexBar ref="footer"></indexBar>
    <reName v-if="isShowReName" @editeClose="editeClose" @setNickName="setNickName" ref="rename" />
  </div>
</template>

<script>
import indexBar from "./components/common/indexBar";
import indexNav from "./components/common/indexNav";
import reName from "./components/common/reName";
import { mapActions } from "vuex";
export default {
  name: "App",
  data() {
    return {
      fullHeight: "",
      NavTap: false,
      isShowReName: false, //设置昵称弹框
    };
  },
  components: {
    indexNav,
    indexBar,
    reName,
  },
  watch: {
    $route(to, from) {
      if (to.path == "/" || to.path == "/home") {
        this.NavTap = true;
      } else {
        this.NavTap = false;
      }
    },
  },
  mounted() {
    this._getFullHeight(); //默认值
    document.addEventListener("resize", this._getFullHeight);

    this.$hub.$on("showReName", (res) => {
      // console.log(res);
      this.isShowReName = true;
    });
  },
  beforeDestroy() {
    document.removeEventListener("resize", this._getFullHeight);
  },
  methods: {
    ...mapActions(["setResetUserinfo"]),
    _getFullHeight() {
      // this.fullHeight = document.documentElement.clientHeight;
      this.$nextTick(() => {
        let cheight = document.documentElement.clientHeight;
        //使用nextTick为了保证dom元素都已经渲染完毕
        let height = this.$refs.header.$el.offsetHeight; //100
        let height1 = this.$refs.footer.$el.offsetHeight; //100
        this.fullHeight = cheight - height - height1;
        this.fullHeight = this.fullHeight < 600 ? 600 : this.fullHeight;
      });
    },
    //关闭昵称弹框
    editeClose() {
      this.isShowReName = false;
    },
    //昵称设置成功返回事件
    setNickName() {
      this.isShowReName = false;
      this.setResetUserinfo(1);
    },
  },
};
</script>
  <style lang="scss">
@import "./assets/style/_reset.scss";

@import "./assets/style/base.scss";
</style>

<style>
* {
  /* user-select: none; */
}
.c222 {
  color: #222222;
}
.blue_bg {
  background: #3d77e0;
  color: #fff;
}
.el-button--primary {
  background: #357ce1;
}
.el-button--primary:focus,
.el-button--primary:hover {
  background: #357ce1;
}
.green_bg {
  background: #38bb96;
  color: #fff;
}

.orange_bg {
  background: #e8054c;
  color: #fff;
}
.loading {
  font-size: 40px;
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 100px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #444;
  font-size: 14px;
  overflow: hidden;
  /* min-width: 1180px; */
  min-width: 1200px;
  min-height: 100vh;
  background: #000;
}
#app .tap_top {
  position: absolute;
  top: 0;
  z-index: 9999;
  width: 100%;
  background: rgba(127, 143, 164, 0.4);
}

#app .tap_top1 {
  background: #1b2945;
}

#app::-webkit-scrollbar {
  display: none;
}

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
font,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td {
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
  outline: 0;
  box-sizing: border-box;
  list-style: none;
  font-style: normal;
}

ol,
ul {
  list-style: none;
  list-style-type: none;
}

a,
a:link {
  color: #444;
  text-decoration: none;
}

a:visited {
  color: #444;
}

a:hover {
  color: #444;
}

a:active {
  color: #444;
}

/* public bgcolor */
.bgColor_1 {
  background: #242e47;
}

.bgColor_2 {
  background: rgb(30, 37, 63);
}

.bgColor_3 {
  background: rgb(30, 37, 63);
}

.bgColor_4 {
  background: rgba(50, 53, 64, 1);
}
</style>
