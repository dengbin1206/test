import request from '@/router/axios';

export const getList = (data) => {
    return request({
      url: '/api/blade-crm/advanceInvoice/selectPage',
      method: 'post',
      data: data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/advanceInvoice/submit',
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

  export const getProjectNumber = (search) => {
    return request({
      url: '/api/blade-crm/project/getProjectInfo',
      method: 'get',
      params: {
        search,
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

  export const getFixedValue = (modelName) => {
    return request({
      url: '/api/blade-dynamic/dynamicConfig/addDefaultValueByModelName',
      method: 'get',
      params:{
        modelName
      }
    })
  }

  export const getDetail = (advanceId ) => {
    return request({
      url: '/api/blade-crm/advanceInvoice/detail',
      method: 'get',
      params: {
        advanceId 
      }
    })
  }

  export const remove = (ids) => {
    return request({
      url: '/api/blade-crm/advanceInvoice/remove',
      method: 'get',
      params: {
        ids,
      }
    })
  }

 

  export const advanceReturn = (advanceId ) => {
    return request({
      url: '/api/blade-crm/advanceInvoice/selectReturn',
      method: 'get',
      params: {
        advanceId 
      }
    })
  }

  export const advanceReturnSubmit = (data) => {
    return request({
      url: 'api/blade-crm/advanceInvoice/saveReturn',
      method: 'post',
      data:data
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