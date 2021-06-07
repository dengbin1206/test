import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/dict/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getParentList = (current, size, params) => {
  return request({
    url: '/api/blade-system/dict/parent-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getChildList = (current, size, parentId, params) => {
  return request({
    url: '/api/blade-system/dict/child-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      parentId: parentId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/dict/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/dict/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/dict/submit',
    method: 'post',
    data: row
  })
}


export const getDict = (id) => {
  return request({
    url: '/api/blade-system/dict/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getDictTree = () => {
  return request({
    url: '/api/blade-system/dict/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request({
    url: '/api/blade-system/dict/dictionary',
    method: 'get',
    params,
  })
}
// 根据字典类型查询字典数据信息系统字典
export function getDictByCode(dictCode) {
  return request({
    url: '/api/blade-system/dict/dictionary?code=' + dictCode,
    method: 'get'
  })
}
// 根据字典类型查询字典数据信息业务字典
export function getDictBizByCode(dictCode) {
  return request({
    url: '/api/blade-system/dict-biz/dictionary?code=' + dictCode,
    method: 'get'
  })
}
// 根据字典类型查询字典数据信息系统字典
export function getmodels(dictType) {
  return request({
    url: '/api/blade-system/dict/dictionary?code=' + dictType,
    method: 'get'
  })
}
// 根据字典类型查询字典数据信息业务字典
export function getDicts(dictType) {
  return request({
    url: '/api/blade-system/dict-biz/dictionary?code=' + dictType,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息系统字典
export function getDictList(dictType) {
  return request({
    url: '/api/blade-system/dict/getDictList?code=' + dictType,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息业务字典
export function getDictBizList(dictType) {
  return request({
    url: '/api/blade-system/dict-biz/getDictList?code=' + dictType,
    method: 'get'
  })
}

//根据id查询数据

export function getTreeData(id) {
  return request({
    url: '/api/blade-system/dept/detail?id=' + id,
    method: 'get'
  })
}
