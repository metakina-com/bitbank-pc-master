const getters = {
    navTitle: state => state.navTitle,// 导航title
    backRouter: state => state.backRouter,// 返回路由
    isTabBar: state => state.isTabBar,// 是否展示TabBar
    isNavBar: state => state.isNavBar,// 是否展示NavBar
    isNavFixed: state => state.isNavFixed,// 是否固定NavBar
    isNavArrow:state=>state.isNavArrow,// 是否展示NavBar左箭头
    bgColor:state=>state.bgColor,//NavBar背景色
    isShowRight:state=>state.isShowRight,//NavBar背景色
  }
  export default getters