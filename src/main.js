import Vue from 'vue';
import App from './App';
import './permission'; // 权限
import './error'; // 日志
import './cache';//页面缓存
import store from './store';
import basicBlock from './components/basic-block/main';
import basicContainer from './components/basic-container/main';
import thirdRegister from './components/third-register/main';
import website from '@/config/website';
import { getmodels, getDicts } from '@/api/system/dict';
import splitPane from 'vue-splitpane';
import './styles/common.scss';
import './styles/index.scss';
//import VueDND from 'awe-dnd';
import { loadStyle, loadVant } from './util/util'
import * as urls from '@/config/env';
import {
  iconfontUrl,
  iconfontVersion
} from '@/config/env';
import AvueUeditor from 'avue-plugin-ueditor'; // 富文本
import VueAxios from 'vue-axios';
import axios from './router/axios';
import Element from 'element-ui';
import i18n from './lang' // Internationalization
import router from './router/router';
import queryInput from './components/compositeQuery/input';
import querySelect from './components/compositeQuery/select';
import queryDate from './components/compositeQuery/date';
import queryDatetime from './components/compositeQuery/datetime';
import querytime from './components/compositeQuery/time';
import queryNumber from './components/compositeQuery/number';
import search from './components/search/search';
import sxSearch from './components/search/sxSearch';
import config from './forms/config/index.js';
import Print from '@/api/print' // 引入print js文件
import { getColumnList } from '@/util/dynamic/getColumnList';
import { getWidget } from '@/util/dynamic/getWidget';
import { getExtQueryList } from '@/util/dynamic/getExtQueryList';
import mysearch from './components/mysearch.vue'
import fullScreenDialog from './components/fullScreenDialog'
import { userListAll } from '@/api/system/user';
import { getAction, postAction } from "@/api/tool/dynamic";
import "./utils/dialog";
import { viewInit, dynamicFieldEdit, dynamicFieldShow, dynamicFieldRequired, dynamicShow, dynamicView } from "@/api/assistant";
import { avueTypeTrans } from "./const/system/avueTypeTrans";


import Vant from 'vant';
import 'vant/lib/index.css';
import _ from 'lodash'
import dayjs from 'dayjs'


import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'

import 'xe-utils'
import 'vxe-table/lib/style.css'


Vue.use(VXETable)

VXETable.use(VXETablePluginElement)


// 设置 zindex 值 避免遮挡
VXETable.setup({
  zIndex: 9999
})

window.dayjs = dayjs
Vue.prototype._ = _
Vue.prototype.dayjs = dayjs
Vue.use(Vant);

Vue.use(AvueUeditor);
//全局方法挂载
window.VXETable = VXETable;
Vue.prototype.avueTypeTrans = avueTypeTrans;
Vue.prototype.getDicts = getDicts;
Vue.prototype.getmodels = getmodels;
Vue.prototype.userListAll = userListAll;
Vue.prototype.getAction = getAction;
Vue.prototype.postAction = postAction;
Vue.prototype.getWidget = getWidget;
Vue.prototype.getExtQueryList = getExtQueryList;
Vue.prototype.getColumnList = getColumnList;
Vue.prototype.viewInit = viewInit;
Vue.prototype.dynamicFieldShow = dynamicFieldShow;
Vue.prototype.dynamicFieldEdit = dynamicFieldEdit;
Vue.prototype.dynamicFieldRequired = dynamicFieldRequired;
Vue.prototype.dynamicShow = dynamicShow;
Vue.prototype.dynamicView = dynamicView;
Date.prototype.Format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
};

Vue.config.devtools = true;
Vue.use(Print)
//Vue.use(printJS)
Vue.use(router);
//Vue.use(VueDND)
Vue.use(VueAxios, axios);


Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(window.AVUE, {
  size: 'small',
  tableSize: 'small',
  i18n: (key, value) => i18n.t(key, value)
})
//注册全局容器
Vue.component('split-pane', splitPane);
Vue.component('query-input', queryInput);
Vue.component('query-select', querySelect);
Vue.component('query-date', queryDate);
Vue.component('query-datetime', queryDatetime);
Vue.component('query-time', querytime);
Vue.component('query-number', queryNumber);
Vue.component('Search', search);
Vue.component('sxSearch', sxSearch);
Vue.component('basicContainer', basicContainer);
Vue.component('basicBlock', basicBlock);
Vue.component('thirdRegister', thirdRegister); mysearch
Vue.component('mysearch', mysearch);
Vue.component('fullScreenDialog', fullScreenDialog);

window.$bus = new Vue();

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
});
// 加载website
Vue.prototype.website = website;
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele));
});

if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  loadVant('/cdn/avue/2.8.6/avue-mobile.min.js')
}


Vue.config.productionTip = false;
// 表单设计器组件注册
config.install(Vue);

import sxFormDesign from './views/formDesign/packages/index.js';
import { divide } from 'xe-utils';

Vue.use(window.AVUE)
Vue.use(sxFormDesign)


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
