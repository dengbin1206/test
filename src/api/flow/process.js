import request from '@/router/axios';

export const processList = (current, size, params) => {
  return request({
    url: '/api/blade-flowview/process/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const saveProcess = (row) => {
  return request({
    url: '/api/blade-flowview/process/save',
    method: 'post',
    data: row
  })
}
export const updateProcess = (row) => {
  return request({
    url: '/api/blade-flowview/process/update',
    method: 'post',
    data: row
  })
}
  //详情
export const processDetail = (id) => {
  return request({
    url: '/api/blade-flowview/process/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const removeProcess = (ids) => {
  return request({
    url: '/api/blade-flowview/process/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

