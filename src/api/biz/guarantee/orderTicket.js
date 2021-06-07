import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-crm/entrust/list',
      method: 'post',
      data:data
    })
  }

  export const reportTypeBySearch = (search) => {
    return request({
      url: 'api/blade-crm/report/reportTypeBySearch',
      method: 'get',
      params:{
        search
      }
    })
  }

  export const save = (data) => {
    return request({
      url: 'api/blade-crm/entrust/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-crm/entrust/detail',
      method: 'get',
      params:{
        id
      }
    })
  }

  export const standardByReportId = (reportTypeId) => {
    return request({
      url: 'api/blade-crm/standard/standardByReportId',
      method: 'get',
      params:{
        reportTypeId
      }
    })
  }

  export const designByTypeId = (typeId) => {
    return request({
      url: 'api/blade-crm/report/designByTypeId',
      method: 'get',
      params:{
        typeId
      }
    })
  }

  export const selectCheck = (data) => {
    return request({
      url: 'api/blade-crm/record/selectCheck',
      method: 'post',
      data:data
    })
  }

  export const deletedById = (id) => {
    return request({
      url: 'api/blade-crm/entrust/deletedById',
      method: 'get',
      params:{
        id
      }
    })
  }

  export const selectBySearch = (search) => {
    return request({
      url: 'api/blade-crm/facility/selectBySearch',
      method: 'get',
      params:{
        search
      }
    })
  }



























