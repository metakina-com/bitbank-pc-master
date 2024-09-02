/**
 * action 对 mutation 做封装
 * 当一步操作需要改变多个 mutations 的时候，就把多个 mutations 封装成一个 action
 */

const actions = {
    setnavTitle(context, navTitle) {
        context.commit('setnavTitle', navTitle)
    }, // 设置NavBar标题
    setbackRouter(context, backRouter) {
        context.commit('setbackRouter', backRouter)
    }, // 设置返回路由
    setnavBarState(context, isNavBar) {
        context.commit('setnavBarState', isNavBar)
    }, // 设置NavBar展示状态
    settabBarState(context, isTabBar) {
        context.commit('settabBarState', isTabBar)
    }, // 设置TabBar展示状态
    setnavBarFixed(context, isNavFixed) {
        context.commit('setnavBarFixed', isNavFixed)
    }, // 设置NavBar固定状态
    setnavBarArrow(context, isNavArrow) {
        context.commit('setnavBarArrow', isNavArrow)
    }, // 设置NavBar箭头是否展示

    setToken(context, token) {
        window.localStorage.setItem('token', token)
        context.commit('setToken', token)
    }, // 设置token
    setUserId(context, userId) {
        window.localStorage.setItem('userId', userId)
        context.commit('setUserId', userId)
    }, // 设置userId


    setLogin(context, login) {
        window.localStorage.setItem('isLogin', login)
        context.commit('setLogin', login)
    }, // 设置 登录状态


    setPhone(context, phone) {
        window.localStorage.setItem('phone', phone)
        context.commit('setPhone', phone)
    }, // 设置 手机号码



    setPairsName(context, PairsName) {

        window.localStorage.setItem('pairsName', PairsName)
        context.commit('setPairsName', PairsName)
    }, // 设置 当前交易对
    setPairsName1(context, PairsName) {
        window.localStorage.setItem('pairsName1', PairsName)
        context.commit('setPairsName1', PairsName)
    }, // 设置 当前交易对

    // 设置 当前交易对id
    setContractMulId(context, id) {

        window.localStorage.setItem('contractMulId', id)
        context.commit('setContractMulId', id)
    },


    // 设置NavBar背景色
    setnavBarBgColor(context, bgColor) {
        context.commit('setnavBarBgColor', bgColor)
        if(window.localStorage.getItem('theme') == "night"){
            context.commit('setStatusBar', 'light')
        }else{
            if(!bgColor){
                context.commit('setStatusBar', 'dark')
            }else{
                context.commit('setStatusBar', 'light')
            }
        }
    },
    setnavBarShowRight(context, isShowRight) { // 设置是否显示右边图标
        context.commit('setnavBarShowRight', isShowRight)
    },
    setSafeAreaTop(context, top) { // 设置顶部安全距离
        context.commit('setSafeAreaTop', top)
    },
    setSafeAreaBottom(context, bottom) { // 设置底部安全距离
        context.commit('setSafeAreaBottom', bottom)
    },
    setCurrency(context, currency) {
        context.commit('setCurrency', currency);
    }, // 设置 资产中选中主币
    setStatusBar(context, c) {
        context.commit('setStatusBar', c)
    }, // 设置 状态栏文字颜色
    setCountryCode(context, code) {
        context.commit('setCountryCode', code)
    }, // 当前选择国家码
    setCountryName(context, name) {
        context.commit('setCountryName', name)
    }, // 当前选择国家码
    setShowHeadPopup(context,status) {
        context.commit('setShowHeadPopup', status)
    }, // 首页弹框
    setResetUserinfo(context,status) {
        context.commit('setResetUserinfo', status)
    }, 
    setPayType(context,type) {
        context.commit('setPayType', type)
    }, // 设置支付方式

    setOrderId(context,id) {
        context.commit('setOrderId', id)
     }, // 设置订单id

    setPrice(context,data){ 
       
        context.commit('setPrice', data)
     },
}
export default actions