/*
 * @Date: 2021-01-02 11:19:05
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-05 09:54:41
 * @FilePath: /SX-DTBF-VIEW/src/views/flow/ModelDesign/options.js
 * @Description:
 */

export const options = {
  border: true,
  stripe: true,
  tip: false,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  searchSize: 'mini',
  columnBtn: false,
  addBtn: false,
  menu: true,
  selection: true,
  searchShow: true,
  searchSpan: 10,
  editBtn: false,
  delBtn: false,
  menuWidth: 340,
  searchIcon: true,
  searchMenuSpan: 100,
  column: [{
      label: '流程分类',
      prop: 'modelCategory',
      type: 'select',
      dicData: [],
    },
    {
      label: '流程别名',
      prop: 'modelAlias',
      type: 'input',
    },
    {
      label: '流程名称',
      prop: 'name',
      type: 'input',
    },
    {
      label: '流程描述',
      prop: 'description',
      type: 'input',
    },
    {
      label: '模型Key',
      prop: 'modelKey',
      type: 'input',
    },
    {
      label: '流程版本',
      prop: 'version',
      type: 'input',
      slot: true,
      width: 80,
    },
    {
      label: '创建时间',
      prop: 'created',
      width: 165,
    },
  ]
}

export const formDetail = {
  border: true,
  stripe: true,
  tip: false,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  searchSize: 'mini',
  columnBtn: false,
  addBtn: false,
  menu: false,
  selection: false,
  searchShow: true,
  searchSpan: 10,
  editBtn: false,
  delBtn: false,
  menuWidth: 340,
  searchIcon: true,
  searchMenuSpan: 100,
  expand: true,
  rowKey: 'alias',
  column: [{
    label: '#',
    prop: 'id',
  }, {
    label: '节点名称',
    prop: 'alias',
  }, {
    label: '类型',
    prop: 'type',
    slot: true
  }, {
    label: '审批表单',
    prop: 'form',
  }, {
    label: '页面路由',
    prop: 'path',
  }]
}


export const formList = [{
    label: '流程别名',
    prop: "modelAlias",
    labelWidth: '80px',
    responseSize: 12,
    inputSize: 'small',
    type: 'input',
    disabled: false
  },
  {
    label: '流程名称',
    prop: "name",
    labelWidth: '80px',
    responseSize: 12,
    inputSize: 'small',
    type: 'input',
  }, {
    label: '流程描述',
    prop: "description",
    labelWidth: '80px',
    responseSize: 12,
    inputSize: 'small',
    type: 'textarea'
  },
  {
    label: '流程分类',
    prop: "modelCategory",
    labelWidth: '80px',
    responseSize: 12,
    inputSize: 'small',
    type: 'select',
    width: '100%',
  }
]
