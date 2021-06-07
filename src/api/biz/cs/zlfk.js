import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-cs/quality-feed-back/list',
      method: 'post',
      data:data
    })
  }


  export const save = (data) => {
    return request({
      url: 'api/blade-cs/quality-feed-back/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-cs/quality-feed-back/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const deletedById = (id) => {
    return request({
      url: 'api/blade-cs/quality-feed-back/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }