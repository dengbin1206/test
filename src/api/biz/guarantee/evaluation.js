import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-crm/standard/list',
      method: 'post',
      data:data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/standard/submit',
      method: 'post',
      data:data
    })
  }

  export const remove = (id) => {
    return request({
      url: 'api/blade-crm/standard/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }