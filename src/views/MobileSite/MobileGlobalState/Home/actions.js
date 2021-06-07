import { myToDoCount, instCopyMeCount, getUserInfo } from "@/api/mobileApi/flow";


export default {

    async queryUserInfo({ commit }) {
        const { data } = await getUserInfo()
        commit("SET_USERINFO", data.data)
    },

    async queryTodoCount({ commit }) {
        const { data } = await myToDoCount()
        commit("SET_TODOCOUNTNUM", data.data)
    },

    async queryCopyCount({ commit }) {
        const { data } = await instCopyMeCount()
        commit("SET_COPYCOUNTNUM", data.data)
    }

}