const mutations = { // 对象里挂载的是一些方法
    setnavTitle(state, navTitle) {
        state.navTitle = navTitle
    }, // 设置NavTitle
    setbackRouter(state, backRouter) {
        state.backRouter = backRouter
    }, // 设置返回路由
    setnavBarState(state, isNavBar) {
        state.isNavBar = isNavBar
    }, // 设置NavBar展示状态
    settabBarState(state, isTabBar) {

        state.isTabBar = isTabBar
        window.localStorage.setItem('isTabBar', isTabBar);

    }, // 设置TabBar展示状态
    setnavBarFixed(state, isNavFixed) {
        state.isNavFixed = isNavFixed

    }, // 设置NavBar固定状态
    setnavBarArrow(state, isNavArrow) {
        state.isNavArrow = isNavArrow
    }, // 设置NavBar箭头是否展示

    setToken(state, token) {
        state.token = token
    }, // 设置token
    setUserId(state, userId) {
        state.userId = userId
    }, // 设置userId

    setLogin(state, login) {
        state.isLogin = login
    }, // 设置 登录状态
    setPhone(state, phone) {
        state.phone = phone
    }, // 设置 手机号码


    setPairsName(state, PairsName) {
        state.pairsName = PairsName
    }, // 设置 当前交易对
    setPairsName1(state, PairsName) {
        state.pairsName1 = PairsName
    }, // 设置 当前交易对

    setContractMulId(state, id) {
        state.contractMulId = id
    }, // 设置 当前交易对id

    setnavBarBgColor(state, bgColor) { // 设置NavBar背景色
        state.bgColor = bgColor;
    },
    setnavBarShowRight(state, isShowRight) { // 设置是否显示右边图标
        state.isShowRight = isShowRight
    },
    setSafeAreaTop(state, safeAreaTop) { // 设置顶部安全距离
        state.safeAreaTop = safeAreaTop
    },
    setSafeAreaBottom(state, safeAreaBottom) { // 设置底部安全距离
        state.safeAreaBottom = safeAreaBottom
    },
    setCurrency(state, currency) {
        state.chooseCurrency = currency
    }, // 设置 资产中选中主币
    setStatusBar(state, c) {
        state.statusBar = c
    }, // 设置 状态栏文字颜色
    setCountryCode(state, code) {
        state.countryCode = code;
    }, // 当前选择国家码
    setCountryName(state, name) {
        state.countryName = name;
    }, // 当前选择国家码
    setShowHeadPopup(state, status) {
        state.isShowHeadPopup = status;
    }, 
    // 首页弹框
    setResetUserinfo(state, status) {
        state.resetUserinfo = status;
    }, 
    // 重新调取个人信息
    SET_THEMEINFO(state, theme) {
        state.nowThemeInfo = theme + '-theme';
        window.localStorage.setItem('theme', theme);

        console.log(theme)
    },
    setPayType(state,type) {
       state.payType=type;
    }, // 设置支付方式
    setOrderId(state,id) {
       state.orderId=id;
       window.sessionStorage.setItem('number',id);
    }, // 设置订单id

    setPrice(state,data){ 
       state.currentPrice=data;

    }
}
export default mutations