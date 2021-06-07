const selectMember = {
    state: {
        selectedList: [],

        //抄送标题设置
        popupTitleByCopy: '',
        // 抄送弹出层显示隐藏
        popupVisile: false,

    },
    mutations: {
        setSelectedList(state, payload) {
            state.selectedList = payload
        },

        SET_TITLE(state, payload) {
            state.popupTitleByCopy = payload
        },

        SET_VISIBLE(state, payload) {
            state.popupVisile = payload
        }
    }
}

export default selectMember