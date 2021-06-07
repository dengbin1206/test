import request from '@/router/axios';

export const getList = (data) => {
    return request({
      url: '/api/blade-crm/performanceBond/selectPage',
      method: 'post',
      data: data
    })
  }

  export const getDetail = (performanceBondId ) => {
    return request({
      url: '/api/blade-crm/performanceBond/detail',
      method: 'get',
      params: {
        performanceBondId 
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
  
  export const getProjectNumber = (search) => {
    return request({
      url: '/api/blade-crm/project/getProjectInfo',
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
  
  export const getCustomerName = (search) => {
    return request({
      url: '/api/blade-crm/customer/blurrySelect',
      method: 'get',
      params: {
        search,
      }
    })
  }

  export const performanceSubmit = (data) => {
    return request({
      url: 'api/blade-crm/performanceBond/submit',
      method: 'post',
      data:data
    })
  }

  export const performanceReturn = (performanceBondId ) => {
    return request({
      url: '/api/blade-crm/performanceBond/selectReturn',
      method: 'get',
      params: {
        performanceBondId 
      }
    })
  }

  export const performanceReturnSubmit = (data) => {
    return request({
      url: 'api/blade-crm/performanceBond/saveReturn',
      method: 'post',
      data:data
    })
  }