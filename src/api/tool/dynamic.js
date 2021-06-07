import request from '@/router/axios';

export const queryFormInfo = (paramType,paramId) => {
    return request({
      url: '/api/blade-dynamic/dynamicConfig/queryFormInfoNew',
      method: 'get',
      params: {
        paramType,
        paramId
      }
    })
  }

export const queryMainFields = (data) => {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/queryFormInfoNew',
    method: 'get',
    params: data,
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

  export const add = (row) => {
    return request({
      url: '/api/blade-dynamic/dynamicConfig/addNew',
      method: 'post',
      data: row
    })
  }


export const update = (row) => {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/updateNew',
    method: 'post',
    data: row
  })
}

export const remove = (row) => {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/remove',
    method: 'post',
    data: row
  })
}

export function getList(data) {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/listNew',
    method: 'post',
    data: data
  })
}

//通过id查询表单
export function findById(data) {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/findByIdNew',
    method: 'post',
    data: data
  })
}

//通过模型名查询
export function getChildModel(data) {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/childModelNotPage',
    method: 'post',
    data: data
  })
}

export function asyncUploadAction(data) {
  return request({
    url: '/api/blade-resource/affix/asyncUpload',
    method: 'post',
    data: data
  })
}

export function uploadList(data) {
  return request({
    url: '/api/blade-resource/affix/affixList',
    method: 'post',
    data: data
  })
}
export function startFlow(data) {
  return request({
    url: '/api/blade-flow/task/start-process',
    method: 'post',
    data: data
  })
}

export function leadIn(data) {
  return request({
    url: '/api/blade-dynamic/importAndExportModel/importDynamicModel',
    method: 'post',
    data: data
  })
}

export function leadOut(data) {
  return request({
    url: '/api/blade-dynamic/importAndExportModel/exportDynamicModel',
    method: 'post',
    data: data
  })
}

export function generateUrl(data) {
  return request({
    url: '/api/blade-widget/qrCode/generateUrl',
    method: 'post',
    data: data
  })
}

export function addDefaultValue(data) {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/addDefaultVaule',
    method: 'post',
    data: data
  })
}

export function flowList(modelId, dataId) {
  return request({
    url: '/api/blade-flow/task/flowListByDataId',
    method: 'get',
    params: {
      modelId,
      dataId
    }
  })
}

export function getAction(url,data) {
  return request({
    url: url,
    method: 'get',
    params: data
  })
}

export function postAction(url,data) {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

export const viewInitField = (data) => {
  return request({
    url: '/api/blade-dynamic/dynamicViewInit/viewInitField',
    method: 'post',
    data: data
  })
}
