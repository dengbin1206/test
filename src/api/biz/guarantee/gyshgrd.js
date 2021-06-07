import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-crm/confirm/list',
      method: 'post',
      data:data
    })
  }

  export const deletedById = (id) => {
    return request({
      url: '/api/blade-crm/confirm/deletedById',
      method: 'get',
      params: {
        id,
      }
    })
  }

  export const detail = (id) => {
    return request({
      url: '/api/blade-crm/confirm/detail',
      method: 'get',
      params: {
        id,
      }
    })
  }

  export const getContentDefinitionBySearch = (materialClassify) => {
    return request({
      url: '/api/blade-crm/definition/getContentDefinitionBySearch',
      method: 'get',
      params: {
        materialClassify,
      }
    })
  }

  export const getSupplierBySearch = (	search) => {
    return request({
      url: '/api/blade-crm/marker/getSupplierBySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }

  export const save = (data) => {
    return request({
      url: 'api/blade-crm/confirm/submit',
      method: 'post',
      data:data
    })
  }