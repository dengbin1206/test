import request from '@/router/axios';

export const flowBasicsList = (current, size, params) => {
  return request({
    url: '/api/blade-flowview/flowBasics/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const saveFlowBasics = (row) => {
  return request({
    url: '/api/blade-flowview/flowBasics/save',
    method: 'post',
    data: row
  })
}
export const updateFlowBasics = (row) => {
  return request({
    url: '/api/blade-flowview/flowBasics/update',
    method: 'post',
    data: row
  })
}
  //详情
export const flowBasicsDetail = (id) => {
  return request({
    url: '/api/blade-flowview/flowBasics/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const removeFlowBasics = (ids) => {
  return request({
    url: '/api/blade-flowview/flowBasics/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

