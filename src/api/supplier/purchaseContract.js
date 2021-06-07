import request from '@/router/axios';

export const getContractCode = (search ) => {
    return request({
      url: '/api/blade-crm/contract/getContractBySearch',
      method: 'get',
      params: {
        search 
      }
    })
  }

  export const getList = (data) => {
    return request({
      url: '/api/blade-crm/purchaseContract/selectPage',
      method: 'post',
      data: data
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