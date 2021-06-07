import request from '@/router/axios';

export const queryList = (row) => {
  return request({
    url: '/api/blade-modelform/formDesigner/queryList',
    method: 'post',
    data: row
  })
}

export const saveOrUpdate = (row) => {
  return request({
    url: '/api/blade-modelform/formDesigner/saveOrUpdate',
    method: 'post',
    data: row
  })
}

export const saveFormDesigner = (row) => {
  return request({
    url: '/api/blade-modelform/formDesigner/saveFormDesigner',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-modelform/formDesigner/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const detail = (id) => {
  return request({
    url: '/api/blade-modelform/formDesigner/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const detailFormDesigner = (id) => {
  return request({
    url: '/api/blade-modelform/formDesigner/detailFormDesigner',
    method: 'get',
    params: {
      id
    }
  })
}

export const getFormById = (formId) => {
  return request({
    url: '/api/blade-modelform/formDesigner/getFormById',
    method: 'get',
    params: {
      formId
    }
  })
}

export const getFormByCode = (formCode) => {
  return request({
    url: '/api/blade-modelform/formDesigner/getFormByCode',
    method: 'get',
    params: {
      formCode
    }
  })
}

export const rollModelInfo = () => {
  return request({
    url: '/api/blade-modelform/model/rollModelInfo',
    method: 'get'
  })
}

export const allFormList = () => {
  return request({
    url: '/api/blade-modelform/formDesigner/allFormList',
    method: 'get'
  })
}

export const getModelFieldsAndChildModels = (modelName) => {
  return request({
    url: '/api/blade-modelform/model/getModelFieldsAndChildModels',
    method: 'get',
    params: {
      modelName
    }
  })
}

export function dataFormulaConversion(data) {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/dataFormulaConversion',
    method: 'post',
    data: data
  })
}

export const getAllModelFieldsByFormId = (formId) => {
  return request({
    url: '/api/blade-modelform/formDesigner/getAllModelFieldsByFormId',
    method: 'get',
    params: {
      formId
    }
  })
}
