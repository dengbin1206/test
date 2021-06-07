import request from '@/router/axios';

export const getList = (data) => {
    return request({
      url: '/api/blade-crm/qualityProcedure/selectPage',
      method: 'post',
      data: data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/qualityProcedure/submit',
      method: 'post',
      data:data
    })
  }

  export const remove = (ids) => {
    return request({
      url: '/api/blade-crm/qualityProcedure/remove',
      method: 'get',
      params: {
        ids,
      }
    })
  }