import request from '@/router/axios';

export const getList = (data) => {
    return request({
      url: '/api/blade-crm/bidServiceCharge/selectPage',
      method: 'post',
      data: data
    })
  }

  export const getDetail = (bidServiceChargeId ) => {
    return request({
      url: '/api/blade-crm/bidServiceCharge/detail',
      method: 'get',
      params: {
        bidServiceChargeId 
      }
    })
  }

  export function flowList(modelId,dataId) {
    return request({
      url: '/api/blade-flow/task/flowListByDataId',
      method: 'get',
      params: {
        modelId,
        dataId
      }
    })
  }

  export const serviceSubmit = (data) => {
    return request({
      url: 'api/blade-crm/bidServiceCharge/submit',
      method: 'post',
      data:data
    })
  }

  export const getCustomerName = (search) => {
    return request({
      url: '/api/blade-crm/customer/blurrySelect',
      method: 'get',
      params: {
        search,
      }
    })
  }

  export const getContractCode = (search ) => {
    return request({
      url: '/api/blade-crm/contract/getContractBySearch',
      method: 'get',
      params: {
        search 
      }
    })
  }

  export const getProjectNumber = (search) => {
    return request({
      url: '/api/blade-crm/project/getProjectInfo',
      method: 'get',
      params: {
        search,
      }
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