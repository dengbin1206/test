import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-cs/maintenance-assign/list',
      method: 'post',
      data:data
    })
  }


  export const save = (data) => {
    return request({
      url: 'api/blade-cs/maintenance-assign/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-cs/maintenance-assign/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const deletedById = (id) => {
    return request({
      url: 'api/blade-cs/maintenance-assign/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }