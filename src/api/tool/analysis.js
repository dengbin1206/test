import request from '@/router/axios';
  //详情
  export const formById = (row) => {
    return request({
      url: '/api/blade-dynamic/dynamicForm/findById',
      method: 'post',
      data: row
    })
  }
  //表单提交
  export const formSave = (row) => {
    return request({
      url: '/api/blade-dynamic/dynamicForm/formSave',
      method: 'post',
      data: row
    })
  }
  //表格数据查找
  export const formSearchPage = (row) => {
    return request({
      url: '/api/blade-dynamic/dynamicForm/loadPage',
      method: 'post',
      data: row
    })
  }
  //表格数据查找
  export const formSearchNoPage = (row) => {
    return request({
      url: '/api/blade-dynamic/dynamicForm/loadNotPage',
      method: 'post',
      data: row
    })
  }
