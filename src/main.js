import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import i18n from './i18n'
// import './plugins/element'
import ElementUI from 'element-ui'
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import filters from './assets/js/filter'
import commons from './assets/js/common'
import request from './utils/request'
import utils from './utils/utils'

import global from './assets/js/global'

import clipboard from 'clipboard';

import nodata from './components/common/noData.vue'
import './plugins/gt'
// import "./assets/base.css"


Vue.config.productionTip = false
    // 全局导入过滤器
Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
})

Vue.prototype.$hub = window.MV =  new Vue();


Vue.prototype.Toast = Message;
//复制
Vue.prototype.clipboard = clipboard;

Vue.prototype.$GLOBAL = global;

// 1.无数据
Vue.component('nodata', nodata)

// 极验
Vue.prototype.$initGeet = initGeetest;
// 请求
Vue.prototype.$post = request.post;
Vue.prototype.$get = request.get;
Vue.prototype.$post1 = request.post1;
Vue.prototype.$axios = request.axios;
Vue.prototype.toView = res=>{
  router.push({
    path:res
  })
};
// 工具
Vue.prototype.utils = utils;
Vue.prototype.$util = commons
// 阻止生产消息
Vue.config.productionTip = false
// element UI
Vue.use(ElementUI);

// 跳转后返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
})


new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {
    App
  },
  template: '<App/>'
});
