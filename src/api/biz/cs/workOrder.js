import request from '@/router/axios';

export const detail = (id) => {
    return request({
      url: 'api/blade-cs/dispatch-sheet/detail',
      method: 'get',
      params:{
        id
      }
    })
  }

  export const finish = (data) => {
    return request({
      url: 'api/blade-cs/dispatch-sheet/finish',
      method: 'POST',
      data:data
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-cs/sign-card/submit',
      method: 'POST',
      data:data
    })
  }

  export const write = (sheetId) => {
    return request({
      url: 'api/blade-cs/log-plan/write',
      method: 'get',
      params:{
        sheetId
      }
    })
  }

  export const writeAdd = (data) => {
    return request({
      url: 'api/blade-cs/log-plan/submit',
      method: 'post',
      data:data
    })
  }

  export const rzdetail = (id) => {
    return request({
      url: 'api/blade-cs/log-plan/detail',
      method: 'get',
      params:{
        id
      }
    })
  }