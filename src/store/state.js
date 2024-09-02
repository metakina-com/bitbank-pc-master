// state：用来存放组件之间共享的数据。他跟组件的data选项类似，只不过data选项是用来存放组件的私有数据
const state = {

    navTitle: '首页', // 导航title
    backRouter: '/', // 返回路由
    isTabBar: false, // 是否展示TabBar
    isNavBar: false, // 是否展示NavBar
    isNavFixed: true, // 是否固定NavBar
    isNavArrow: true, // 是否展示NavBar左箭头
    bgColor: '', //NavBar背景色
    isShowRight: false, //是否显示右边图标

    token: window.localStorage.getItem('token') || '',
    userId: window.localStorage.getItem('userId') || '',
    isLogin: window.localStorage.getItem('isLogin') == 'true' ? true : false,
    phone:window.localStorage.getItem('phone') || '',
    pairsName: window.localStorage.getItem('pairsName') || 'BTC/USDT', //当前的交易对
    pairsName1: window.localStorage.getItem('pairsName1') || 'BTC/USDT', //当前的交易对
    contractMulId: window.localStorage.getItem('contractMulId') || '', //当前的交易对id
    safeAreaTop: 20, //顶部高度
    safeAreaBottom: 0, //底部高度
    chooseCurrency: '', //选中的主币
    statusBar: (window.localStorage.getItem('theme') == "night" ? 'light' :'dark') || 'dark', //状态栏颜色，默认白色背景黑字
    countryName: '', //国家名字
    countryCode: '', //国家码
    isShowHeadPopup: false, //首页弹框
    payType:'',//支付方式
    orderId:window.sessionStorage.getItem('number') || '',//订单id
    nowThemeInfo: (window.localStorage.getItem('theme') == null ? 'default-theme' : window.localStorage.getItem('theme') + '-theme') || 'default-theme', //当前主题
    themes: ['default', 'night'], //所有主题
    resetUserinfo:0,//调个人信息

    currentPrice:{}, //当前价格
}
export default state