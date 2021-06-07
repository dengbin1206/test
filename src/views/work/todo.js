/*
 * @Date: 2021-01-06 10:35:34
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-10 11:41:19
 * @FilePath: /SX-DTBF-VIEW/src/views/work/todo.js
 * @Description: 
 */

export const option = {
  border: true,
  stripe: true,
  tip: false,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  searchSize: 'mini',
  columnBtn: false,
  addBtn: false,
  selection: false,
  searchShow: true,
  searchSpan: 10,
  editBtn: false,
  delBtn: false,
  searchIcon: true,
  searchMenuSpan: 100,
  column: [
    {
      label: '流程名',
      prop: 'processDefinitionName',
    },
    {
      label: '当前环节',
      prop: 'taskName',
    },
    {
      label: '事务编号',
      prop: 'processInstanceId',
      width: 220,
    },
    {
      label: '事务标题',
      prop: 'title',
    }, {
      label: '发起人',
      prop: 'userName',
    }, {
      label: '发起人公司',
      prop: 'companyName',
    }, {
      label: '发起人部门',
      prop: 'deptName',
    }, {
      label: '上一处理人',
      prop: 'lastUserName',
    }, {
      label: '事务状态',
      prop: 'processStatus',
      slot: true,
     }, {
      label: '修改时间',
      prop: 'createTime',
    },
  ]
}
