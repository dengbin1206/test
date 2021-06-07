import { iconList } from './utils/iconList'
export default [
  {
    title: '布局组件',
    list: [{
      type: 'group',
      label: '分组',
      icon: 'iconfont-appstore',
      display: true,
      arrow: false,
      collapse: true,
      desc: '将列表分组，并命名',
      children: {
        column: []
      }
    }, {
      type: 'dynamic',
      label: '子表单',
      icon: 'iconfont-table',
      span: 24,
      display: true,
      children: {
        align: 'center',
        headerAlign: 'center',
        index: false,
        addBtn: true,
        delBtn: true,
        column: []
      }
    }, {
      type: 'title',
      icon: 'iconfont-font-size',
      span: 24,
      display: true,
      styles: {
        fontSize: '18px',
        color: '#000'
      },
      label: '标题',
      labelWidth: '0px',
      value: '',
    },

      // {
      //   type: 'tabs',
      //   icon: 'iconfont-layout',
      //   span: 24,
      //   display: true,
      //   label: '标签页',
      //   option: {
      //     type: '',
      //     column: [{
      //       icon: '',
      //       label: '选项卡1',
      //       prop: 'tab1',
      //       formColumn: []
      //     }, {
      //       icon: '',
      //       label: '选项卡2',
      //       prop: 'tab2',
      //       formColumn: []
      //     }, {
      //       icon: '',
      //       label: '选项卡3',
      //       prop: 'tab3',
      //       formColumn: []
      //     }],
      //   },
      // }
    ]
  },
  {
    title: '常用组件',
    list: [
      {
        type: 'input',
        label: '文本框',
        icon: 'icon-input',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
      }, {
        type: 'number',
        label: '数字框',
        icon: 'iconfont-Field-Binary',
        controls: false,
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false
      },
      {
        type: 'textarea',
        label: '多行文本',
        icon: 'icon-textarea',
        span: 24,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false
      }, {
        type: 'date',
        label: '日期',
        icon: 'icon-date',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd'
      }, {
        type: 'datetime',
        label: '日期时间',
        icon: 'icon-datetime',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      }, {
        type: 'time',
        label: '时间',
        icon: 'icon-time',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss'
      }, {
        type: 'timerange',
        label: '时间范围',
        icon: 'icon-time-range',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss'
      }, {
        type: 'daterange',
        label: '日期范围',
        icon: 'iconfont-calendar',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd'
      }, {
        type: 'datetimerange',
        label: '日期时间范围',
        icon: 'icon-datetime-range',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      }, {
        type: 'year',
        label: '年',
        icon: 'icon-year',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'yyyy',
        valueFormat: 'yyyy'
      }, {
        type: 'month',
        label: '月',
        icon: 'icon-month',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'MM',
        valueFormat: 'MM'
      }, {
        type: 'week',
        label: '周',
        icon: 'icon-week',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        format: 'yyyy 第 WW 周',
      },
      {
        type: 'radio',
        label: '单选框',
        icon: 'iconfont-yunongtongdanxuanxuanzhong',
        dicData: [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
        ],
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      }, {
        type: 'checkbox',
        label: '多选框',
        icon: 'iconfont-check-square',
        dicData: [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
        ],
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      },
      {
        type: 'select',
        label: '下拉单选',
        icon: 'icon-select',
        dicData: [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
        ],
        // 用于做级联配置
        cascaderItem: [],
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      },
      {
        type: 'multipleSelect',
        label: '下拉多选',
        icon: 'icon-select',
        dicData: [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
        ],
        // 用于做级联配置
        cascaderItem: [],
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      },
      {
        type: 'userSelect',
        label: '用户选择',
        icon: 'icon-select',
        dicData: [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
        ],
        // 用于做级联配置
        cascaderItem: [],
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      },
      {
        type: 'deptSelect',
        label: '部门选择',
        icon: 'icon-tree',
        span: 12,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        dicOption: 'remote',
        dicData: [],
        props: {
          label: 'label',
          value: 'value'
        },
        parent: true,
      },
      {
        type: 'upload',
        label: '附件上传',
        icon: 'iconfont-cloud',
        span: 24,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        showFileList: true,
        multiple: true,
        limit: 10,
        propsHttp: {},
        canvasOption: {},
        headersConfig: [],
        dataConfig: [],
      },
      {
        type: 'imgUpload',
        label: '图片上传',
        icon: 'iconfont-image',
        span: 24,
        display: true,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
        disabled: false,
        addDisabled: false,
        editDisabled: false,
        showFileList: true,
        multiple: true,
        limit: 10,
        propsHttp: {},
        canvasOption: {},
        headersConfig: [],
        dataConfig: [],
        listType: "picture",
        accept: "image/*",
      }]
  },
  {
    title: '其他组件',
    list: [{
      type: 'password',
      label: '密码输入框',
      icon: 'iconfont-lock',
      span: 12,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false
    }, {
      type: 'url',
      label: '超链接',
      icon: 'iconfont-link',
      span: 24,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false
    }, {
      type: 'array',
      label: '数组',
      icon: 'iconfont-pc',
      span: 24,
      desc: '表格录入,支持多行添加',
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false
    }, {
      type: 'img',
      label: '图片',
      icon: 'iconfont-image',
      span: 24,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false
    }, {
      type: 'map',
      component: 'avue-input-map',
      label: '地图选择',
      icon: 'iconfont-location',
      span: 24,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false
    }, {
      type: 'cascader',
      label: '级联选择',
      icon: 'icon-link',
      span: 12,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false,
      dicData: [
        {
          label: '选项一',
          value: 0,
          children: [{
            label: '选项1-1',
            value: 11,
          }, {
            label: '选项1-2',
            value: 12,
          }]
        },
        { label: '选项二', value: '1' },
        { label: '选项三', value: '2' },
      ],
      cascaderIndex: 1,
      showAllLevels: true,
      dicOption: 'static',
      separator: "/",
      props: {
        label: 'label',
        value: 'value'
      }
    }, {
      type: 'tree',
      label: '树形选择',
      icon: 'icon-tree',
      span: 12,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false,
      dicOption: 'static',
      dicData: [
        {
          label: '选项一',
          value: 0,
          children: [{
            label: '选项1-1',
            value: '11',
          }, {
            label: '选项1-2',
            value: '12',
          }]
        },
        { label: '选项二', value: '1' },
        { label: '选项三', value: '2' },
      ],
      parent: true,
      props: {
        label: 'label',
        value: 'value'
      }
    },
    {
      type: 'icon',
      label: '图标',
      // component: 'avue-input-icon',
      icon: 'iconfont-eye',
      span: 12,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false,
      params: {
        iconList: iconList
      }
    }, {
      type: 'switch',
      label: '开关',
      icon: 'icon-switch',
      span: 12,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false,
      value: '0',
      dicData: [{ label: '', value: '0' }, { label: '', value: '1' }]
    }, {
      type: 'rate',
      label: '评价',
      icon: 'iconfont-star',
      span: 12,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false,
      max: 5,
      value: 0,
      texts: ['极差', '失望', '一般', '满意', '惊喜'],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    }, {
      type: 'slider',
      label: '滑块',
      icon: 'icon-slider',
      span: 12,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false,
      min: 0,
      max: 10
    }, {
      type: 'color',
      label: '颜色选择',
      icon: 'iconfont-yanse',
      span: 24,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false,
    },
    {
      type: 'ueditor',
      component: 'avue-ueditor',
      label: '富文本',
      icon: 'icon-richtext',
      span: 24,
      display: true,
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      disabled: false,
      addDisabled: false,
      editDisabled: false,
      action: '',
      oss: '',
      props: {},
      ali: {},
      qiniu: {}
    },
    {
      title: "分割线",
      label: '分割线',
      type: "el-divider",
      component: "el-divider", //ele分割线
      span: 24,
      icon: "el-icon-eleme",
      tips: "看我：自定义属性怎么用？",
      labelWidth: "0px",
      params: {
        html: '<h3 style="color:red">分割线标题</h3>',
        contentPosition: "left",
      },
    },
    {
      title: "警告",
      component: "el-alert",
      label: '警告',
      type: "el-alert",
      labelWidth: "0px",
      span: 24,
      icon: "el-icon-warning",
      tips: "看我：自定义事件怎么用？",
      params: {
        title: "警告警告警告警告",
        type: "success",
      },
      event: {
        close: () => {
          console.log("alert关闭事件");
        },
      },
    }]
  }
]
