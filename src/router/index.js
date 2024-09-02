import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

function loadPage(view) {
  return () =>
    import(`../pages/${view}.vue`)
}

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: loadPage('index')
    },
    {
      path: '/home',
      name: 'index',
      component: loadPage('index')
    },
    {
      path: '/login',
      name: 'login',
      component: loadPage('login')
    },
    {
      path: '/register',
      component: loadPage('register')
    },
    // 
    
    {
      path: '/trade',
      name: 'trade',
      component: loadPage('trade/index'),

      children: [
        {
          path: '/trade/buy',
          name: 'buy',
          component: loadPage('trade/trade'),
          meta: {
            keepAlive: true // 需要被缓存
          },
        },
        {
          path: '/trade/order',
          name: 'order',
          component: loadPage('trade/orderList'),
          meta: {
            keepAlive: true // 需要被缓存
          },
        },
        //  广告列表
        {
          path: '/trade/advertiseList',
          name: 'advertiseList',
          component: loadPage('trade/advertiseList'),
          meta: {
            keepAlive: true // 需要被缓存
          },
        },
        {
          path: '/trade/merchantAudit',
          name: 'merchantAudit',
          component: loadPage('trade/merchantAudit'),
          meta: {
            keepAlive: true // 需要被缓存
          },
        },
      ]
    },

  
   
  
    {
      path: '/transactionDetail',
      name: 'transactionDetail',
      component: loadPage('trade/transactionDetail')

    },
  
    // 行情
    {
      path: '/markets',
      name: 'markets',
      component: loadPage('markets')
    },
    // 行情
    {
      path: '/noticeDetail',
      name: 'noticeDetail',
      component: loadPage('noticeDetail')
    },
    
    {
      path: '/market',
      name: 'market',
      component: loadPage('market')
    },
    {
      path: '/match',
      name: 'match',
      component: loadPage('match')
    },
    {
      path: '/proposer',
      name: 'proposer',
      component: loadPage('proposer')
    },
    {
      path: '/single/:name',
      name: 'single',
      component: loadPage('bottomList/single')
    },
    {
      path: '/notice/:name',
      name: 'notice',
      component: loadPage('bottomList/notice')
    },
    {
      path: '/user/auth',
      name: 'auth',
      component: loadPage('user/auth'),
    },
    {
      path: '/user/senior',
      name: 'senior',
      component: loadPage('user/senior'),
    },
    {
      path: '/personalCenter',
      name: 'personalCenter',
      component: loadPage('user/personalCenter'),
      meta: {
        keepAlive: true // 需要被缓存
      },
    },
    {
      path: '/payment',
      name: 'payment',
      component: loadPage('user/payment'),
      meta: {
        keepAlive: true // 需要被缓存
      },
    },
    {
      path: '/user',
      component: loadPage('user/center'),
      children: [
        {
          path: '/user/assets/balances',
          name: 'balances',
          component: loadPage('user/asset/balances'),
          meta: {
            keepAlive: true // 需要被缓存
          },
        },
        {
          path: '/user/assets/recharge',
          name: 'recharge',
          component: loadPage('user/asset/recharge'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/user/assets/withdraw',
          name: 'withdraw',
          component: loadPage('user/asset/withdraw'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/user/assets/accountOrder',
          name: 'accountOrder',
          component: loadPage('user/asset/accountOrder'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/user/order/legalTender',
          name: 'legalTender',
          component: loadPage('user/order/legalTender')
        },
        {
          path: '/user/order/entrust',
          name: 'entrust',
          component: loadPage('user/order/entrust')
        },
        {
          path: '/user/order/contract',
          name: 'contractOrder',
          component: loadPage('user/order/contract')
        },

      ]
    },
    {
      path: '/passwordForget',
      name: 'passwordForget',
      component: loadPage('user/account/passwordForget')
    },
    {
      path: '/accountCenter',
      name: 'accountCenter',
      component: loadPage('user/accountCenter/index'),
      meta: {
        keepAlive: true // 需要被缓存
      },
    }
  ]
})
