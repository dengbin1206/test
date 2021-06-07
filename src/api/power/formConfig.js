import request from '@/router/axios';

export const getListByFormId = (formId) => {
    return request({
      url: '/api/blade-power/power/getListByFormId',
      method: 'get',
      params:{
        formId
      }
    })
  }  

  export const LazyList = () => {
    return request({
      url: '/api/blade-power/power/LazyList',
      method: 'get'
    })
  }

  export const getModelByFormId = (formId) => {
    return request({
      url: '/api/blade-modelform/form/getModelByFormId',
      method: 'get',
      params:{
        formId
      }
    })
  }

  export const getModelCode = (tableId) => {
    return request({
      url: '/api/blade-modelform/model/getSourceCode',
      method: 'get',
      params:{
        tableId
      }
    })
  }

  export const getobjs = () => {
    return request({
      url: '/api/blade-power/power/list',
      method: 'get'
    })
  }

  export const getPowerObjById = (id) => {
    return request({
      url: '/api/blade-power/power/getPowerObjById',
      method: 'get',
      params:{
        id
      }
    })
  }

  export const savePowerObj = (row) => {
    return request({
      url: '/api/blade-power/power/savePowerObj',
      method: 'post',
      data:row
    })
  }

  export const getModelsByModelId = (modelId) => {
    return request({
      url: '/api/blade-modelform/model/getModelsByModelId',
      method: 'get',
      params:{
        modelId
      }
    })
  } 

  export const saveByModelId = (row) => {
    return request({
      url: '/api/blade-power/power/saveByModelId',
      method: 'post',
      data:row
    })
  }

  export const getListByModelId = (modelId) => {
    return request({
      url: '/api/blade-power/power/getListByModelId',
      method: 'get',
      params:{
        modelId
      }
    })
  }  