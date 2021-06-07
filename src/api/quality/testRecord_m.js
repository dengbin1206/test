import request from '@/router/axios';

export const getData = (testId) => {
    return request({
      url: '/api/blade-crm/test/detail',
      method: 'get',
      params: {
        testId,
      }
    })
  }

  export const getSaleOrderNumber = (search) => {
    return request({
      url: '/api/blade-crm/sale/getByOrderNum',
      method: 'get',
      params: {
        search,
      }
    })
  }

  export const getContractCode = (search) => {
    return request({
      url: '/api/blade-crm/sale/getByOrderNum',
      method: 'get',
      params: {
        search,
      }
    })
  }

  export const getInspection = (search) => {
    return request({
      url: '/api/blade-crm/qualityComponent/selectList',
      method: 'get',
      params: {
        search,
      }
    })
  }

  export const getTestContent = (componentCode,testNumber,id) => {
    return request({
      url: '/api/blade-crm/test/selectBjList',
      method: 'get',
      params: {
        componentCode,
        testNumber,
        id
      }
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/test/submit',
      method: 'post',
      data:data
    })
  }

  export const getUserName = (search) => {
    return request({
      url: '/api/blade-user/getUserInfoBySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }