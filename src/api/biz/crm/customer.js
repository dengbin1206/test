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
      url: 'api/blade-crm/customer/submit',
      method: 'post',
      data:data
    })
  }

  export const getList = (data) => {
    return request({
      url: '/api/blade-crm/customer/selectPage',
      method: 'post',
      data: data
    })
  }

  export const getDetail = (customerId) => {
    return request({
      url: '/api/blade-crm/customer/detail',
      method: 'get',
      params: {
        customerId
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
      url: '/api/blade-crm/customer/remove',
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

  export const getIndustry = (code,key) => {
    return request({
      url: '/api/blade-system/dict-biz/dictionary-group',
      method: 'get',
      params:{
        code,
        key
      }
    })
  }

  export const getFlowHistory = (customerId) => {
    return request({
      url: '/api/blade-crm/customer/detailHistory',
      method: 'get',
      params: {
        customerId,
      }
    })
  }

