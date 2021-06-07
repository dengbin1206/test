// import {cityJson} from './city'


export default [{
    title: '布局字段',
    list: [{
        type: 'group',
        title: '分组',
        label: '分组',
        icon: 'icon-group',
        display: true,
        arrow: false,
        collapse: true,
        children: {
          column: []
        }
      },
      // {
      //   type: 'dynamic',
      //   label: '子表单',
      //   title: '子表单',
      //   icon: 'icon-table',
      //   span: 24,
      //   display: true,
      //   children: {
      //     align: 'center',
      //     headerAlign: 'center',
      //     index: false,
      //     addBtn: true,
      //     delBtn: true,
      //     column: []
      //   }
      // },
      {
        type: 'tabs',
        title: '选项卡',
        label: "",
        prop:"tabs",
        formslot: true,
        span: 24,
        labelWidth: '0px',
        icon: 'icon-group',
        hideLable: false,
        display: true,
        // change:`()=>{console.log(1)}`,
        change:'',
        params: {
          option: {
            type: "border-card",
            position: "top",
            column: [{
                label: '选项卡1',
                prop: 'tab1',
                children: {
                  column: []
                },
              },
              {
                label: '选项卡2',
                prop: 'tab2',
                children: {
                  column: []
                },
              },
              {
                label: '选项卡3',
                prop: 'tab3',
                children: {
                  column: []
                },
              }
            ]
          }
        },
      },
      {
        type: 'label',
        title: '标签',
        label: '标签',
        icon: 'icon-title',
        prop:"title",
        span: 24,
        formslot:true,
        display: true,
        styles: {
          'font-size': '18px',
          color: '#000'
        },
        labelWidth: '0px',
        value: '标题',
      },
      {
        type: 'title',
        title: '标题',
        label: '标题',
        icon: 'icon-title',
        prop:"title",
        span: 24,
        formslot:true,
        display: true,
        styles: {
          'font-size': '18px',
          color: '#000'
        },
        labelWidth: '0px',
        value: '标题',
      },
      {
        type: 'divider',
        title: '分割线',
        label: "分割线",
        labelWidth: '0',
        component: 'elDivider', //ele分割线
        span: 24,
        icon: 'icon-map',
        direction: 'horizontal',
        params: {
          title: '分割线',
          html: '分割线',
          contentPosition: "left",
        }
      },
      {
        type: 'warning',
        title: '警告',
        label: "警告",
        component: 'elAlert',
        labelWidth: '0px',
        span: 24,
        showIcon: true,
        icon: 'el-icon-warning',
        tips: '看我：自定义事件怎么用？',
        center:false,
        params: {
          title: '警告警告警告警告',
          type: 'success'
        },
        styles:{
          color:'#f00'
        },
        event: {
          close: () => {
            console.log('alert关闭事件')
          }
        }
      },
      {
        type: 'crud',
        title: '表格',
        label: "",
        // component: 'elTable',
        labelWidth: '0',
        icon: 'icon-table',
        span: 24,
        tableDataType: "静态",
        event: {
          //新增数据保存的方法
          'row-save': () => {},
          //列删除的方法
          'row-del': () => {},
          //编辑
          'row-update': () => {
            console.log(1)
          }
        },
        params: {
          data: [],
          option: {
            addBtn: true,
            updateBtn: true,
            delBtn: true,
            editBtn: true,
            align: 'center',
            tip:false,
            refreshBtn:false,
            columnBtn:false,
            menuAlign: 'center',
            border:true,
            column: [/*{
                label: '名称1',
                prop: '字段1'
              },
              {
                label: '名称2',
                prop: '字段2'
              },*/
            ]
          }
        },
        display: true,
      },
    ]
  },
  {
    title: '输入字段',
    list: [{
        type: 'input',
        title: '单行文本',
        label: '单行文本',
        inputValue: '',
        inputParent: [],
        slot:"哈哈",
       style:{
          color: 'red'
        },
        hideLable: false,
        icon: 'icon-input',
        span: 24,
        display: true
      }, {
        type: 'password',
        title: '密码',
        label: '密码',
        // autocomplete: "new-password",
        icon: 'icon-password',
        readonly:false,
        span: 24,
        display: true,
        showPassword: true
      }, {
        type: 'textarea',
        title: '多行文本',
        label: '多行文本',
        icon: 'icon-textarea',
        span: 24,
        display: true
      }, {
        type: 'number',
        title: '计数器',
        label: '计数器',
        icon: 'icon-number',
        controls: true,
        span: 24,
        display: true,
      },
      {
        type: 'array',
        title: '数组',
        label: '数组',
        icon: 'icon-array',
        span: 24,
        display: true,
      },
      {
        type: 'map',
        title: '地图',
        label: '地图',
        icon: 'icon-map',
        component: 'avue-input-map',
        defaultLocation: false,
        params: {
          params:{
            zoom: 20,  // 地图缩放
            center: [116.397428, 39.90923],  // 初始中心
            lng: 0,  //经纬度
            lat: 0,
            loaded: false,
          }
        },
        value:[116.397428, 39.90923,'天安门'],
        span: 24,
        display: true
      }, {
        // 富文本需要单独引入
        type: 'ueditor',
        title: '富文本',
        label: '富文本',
        component: 'avue-ueditor',
        icon: 'icon-richtext',
        span: 24,
        display: true,
        options: {
          action:'/api/blade-resource/affix/asyncUpload',
          oss: '',
          props: {},
          ali: {},
          qiniu: {},
        }
      }
    ]
  },
  {
    title: '选择字段',
    list: [{
        type: 'radio',
        title: '单选框组',
        label: '单选框组',
        icon: 'icon-radio',
        dicData: [{
            label: '选项一',
            value: '0'
          },
          {
            label: '选项二',
            value: '1'
          },
          {
            label: '选项三',
            value: '2'
          },
        ],
        span: 24,
        display: true,
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      }, {
        type: 'checkbox',
        title: '多选框组',
        label: '多选框组',
        icon: 'icon-checkbox',
        value: '0',
        dicData: [{
            label: '选项一',
            value: '0'
          },
          {
            label: '选项二',
            value: '1'
          },
          {
            label: '选项三',
            value: '2'
          },
        ],
        span: 24,
        display: true,
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      }, {
        type: 'select',
        title: '下拉选择',
        label: '下拉选择',
        icon: 'icon-select',
        filterable: true, //带搜索
        defaultFirstOption: true, //按下回车默认第一个选项
        dicData: [{
            label: '选项一',
            value: 0
          },
          {
            label: '选项二',
            value: 1
          },
          {
            label: '选项三',
            value: 2
          },
        ],
        // 用于做级联配置
        cascaderItem: [],
        span: 24,
        display: true,
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      }, {
        type: 'cascader',
        title: '级联选择',
        label: '级联选择',
        icon: 'icon-link',
        span: 24,
        display: true,
        tags: true, //是否折叠
        multiple: false, //多选
        filterable: true, //带搜索
        checkStrictly: false, //父子节点不互相关联
        emitPath: true, //是否返回父级是谁
        cascaderIndex: 1,
        showAllLevels: true, //显示选中值的完整路径
        dicOption: 'static',
        separator: "/", //分隔符111
        dicData: [{
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
          {
            label: '选项二',
            value: 1
          },
          {
            label: '选项三',
            value: 2
          },
        ],
        props: {
          label: 'label',
          value: 'value'
        }
      }, {
        type: 'tree',
        title: '树形选择',
        label: '树形选择',
        icon: 'icon-tree',
        span: 24,
        display: true,
        dicOption: 'static',
        multiple: true, //多选
        accordion: true, //只有一个同级节点展开
        dicData: [{
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
          {
            label: '选项二',
            value: 1
          },
          {
            label: '选项三',
            value: 2
          },
        ],
        parent: true,
        props: {
          label: 'label',
          value: 'value'
        }
      }, {
        type: 'cascader',
        title: '省市级联动',
        label: '省市级联动',
        icon: 'icon-link',
        span: 24,
        type2: "省市级",
        display: true,
        tags: true, //是否折叠
        multiple: false, //多选
        filterable: true, //带搜索
        checkStrictly: true, //父子节点不互相关联
        emitPath: true, //是否返回父级是谁
        cascaderIndex: 1,
        dataLevel:3,
        showAllLevels: true, //显示选中值的完整路径
        dicOption: 'static',
        // params: {
        //   'check-strictly': true
        // },
        separator: "/", //分隔符
        dicData: [],
        props: {
          label: 'title',
          value: 'value'
        }
      },
      {
        type: 'input-table',
        title: '表格选择器',
        label: '表格选择器',
        action:'',
        span: 24,
        component: 'avue-input-table',
        icon: 'icon-input',
        delimiter:'-',
        data: [],
        children: {
          border: true,
          column: [{
            label: '姓名',
            width: 120,
            search: true,
            searchSpan: 24,
            prop: 'name'
          }, {
            label: '性别',
            prop: 'sex',
          }],
        },
        props: {
          label: 'name',
          value: 'code'
        },
      },
      {
        type: 'cascader',
        title: '部门选择',
        label: '部门选择',
        icon: 'icon-select',
        span: 24,
        display: true,
        multiple: false, //多选
        dicData: [{
            label: '总经办',
            value: 0
          },
          {
            label: '市场部',
            value: 1,
            children: [{
              label: '市场一部',
              value: 11,
            }, {
              label: '市场二部',
              value: 12,
            }]
          },
          {
            label: '财务部',
            value: 2
          },
        ],
        // 用于做级联配置
        cascaderItem: [],
        dicOption: 'static',
        props: {
          label: 'label',
          value: 'value'
        }
      },
      {
        type: 'table',
        title: '用户选择',
        label: '用户选择',
        prop:"table",
        span: 24,
        formslot:true,
        display:true,
        icon: 'icon-input',
        children: {
          border: true,
          column: [],
        },
        // formatter: (row) => {
        //   if (!row.name) return ''
        //   return row.name + '-' + row.sex
        // },
        // onLoad: ({
        //   page,
        //   value,
        //   data
        // }, callback) => {
        //   //首次加载去查询对应的值
        //   if (value) {
        //     this.$message.success('首次查询' + value)
        //     callback({
        //       id: '0',
        //       name: '张三',
        //       sex: '男'
        //     })
        //     return
        //   }
        //   //分页查询信息
        //   callback({
        //     total: 2,
        //     data: [{
        //       id: '0',
        //       name: '张三',
        //       sex: '男'
        //     }, {
        //       id: '1',
        //       name: '李四',
        //       sex: '女'
        //     }]
        //   })
        // },
        // props: {
        //   label: 'name',
        //   value: 'id'
        // },
      },
      {
        type: 'input-table-country',
        assignType:'ass_static',//ass_static 静态数据,ass_remote 远程动态数据
        assRuleCode:'country',//预定义数据
        title: '国家',
        label: '国家',
        span: 24,
        component: 'avue-input-table',
        icon: 'icon-input',
        data: [],
        children: {
          border: true,
          column: [{
            label: '编码',
            width: 120,
            search: true,
            searchSpan: 24,
            prop: 'name'
          }, {
            label: '名称',
            prop: 'name'
          }],
        },
      }
    ]
  },
  {
    title: '日期时间字段',
    list: [{
        type: 'date',
        title: '日期',
        label: '日期',
        icon: 'icon-date',
        editable:true,
        span: 24,
        display: true,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd'
      },
      {
        type: 'datetime',
        title: '日期时间',
        label: '日期时间',
        icon: 'icon-date',
        editable:true,
        span: 24,
        format: "yyyy-MM-dd hh:mm:ss",
        valueFormat: "timestamp",
      },
      {
        title: '日历',
        label: '日历',
        type: 'calendar',
        // labelWiWdth: '40px',
        icon: 'icon-map',
        component: 'elCalendar', //ele日期
        span: 24,
        params: {

        }
      },
    ],
  },
  {
    title: '上传字段',
    list: [{
        type: 'upload',
        action:'/api/blade-resource/affix/asyncUpload',
        title: '文件上传',
        label: '文件上传',
        icon: 'icon-upload',
        span: 24,
        display: true,
        showFileList: true,
        multiple: true,
        limit: 10,
        // props: {},
        propsHttp: {},
        canvasOption: {},
        headersConfig: [],
        dataConfig: [],
        isImg:false
      },
      {
        type: 'upload',
        action:'/api/blade-resource/affix/asyncUpload',
        title: '图片上传',
        label: '图片上传',
        icon: 'icon-img',
        span: 24,
        display: true,
        showFileList: true,
        multiple: true,
        limit: 10,
        // props: {},
        propsHttp: {},
        canvasOption: {},
        headersConfig: [],
        dataConfig: [],
        isImg:true,
        listType:'picture',
        accept: ['jpg', 'png', 'gif', 'bpm']
      }
    ],
  },
  {
    title: '其他',
    list: [
      {
        title: '按钮',
        label: '',
        type: "button",
        icon: 'icon-copy',
        component: "el-button",
        span: 6,
        display: true,
        value:'按钮',
        // click:"()=>{console.log(1)}",
        chick:'',
        event: {
          click: () => {}
        },
        params: {
          html: '按钮',
          type:"primary",
        }
      },
      {
        type: 'switch',
        label: '开关',
        title: '开关',
        icon: 'icon-switch',
        span: 24,
        display: true,
        value: 0,
        dicData: [{
          label: '',
          value: '0'
        }, {
          label: '',
          value: '1'
        }]
      }, {
        type: 'slider',
        title: '滑块',
        label: '滑块',
        // title:'滑块',
        icon: 'icon-slider',
        span: 24,
        display: true,
        min: 0,
        max: 10
      },
      {
        type: 'icon',
        title: '图标',
        label: '图标',
        icon: 'icon-icon',
        span: 24,
        display: true,
        iconList: [{
          label: '基本图标',
          list: ['el-icon-sminfo', 'el-icon-smerro', 'el-icon-smques', 'el-icon-smwarn']
        }, {
          label: '红绿灯',
          list: ['el-icon-sstlg', 'el-icon-sstlr', 'el-icon-sstly']
        }, {
          label: '其他图标',
          list: ['el-icon-sclansw', 'el-icon-sgiscol', 'el-icon-sgisdem', 'el-icon-sgispie', 'el-icon-sgissym']
        }]
      },
      // {
      //   type: 'icon',
      //   title: '图标',
      //   label: '图标',
      //   icon: 'icon-icon',
      //   span: 24,
      //   display: true,
      //   iconList: [{
      //     label: '基本图标',
      //     list: ['el-icon-info', 'el-icon-error', 'el-icon-error', 'el-icon-success', 'el-icon-warning', 'el-icon-question']
      //   }, {
      //     label: '方向图标',
      //     list: ['el-icon-info', 'el-icon-back', 'el-icon-arrow-left', 'el-icon-arrow-down', 'el-icon-arrow-right', 'el-icon-arrow-up']
      //   }, {
      //     label: '符号图标',
      //     list: ['el-icon-plus', 'el-icon-minus', 'el-icon-close', 'el-icon-check']
      //   }]
      // },
      {
        type: 'rate',
        title: '评价',
        label: '评价',
        icon: 'icon-star',
        span: 24,
        display: true,
        max: 5,
        value: 0,
        texts: ['极差', '失望', '一般', '满意', '惊喜'],
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      },
    ]
  }

]
