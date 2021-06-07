import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import logs from './modules/logs'
import dict from './modules/dict'
import selectMember from './modules/selectMember'
import getters from './getters'

import Home from '../views/MobileSite/MobileGlobalState/Home/index'
import Todo from '../views/MobileSite/MobileGlobalState/Todo/index'
import Flow from '../views/MobileSite/MobileGlobalState/Flow/index'
import FormDesign from '../views/formDesign/fromDesignStore/index'
import quality from '../views/quality/store/index';




Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    logs,
    tags,
    dict,
    selectMember,
    Home,
    Todo,
    Flow,
    FormDesign,
    quality
  },
  getters,
  state:{
    modelId:'',//模型Id
    dynamicName:''
  },
  mutations:{

  }
})

export default store
