import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-cs/blame-confirm/list',
      method: 'post',
      data:data
    })
  }


  export const save = (data) => {
    return request({
      url: 'api/blade-cs/blame-confirm/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-cs/blame-confirm/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const deletedById = (id) => {
    return request({
      url: 'api/blade-cs/blame-confirm/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }