import request from '@/router/axios';


export const submit = (data) => {
    return request({
      url: 'api/blade-crm/bankGuarantee/submit',
      method: 'post',
      data:data
    })
  }

  export const getList = (data) => {
    return request({
      url: '/api/blade-crm/bankGuarantee/selectPage',
      method: 'post',
      data: data
    })
  }

  export const getDetail = (bankGuaranteeId) => {
    return request({
      url: '/api/blade-crm/bankGuarantee/detail',
      method: 'get',
      params: {
        bankGuaranteeId
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
      url: '/api/blade-crm/bankGuarantee/remove',
      method: 'get',
      params: {
        ids,
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

  export const getProjectNumber = (search) => {
    return request({
      url: '/api/blade-crm/contract/getContractBySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }

  export const getPaperContract = (search,projectReportNum) => {
    return request({
      url: '/api/blade-crm/contract/getPaperNumBySearch',
      method: 'get',
      params: {
        search,
        projectReportNum
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