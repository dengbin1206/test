import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-crm/sale/selectPage',
      method: 'post',
      data:data,
  })
}

export const deletedByIds = (ids) => {
  return request({
    url: 'api/blade-crm/sale/deletedByIds',
    method: 'get',
    params:{
      ids
    },
})
}

export const getContractBySearch = (search) => {
  return request({
    url: 'api/blade-crm/contract/getContractBySearch',
    method: 'get',
    params:{
      search
    },
})
}

export const detail = (id) => {
  return request({
    url: 'api/blade-crm/sale/detail',
    method: 'get',
    params:{
      id
    },
})
}

export const submit = (data) => {
  return request({
    url: 'api/blade-crm/sale/submit',
    method: 'post',
    data:data
})
}

export const getData = (id) => {
  return request({
    url: 'api/blade-crm/contract/detail',
    method: 'get',
    params:{
      id
    },
})
}

export const createSalesDelivery = (data) => {
  return request({
    url: 'api/blade-crm/delivery/createSalesDelivery',
    method: 'post',
    data:data
})
}

export const markerNumBySearch = (search,paperContractNo) => {
  return request({
    url: 'api/blade-crm/contract/markerNumBySearch',
    method: 'get',
    params:{
      search,
      paperContractNo
    }
})
}

export const showVersion = (id) => {
  return request({
    url: 'api/blade-crm/sale/showVersion',
    method: 'get',
    params:{
      id
    },
})
}