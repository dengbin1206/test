import Layout from '@/page/index/'

export default [{
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: () =>
      import('@/views/wel/index.vue')
  }, {
    path: 'dashboard',
    name: '控制台',
    meta: {
      i18n: 'dashboard',
      menu: false,
    },
    component: () =>
      import('@/views/wel/dashboard')
  }]
}, {
  path: '/test',
  component: Layout,
  redirect: '/test/index',
  children: [{
    path: 'index',
    name: '测试页',
    meta: {
      i18n: 'test'
    },
    component: () =>
      import('@/views/util/test')
  }]
}, {
  path: '/dict-horizontal',
  component: Layout,
  redirect: '/dict-horizontal/index',
  children: [{
    path: 'index',
    name: '字典管理',
    meta: {
      i18n: 'dict'
    },
    component: () =>
      import('@/views/util/demo/dict-horizontal')
  }]
}, {
  path: '/dict-vertical',
  component: Layout,
  redirect: '/dict-vertical/index',
  children: [{
    path: 'index',
    name: '字典管理',
    meta: {
      i18n: 'dict'
    },
    component: () =>
      import('@/views/util/demo/dict-vertical')
  }]
}, {
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    meta: {
      i18n: 'info'
    },
    component: () =>
      import('@/views/system/userinfo.vue')
  }]
}, {
  path: '/work/process/leave',
  component: Layout,
  redirect: '/work/process/leave/form',
  children: [{
    path: 'form/:processDefinitionId',
    name: '请假流程',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import('@/views/work/process/leave/form')
  }, {
    path: 'handle/:taskId/:processInstanceId/:businessId',
    name: '处理请假流程',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import('@/views/work/process/leave/handle')
  }, {
    path: 'detail/:processInstanceId/:businessId',
    name: '请假流程详情',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import('@/views/work/process/leave/detail')
  }]
}/*,{
  path: '/demo',
  component: Layout,
  redirect: '/demo/index',
  children: [{
    path: 'index',
    name: '测试页',
    component: () =>
      import('@/views/demo/demo1')
  }]
}{
  path:'/tool',
  name:'研发工具',
  component: Layout,
  redirect:'/tool/form',
 // redirect:'/tool/dynamic',
 children:[
   {
     path:'dynamic/:type/:id',
     name:'',
     meta: {
      i18n: 'work'
    },
    component:()=>
     import('@/views/tool/dynamic')
   }
 ],
}*/,
{
  path: '/tool',
  name: '表单解析',
  component: Layout,
  children: [
    {
      path: 'analysis/:id',
      name: '客户管理',
      meta: {
        i18n: 'work'
      },
      component: () =>
        import('@/views/tool/analysis')
    }
  ]
},
{
  path: '/mobile/home',
  component: () => import('@/views/MobileSite/MobilePage/Home/index.vue'),
},
{
  path: '/mobile/myToDoList',
  component: () => import('@/views/MobileSite/MobilePage/myToDoList/index.vue'),
},
{
  path: '/mobile/myDoneList',
  component: () => import('@/views/MobileSite/MobilePage/Done/index.vue'),
},
{
  path: '/mobile/myInstanceList',
  component: () => import('@/views/MobileSite/MobilePage/Initiate/index.vue'),
},
{
  path: '/mobile/instCopyReplyList',
  component: () => import('@/views/MobileSite/MobilePage/Reply/index.vue'),
},
{
  path: '/mobile/flowDetail',
  component: () => import('@/views/MobileSite/MobilePage/FlowDetail/index.vue'),
},
{
  path: '/mobile/index',
  component: () => import('@/views/MobileSite/MobilePage/Home/index.vue'),
},
{
  path: '/mobile/formTranslate',
  component: () => import('@/views/MobileSite/MobilePage/modelAnalysis/modelList.vue')
},
{
  path: '/mobile/modelList',
  component: () => import('@/views/MobileSite/MobilePage/modelAnalysis/modelList.vue')
},
{
  path: '/mobile/modelForm',
  component: () => import('@/views/MobileSite/MobilePage/modelAnalysis/modelList.vue')
},
{
  path: '/mobile/editModel',
  component: () => import('@/views/MobileSite/MobilePage/modelAnalysis/editModel.vue')
},
{
  path: '/mobile/dingding',
  component: () => import('@/views/MobileSite/MobilePage/Sign/index.vue')
},
// {
//   path: '/mobile',
//   component: () => import('@/views/MobileSite/MobilePage/Login/index.vue'),
// },
{
  path: '/mobile/done',
  component: () => import('@/views/mobile/done')
},
{
  path: '/mobile/affair',
  component: () => import('@/views/mobile/affair')
},
{
  path: '/mobile/todoDet',
  component: () => import('@/views/mobile/todoDet')
},
{
  path: '/biz/sbgl/point',
  component: () => import('@/views/biz/sbgl/point_m')
},
{
  path: '/biz/sbgl/spot',
  component: () => import('@/views/biz/sbgl/spot_m')
},
{
  path: '/biz/sbgl/repairs',
  component: () => import('@/views/biz/sbgl/repairs_m')
},
{
  path: '/biz/sbgl/message',
  component: () => import('@/views/biz/sbgl/message_m')
},
{
  path: '/biz/sbgl/record',
  component: () => import('@/views/biz/sbgl/record_m')
},
{
  path: '/biz/sbgl/datum',
  component: () => import('@/views/biz/sbgl/datum_m')
},
{
  path: '/biz/sbgl/check',
  component: () => import('@/views/biz/sbgl/check_m')
},
{
  path: '/biz/sbgl/equipment',
  component: () => import('@/views/biz/sbgl/equipment_m')
},
{
  path: '/formDesign',
  component: () => import('@/views/formDesignPage/index.vue')
},
{
  path: '/mobile/crm/customerList',
  component: () => import('@/views/biz/crm/customerReception_m')
},
{
  path: '/mobile/crm/customerAddm',
  component: () => import('@/views/biz/crm/components/customerJDAdd_m')
},
{
  path: '/mobile/crm/giftList',
  component: () => import('@/views/biz/crm/gift_m')
},
{
  path: '/mobile/crm/giftAddm',
  component: () => import('@/views/biz/crm/components/giftAdd_m')
},
{
  path: '/quality/testList',
  component: () => import('@/views/quality/testList_m.vue')
},
{
  path: '/quality/test',
  component: () => import('@/views/quality/test_m.vue')
},
{
  path: '/quality/testRecordList',
  component: () => import('@/views/quality/testRecordList_m.vue')
},
{
  path: '/quality/testRecord',
  component: () => import('@/views/quality/testRecord_m.vue')
},
{
  path: '/quality/unqualifiedList',
  component: () => import('@/views/quality/unqualifiedList_m.vue')
},
{
  path: '/quality/unqualified',
  component: () => import('@/views/quality/unqualified_m.vue')
},
{
  path: '/quality/orderTicket_m',
  component: () => import('@/views/quality/orderTicket_m.vue')
},
{
  path: '/equipment/orderTicket',
  component: () => import('@/views/work/biz/equipment/orderTicket')
},
{
  path: '/office/glzdfb',
  component: () => import('@/views/work/biz/equipment/glzdsqfb_m')
},
{
  path: '/cs/workOrder',
  component: () => import('@/views/biz/cs/workOrder_m')
},
{
  path: '/AppModel',
  component: () => import('@/views/MobileSite/MobilePage/AppModel/index.vue')
}
]
