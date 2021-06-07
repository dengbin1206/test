import request from '@/router/axios';

export const getList = (search, current, size) => {
    return request({
      url: '/api/blade-crm/unqualified/selectPage',
      method: 'get',
      params: {
        search,
        current,
        size
    }
    })
  }

  export const getData = (unqualifiedId) => {
    return request({
      url: '/api/blade-crm/unqualified/detail',
      method: 'get',
      params: {
        unqualifiedId,
      }
    })
  }

  export const getTestData = (testId) => {
    return request({
      url: '/api/blade-crm/test/detail',
      method: 'get',
      params: {
        testId,
      }
    })
  }

  export const submit = (data) => {
    return request({
      url: 'api/blade-crm/unqualified/submit',
      method: 'post',
      data:data
    })
  }

  export const getUserName = (search) => {
    return request({
      url: '/api/blade-user/getUserInfoBySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }