import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-crm/checkItem/list',
      method: 'post',
      data:data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/checkItem/submit',
      method: 'post',
      data:data
    })
  }

  export const remove = (id) => {
    return request({
      url: 'api/blade-crm/checkItem/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-crm/checkItem/detail',
      method: 'get',
      params:{
          id
      }
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