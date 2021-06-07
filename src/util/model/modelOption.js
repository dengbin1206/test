const data={
  modelOption: {
    menuWidth:300,
    tip: false,
    addBtn: false,
    delBtn: false,
    page: true,
    index: true,
    refreshBtn: false,
    border: true,
    columnBtn: false,
    cancelBtn: false,
    editBtn: false,
    selection: true,
    searchBtn: false,
    stripe: true,
    selectClearBtn: false,
    reserveSelection: true,
    indexLabel: "序号",
    align: "center",
    menuAlign: "center",
    headerAlign: "center",
    column: [
      {
        label: "模型分类",
        prop: "tableType",
        type: "select",
        sortable: true,
        dicUrl: "/api/blade-system/dict-biz/dictionary?code=model_type",
        props:{
          label:'dictValue',
          value:'dictKey'
        },
        rules: [
          {
            required: true,
            message: "请输入模型分类",
            trigger: "blur"
          }
        ]
      },
      {
        label: "模型名",
        prop: "tableName",
        sortable: true,
        rules: [
          {
            required: true,
            message: "请输入模型名",
            trigger: "blur"
          }
        ]
      },
      {
        label: "模型描述",
        prop: "tableRemark",
        sortable: true,
        rules: [
          {
            required: true,
            message: "请输入模型描述",
            trigger: "blur"
          }
        ]
      },
      {
        label: "版本",
        prop: "ver",
        sortable: true,
        value: 1
      },
      {
        label: "同步数据库状态",
        labelWidth: 100,
        prop: "syncStatus",
        sortable: true,
        type: "select",
        dicData: [
          {
            label: "同步",
            value: 1
          },
          {
            label: "未同步",
            value: 0
          },
          {
            label: " ",
            value: 2
          }
        ],
        rules: [
          {
            required: true,
            message: "请选择数据库是否同步",
            trigger: "blur"
          }
        ]
      }
    ]
  },
  page:{
    pageSize: 10,
    currentPage: 1,
    total: 0
  },
  rules:{
    // tableName: [{ required: true, trigger: "blur" }],
    // tableRemark: [{ required: true, trigger: "blur" }]
  }
}


export default data
