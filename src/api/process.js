import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/bpm/process/getList',
    method: 'post',
    data
  })
}

export function insertProcess(data) {
  return request({
    url: '/bpm/process/insert',
    method: 'post',
    data
  })
}

export function updateProcess(data) {
  return request({
    url: '/bpm/process/update',
    method: 'post',
    data
  })
}

export function deleteProcess(data) {
  return request({
    url: '/bpm/process/delete',
    method: 'post',
    data
  })
}

export function getProcessByKey(data) {
  return request({
    url: '/bpm/process/getProcessByKey/' + data,
    method: 'post'
  })
}

export function initFormData(data) {
  return request({
    url: '/bpm/process/getInitStartFormData/' + data,
    method: 'post'
  })
}

