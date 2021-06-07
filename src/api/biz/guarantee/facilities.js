import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-crm/facility/list',
      method: 'post',
      data:data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/facility/submit',
      method: 'post',
      data:data
    })
  }

  export const remove = (id) => {
    return request({
      url: 'api/blade-crm/facility/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }