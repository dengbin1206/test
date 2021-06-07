import request from '@/router/axios';

export const list = (relateId,serviceType) => {
    return request({
      url: 'api/blade-cs/dispatch-sheet/list',
      method: 'get',
      params:{
        relateId,
        serviceType
      }
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-cs/dispatch-sheet/submit',
      method: 'post',
      data:data
    })
  }