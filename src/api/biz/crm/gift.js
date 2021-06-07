import request from '@/router/axios';


export const queryFormInfo = (paramType,paramId) => {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/queryFormInfoNew',
    method: 'get',
    params: {
      paramType,
      paramId
    }
  })
}

export const submit = (data) => {
    return request({
      url: 'api/blade-crm/giftApplication/submit',
      method: 'post',
      data:data
    })
  }

  export const getList = (data) => {
    return request({
      url: '/api/blade-crm/giftApplication/selectPage',
      method: 'post',
      data: data
    })
  }

  export const getDetail = (giftApplicationId) => {
    return request({
      url: '/api/blade-crm/giftApplication/detail',
      method: 'get',
      params: {
        giftApplicationId
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

  export const getArea = () => {
    return request({
      url: '/api/blade-system/region/lazy-tree?parentCode=0',
      method: 'get',
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
      url: '/api/blade-crm/giftApplication/remove',
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