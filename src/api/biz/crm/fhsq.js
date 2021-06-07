import request from '@/router/axios';


export const list = (data) => {
    return request({
      url: '/api/blade-crm/delivery/delivery-list',
      method: 'post',
      data: data
    })
  }

  export const deptByLabel = (search) => {
    return request({
      url: 'api/blade-system/dept/deptByLabel',
      method: 'get',
      params:{
        search
      }
    })
  }


  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/delivery/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (salesDeliveryId) => {
    return request({
      url: 'api/blade-crm/delivery/detail',
      method: 'get',
      params:{
        salesDeliveryId
      }
    })
  }

  export const deleteByIds = (ids) => {
    return request({
      url: 'api/blade-crm/delivery/deleteByIds',
      method: 'get',
      params:{
        ids
      }
    })
  }

  export const getData = (id) => {
    return request({
      url: 'api/blade-crm/sale/detail',
      method: 'get',
      params:{
        id
      },
  })
  }

  export const bfSave = (data) => {
    return request({
      url: 'api/blade-crm/repair/submit',
      method: 'post',
      data:data
  })
  }

  export const  zfSave = (data) => {
    return request({
      url: 'api/blade-crm/direct/submit',
      method: 'post',
      data:data
  })
  }

  export const bfList = (data) => {
    return request({
      url: '/api/blade-crm/repair/repair-list',
      method: 'post',
      data: data
    })
  }

  export const zfList = (data) => {
    return request({
      url: '/api/blade-crm/direct/direct-list',
      method: 'post',
      data: data
    })
  }

  export const bfDetail = (repairDeliveryId) => {
    return request({
      url: '/api/blade-crm/repair/detail',
      method: 'get',
      params:{
        repairDeliveryId
      }
    })
  }

  export const zfDetail = (	directDeliveryId) => {
    return request({
      url: '/api/blade-crm/direct/detail',
      method: 'get',
      params:{
        directDeliveryId
      }
    })
  }
