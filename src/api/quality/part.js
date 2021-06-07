import request from '@/router/axios';

export const getList = (data) => {
    return request({
      url: '/api/blade-crm/qualityComponent/selectPage',
      method: 'post',
      data: data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/qualityComponent/submit',
      method: 'post',
      data:data
    })
  }

  export const remove = (ids) => {
    return request({
      url: '/api/blade-crm/qualityComponent/remove',
      method: 'get',
      params: {
        ids,
      }
    })
  }