import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-crm/contract/list',
      method: 'post',
      data:data,
  })
}

export const saveAndUpdate = (data) => {
  return request({
    url: 'api/blade-crm/contract/saveAndUpdate',
    method: 'post',
    data:data,
})
}


export const detail = (id) => {
  return request({
    url: 'api/blade-crm/contract/detail',
    method: 'get',
    params:{
      id
    },
})
}

export const delet = (ids) => {
  return request({
    url: 'api/blade-crm/contract/deleteByIds',
    method: 'get',
    params:{
      ids
    },
})
}

export const payment = () => {
  return request({
    url: 'api/blade-crm/payment/list',
    method: 'get'
})
}

export const saveOrUpdate = (data) => {
  return request({
    url: 'api/blade-crm/payment/saveOrUpdate',
    method: 'post',
    data:data
})
}

export const employeeSave = (data) => {
  return request({
    url: 'api/blade-crm/employee/saveOrUpdate',
    method: 'post',
    data:data
})
}

export const employeeList = () => {
  return request({
    url: 'api/blade-crm/employee/list',
    method: 'get'
})
}

export const saleList = (contractId) => {
  return request({
    url: 'api/blade-crm/sale/create',
    method: 'get',
    params:{
      contractId
    }
})
}

export const getData = (projectId) => {
  return request({
    url: 'api/blade-crm/project/detail',
    method: 'get',
    params:{
      projectId
    }
})
}

export const showVersion = (id) => {
  return request({
    url: 'api/blade-crm/contract/showVersion',
    method: 'get',
    params:{
      id
    }
})
}
