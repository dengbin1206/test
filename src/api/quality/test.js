import request from '@/router/axios';

export const getList = (data) => {
    return request({
      url: '/api/blade-crm/qualityTestPro/selectPage',
      method: 'post',
      data: data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/qualityTestPro/submit',
      method: 'post',
      data:data
    })
  }

  export const remove = (ids) => {
    return request({
      url: '/api/blade-crm/qualityTestPro/remove',
      method: 'get',
      params: {
        ids,
      }
    })
  }

  export const getParts = () => {
    return request({
      url: 'api/blade-crm/qualityComponent/select',
      method: 'get'
    })
  }

  export const getProcedure = () => {
    return request({
      url: 'api/blade-crm/qualityProcedure/select',
      method: 'get'
    })
  }