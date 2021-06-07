import request from '@/router/axios';

export const getList = (row) => {
    return request({
      url: '/api/blade-power/power/select-powerObj',
      method: 'post',
      data:row
    })
  }

export const add = (row) => {
    return request({
      url: '/api/blade-power/power/saveOrUpdate',
      method: 'post',
      data:row
    })
  }


  export const remove = (id) => {
    return request({
      url: '/api/blade-power/power/remove',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const getobjs = () => {
    return request({
      url: '/api/blade-power/power/list',
      method: 'get'
    })
  }


  export const getModels = (type) => {
    return request({
      url: '/api/blade-modelform/model/getSourceModel',
      method: 'get',
      params:{
        type
      }
    })
  }


  export const getCodes = () => {
    return request({
      url: '/api/blade-system/dict/parent-list',
      method: 'get'
    })
  }

  export const getCodesBiz = () => {
    return request({
      url: '/api/blade-system/dict-biz/parent-list',
      method: 'get'
    })
  }

  export const getModelCode = (tableId) => {
    return request({
      url: '/api/blade-modelform/model/getSourceCode',
      method: 'get',
      params:{
        tableId
      }
    })
  }

  export const detail = (id) => {
    return request({
      url: '/api/blade-power/power/detail',
      method: 'get',
      params:{
        id
      }
    })
  }