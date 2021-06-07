import request from '@/router/axios';

export const getFixedValue = (modelName) => {
    return request({
      url: '/api/blade-dynamic/dynamicConfig/addDefaultValueByModelName',
      method: 'get',
      params:{
        modelName
      }
    })
  }

  export const selectTestList = () => {
    return request({
      url: '/api/blade-crm/qualityComponent/select',
      method: 'get',
      
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
  
  export const selectTestProcedure = () => {
    return request({
      url: '/api/blade-crm/qualityProcedure/select',
      method: 'get',
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/test/submit',
      method: 'post',
      data:data
    })
  }