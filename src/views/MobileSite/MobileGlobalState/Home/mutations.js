export default {
    // 设置用户信息
    SET_USERINFO(state, payload) {
        state.userInfo = payload
    },

    // 设置待办数字
    SET_TODOCOUNTNUM(state, payload) {
        state.todoCountNum = payload
    },

    // 设置抄送数字
    SET_COPYCOUNTNUM(state, payload) {
        state.copyCountNum = payload
    },

    // 设置退出弹出显示
    SET_ACTIONSVISIBLE(state, payload) {
        state.actionsVisible = payload
    },

    // 设置页面显示控制
    SET_SETTINGVISIBLE(state, payload) {
        state.settingVisible = payload
    },

    // 设置页面弹出显示
    SET_POPUPVISIBLE(state, payload) {
        state.popoupVisible = payload
    },

    // 设置导航的标题
    SET_NAVBARTITLE(state, payload) {
        state.navBarTitle = payload
    },

    SET_MODELFILED(state, payload) {
        state.modelFiled = payload
    },

    SET_ACTIONLIST(state, payload) {
        state.actionList = payload
    },


}