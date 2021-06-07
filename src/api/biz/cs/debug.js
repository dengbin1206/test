import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-cs/debug-assign/list',
      method: 'post',
      data:data
    })
  }


  export const save = (data) => {
    return request({
      url: 'api/blade-cs/debug-assign/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-cs/debug-assign/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const deletedById = (id) => {
    return request({
      url: 'api/blade-cs/debug-assign/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }