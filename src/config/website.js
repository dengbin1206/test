/**
 * 全局配置文件
 */

function getHost(url) {
  let pathArr = url.split(':');
  return pathArr[0]+":"+pathArr[1];
}
export default {
  title: "平台",
  logo: "S",
  key: 'saber',//配置主键,目前用于存储
  indexTitle: '思绪科技',
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: true, // 是否开启租户模式
  tenantId: "000000", // 管理组租户编号
  captchaMode: true, // 是否开启验证码模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Blade-Auth',
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  },
  // 第三方系统授权地址
  authUrl: 'http://localhost/blade-auth/oauth/render',
  // 流程设计器地址
  //flowDesignUrl: 'http://test.dart-rich.com:9999/', `${window.location.origin}:9999`
  flowDesignUrl: `${getHost(window.location.origin)}:9999`
}
