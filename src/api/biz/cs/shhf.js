import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-cs/after-sale/list',
      method: 'post',
      data:data
    })
  }


  export const save = (data) => {
    return request({
      url: 'api/blade-cs/after-sale/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-cs/after-sale/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const deletedById = (id) => {
    return request({
      url: 'api/blade-cs/after-sale/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }