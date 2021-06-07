import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-crm/quotation/list',
      method: 'post',
      data:data,
  })
}

export const detail = (quotationId) => {
    return request({
      url: 'api/blade-crm/quotation/detail',
      method: 'get',
      params:{
        quotationId
      },
  })
}

export const deleteByIds = (ids) => {
    return request({
      url: 'api/blade-crm/quotation/deleteByIds',
      method: 'get',
      params:{
        ids
      },
  })
}

export const submit = (params) => {
    return request({
      url: 'api/blade-crm/quotation/submit',
      method: 'post',
      data:params
  })
}

export const getProjectInfo = (search) => {
  return request({
    url: 'api/blade-crm/project/getProjectInfo',
    method: 'get',
    params:{
      search
    }
})
}

export const product = (params) => {
  return request({
    url: 'api/blade-crm/quotation/product',
    method: 'post',
    data:params
})
}