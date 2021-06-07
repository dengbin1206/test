import request from '@/router/axios';

export function getList(data) {
  return request({
    url: '/api/blade-flowview/flowVariable/list',
    //url: '/bpm/variableDict/getList',
    method: 'post',
    data
  })
}

export function insertVarDict(data) {
  return request({
    url: '/api/blade-flowview/flowVariable/save',
    method: 'post',
    data
  })
}

export function updateVarDict(data) {
  return request({
    url: '/api/blade-flowview/flowVariable/update',
    method: 'post',
    data
  })
}

export function deleteVarDict(data) {
  return request({
    url: '/api/blade-flowview/flowVariable/remove',
    method: 'post',
    data
  })
}
