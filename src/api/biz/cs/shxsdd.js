import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-cs/after-sale-order/list',
      method: 'post',
      data:data,
  })
}

export const deletedByIds = (id) => {
    return request({
      url: 'api/blade-cs/after-sale-order/deletedById',
      method: 'get',
      params:{
          id
      },
  })
}

export const detail = (id) => {
    return request({
      url: 'api/blade-cs/after-sale-order/detail',
      method: 'get',
      params:{
          id
      },
  })
}

export const submit = (data) => {
    return request({
      url: 'api/blade-cs/after-sale-order/submit',
      method: 'post',
      data:data
  })
}

export const getData = (id) => {
  return request({
    url: 'api/blade-cs/quality-feed-back/detail',
    method: 'get',
    params:{
        id
    }
  })
}