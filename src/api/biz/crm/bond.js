import request from '@/router/axios';

export const getList = (data) => {
    return request({
      url: '/api/blade-crm/bidBond/selectPage',
      method: 'post',
      data: data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/bidBond/submit',
      method: 'post',
      data:data
    })
  }

  export const performanceSubmit = (data) => {
    return request({
      url: 'api/blade-crm/performanceBond/submit',
      method: 'post',
      data:data
    })
  }

  export const serviceSubmit = (data) => {
    return request({
      url: 'api/blade-crm/bidServiceCharge/submit',
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

  export const getFixedValue = (modelName) => {
    return request({
      url: '/api/blade-dynamic/dynamicConfig/addDefaultValueByModelName',
      method: 'get',
      params:{
        modelName
      }
    })
  }

  export const getDetail = (bidBondId ) => {
    return request({
      url: '/api/blade-crm/bidBond/detail',
      method: 'get',
      params: {
        bidBondId 
      }
    })
  }

  export const remove = (ids) => {
    return request({
      url: '/api/blade-crm/bidBond/remove',
      method: 'get',
      params: {
        ids,
      }
    })
  }

  export const turnDetailPerformance = (bidBondId ) => {
    return request({
      url: '/api/blade-crm/bidBond/selectDetailPerformance',
      method: 'get',
      params: {
        bidBondId 
      }
    })
  }

  export const turnDetailService = (bidBondId ) => {
    return request({
      url: '/api/blade-crm/bidBond/selectDetailCharge',
      method: 'get',
      params: {
        bidBondId 
      }
    })
  }

  export const bondReturn = (bidBondId ) => {
    return request({
      url: '/api/blade-crm/bidBond/selectReturn',
      method: 'get',
      params: {
        bidBondId 
      }
    })
  }

  export const bondReturnSubmit = (data) => {
    return request({
      url: 'api/blade-crm/bidBond/saveReturn',
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
  export const invoiceBack = (bidServiceChargeId ) => {
    return request({
      url: '/api/blade-crm/bidServiceCharge/selectInvoiceRecovery',
      method: 'get',
      params: {
        bidServiceChargeId 
      }
    })
  }
  export const invoiceSubmit = (data) => {
    return request({
      url: 'api/blade-crm/bidServiceCharge/saveInvoiceRecovery',
      method: 'post',
      data:data
    })
  }

  export const performanceReturnSubmit = (data) => {
    return request({
      url: 'api/blade-crm/performanceBond/saveReturn',
      method: 'post',
      data:data
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