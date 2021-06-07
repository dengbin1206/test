import request from '@/router/axios';

export const getList = (search, current, size) => {
    return request({
      url: '/api/blade-crm/giftApplication/selectList',
      method: 'get',
      params: {
        search,
        current,
        size
    }
    })
  }