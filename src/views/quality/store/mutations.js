export default {
    SET_QUALITYROUTE(state, payload) {
        state.path = payload
    },
    SET_UNQUALITYROUTE(state, payload) {
        state.unpath = payload
    },
    SET_QUERYID(state, payload) {
        state.query = payload
    },
}