import request from '@/router/axios';

export const getList = (data) => {
    return request({
      url: '/api/blade-crm/customerReception/selectPage',
      method: 'post',
      data: data
    })
  }
  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/customerReception/submit',
      method: 'post',
      data:data
    })
  }

  export const getDetail = (customerReceptionId) => {
    return request({
      url: '/api/blade-crm/customerReception/detail',
      method: 'get',
      params: {
        customerReceptionId
      }
    })
  }

  export const getFixedValue = (modelName) => {
    return request({
      url: '/api/blade-dynamic/dynamicConfig/addDefaultValueByModelName',
      method: 'get',
      params:{
        modelName
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

  export const remove = (ids) => {
    return request({
      url: '/api/blade-crm/customerReception/remove',
      method: 'get',
      params: {
        ids,
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

  export const getCustomerName = (search) => {
    return request({
      url: '/api/blade-crm/customer/blurrySelect',
      method: 'get',
      params: {
        search,
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

  export const getVisitUser = () => {
    return request({
      url: '/api/blade-crm/customerReception/selectList',
      method: 'get',
    })
  }