import request from '@/router/axios';

export const add = (row) => {
    return request({
      url: '/api/blade-modelform/model/save',
      method: 'post',
      data: row
    })
  }


  export const remove = (ids) => {
    return request({
      url: '/api/blade-modelform/model/remove',
      method: 'post',
      params: {
        ids,
      }
    })
  }

  export const update = (row) => {
    return request({
      url: '/api/blade-modelform/model/update',
      method: 'post',
      data: row
    })
  }

  export const getList = (current,size,params) => {
    return request({
      url: '/api/blade-modelform/model/list',
      method: 'get',
      params: {
        ...params,
        current,
        size,
      }
    })
  }

  export const detail = (id) => {
    return request({
      url: '/api/blade-modelform/model/detail',
      method: 'get',
      params: {
        id
      }
    })
  }

  export const rollModelInfo = () => {
    return request({
      url: '/api/blade-modelform/model/rollModelInfo',
      method: 'get'
    })
  }

  export const rollTableInfo = (dbMainTableId) => {
    return request({
      url: '/api/blade-modelform/model/rollTableInfo',
      method: 'get',
      params:{
        dbMainTableId
      }
    })
  }


  export const basicModelFields=()=>{
    return request({
      url: '/api/blade-modelform/model/basicModelFields',
      method: 'get'
    })
  }


    export const findTableNameBySearch = (search) => {
    return request({
      url: '/api/blade-modelform/model/findTableNameBySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }


  export const syncDb = (id) => {
    return request({
      url: '/api/blade-modelform/model/syncDb',
      method: 'get',
      params: {
        id
      }
    })
  }
  //根据模型Id查询字段信息
  export const findFieldsById = (modelId) => {
    return request({
      url: '/api/blade-modelform/model/findFieldsById',
      method: 'get',
      params: {
        modelId
      }
    })
  }
  //新增修改设计器
  export const saveOrUpdateDesign = (data) => {
    return request({
      url: '/api/blade-modelform/form/saveOrUpdateDesign',
      method: 'post',
      data:data
    })
  }
  //详情
  export const formDetail = (formId) => {
    return request({
      url: '/api/blade-modelform/form/detail',
      method: 'get',
      params: {
        formId
      }
    })
  }
  //字典table模糊搜索
  export const getDbModels = (search) => {
    return request({
      url: '/api/blade-modelform/model/getDbModels',
      method: 'get',
      params:{
        search
      }
    })
  }
  //字典code,text查询
  export const getCodeAndValue = (dbName) => {
    return request({
      url: '/api/blade-modelform/model/getCodeAndValue',
      method: 'get',
      params:{
        dbName
      }
    })
  }
  //字典code,text查询
  export const getCodeByDict = (dbName) => {
    return request({
      url: '/api/blade-modelform/model/getCodeByDict',
      method: 'get',
      params:{
        dbName
      }
    })
  }

  export const getAllModelFieldsByModelId = (modelId) => {
    return request({
      url: '/api/blade-modelform/model/getAllModelFieldsByModelId',
      method: 'get',
      params: {
        modelId
      }
    })
  }





