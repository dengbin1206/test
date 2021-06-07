import request from '@/router/axios';

export const list = (row) => {
    return request({
      url: '/api/blade-flow/flow/Authorize/list',
      method: 'post',
      data: row
    })
  }

  export const deptList = () => {
    return request({
      url: '/api/blade-system/dept/list',
      method: 'get',
    })
  }

  export const getAllFLow = () => {
    return request({
      url: '/api/blade-flow/model/getAllFLow',
      method: 'get'
    })
  }

  export const saveOrUpdate = (row) => {
    return request({
      url: '/api/blade-flow/flow/Authorize/saveOrUpdate',
      method: 'post',
      data:row
    })
  }

  export const findById = (id) => {
    return request({
      url: '/api/blade-flow/flow/Authorize/findById',
      method: 'get',
      params:{
        id
      }
    })
  }

  export const undoAuthorize = (id) => {
    return request({
      url: '/api/blade-flow/flow/Authorize/undoAuthorize',
      method: 'get',
      params:{
        id
      }
    })
  }
  