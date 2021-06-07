import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-cs/supplier-handle/list',
      method: 'post',
      data:data
    })
  }


  export const save = (data) => {
    return request({
      url: 'api/blade-cs/supplier-handle/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-cs/supplier-handle/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const deletedById = (id) => {
    return request({
      url: 'api/blade-cs/supplier-handle/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }