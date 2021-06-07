export const optionParent = {
    height: 'auto',
    calcHeight: 95,
    tip: false,
    border: true,
    index: true,
    selection: true,
    viewBtn: true,
    menuWidth: 140,
    dialogWidth: 880,
    dialogClickModal: false,
    column: [
      {
        label: "参数编号",
        prop: "paramCode",
        span: 24,
        rules: [
          {
            required: true,
            message: "请输入字典编号",
            trigger: "blur"
          }
        ]
      },
      {
        label: "参数名",
        prop: "paramName",
        span: 24,
        rules: [
          {
            required: true,
            message: "请输入字典编号",
            trigger: "blur"
          }
        ]
      },
      {
        label: "参数描述",
        prop: "remark",
        type:'textarea',
        span:24,
        hide: true
      }
    ]
  };
  
  export const optionChild = {
    height: 'auto',
    calcHeight: 95,
    tip: false,
    tree: true,
    border: true,
    index: true,
    selection: true,
    viewBtn: true,
    menuWidth: 140,
    dialogWidth: 880,
    dialogClickModal: false,
    column: [
      {
        label: "上级参数",
        prop: "parentId",
        type: "tree",
        span:24,
        dicData: [],
        hide: true,
        props: {
          label: "title"
        },
        addDisabled: true,
        editDisabled: true
      },
      {
        label: "参数编号",
        prop: "paramCode",
        addDisabled: true,
        editDisabled: true,
        span: 24,
        hide:true,
        rules: [
          {
            required: true,
            message: "请输入字典编号",
            trigger: "blur"
          }
        ]
      },
        {
          label: "参数键",
          prop: "paramKey",
          span: 24,
          align: "center",
          rules: [
            {
              required: true,
              message: "请输入字典名称",
              trigger: "blur"
            }
          ]
        },
        {
          label: "参数值",
          prop: "paramValue",
          type: "input",
          align: "center",
          span: 24,
          width: 80,
          rules: [
            {
              required: true,
              message: "请输入参数值",
              trigger: "blur"
            }
          ]
        },
        {
            label: "封存",
            prop: "isSealed",
            type: "switch",
            align: "center",
            width: 80,
            dicData: [
              {
                label: "否",
                value: 0
              },
              {
                label: "是",
                value: 1
              }
            ],
            value: 0,
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择封存",
                trigger: "blur"
              }
            ]
          },
        {
          label: "备注",
          prop: "remark",
          type:'textarea',
          span:24,
        }
      ]
  };
  