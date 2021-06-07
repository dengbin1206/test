import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-biz/archival/list',
      method: 'post',
      data:data
    })
  }

  export const archivalTypeBySearch = (search) => {
    return request({
      url: 'api/blade-biz/archival-type/archivalTypeBySearch',
      method: 'get',
      params:{
        search
      }
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-biz/archival/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-biz/archival/detail',
      method: 'get',
      params:{
        id
      }
    })
  }

  export const dalxList = () => {
    return request({
      url: 'api/blade-biz/archival-type/list',
      method: 'get',
    })
  }

  export const dalxSub = (data) => {
    return request({
      url: 'api/blade-biz/archival-type/submit',
      method: 'post',
      data:data
    })
  }

  export const delArchival = (id) => {
    return request({
      url: 'api/blade-biz/archival/delArchival',
      method: 'get',
      params:{
        id
      }
    })
  }