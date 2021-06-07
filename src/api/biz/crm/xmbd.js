import request from '@/router/axios';

export const report = (data) => {
    return request({
      url: 'api/blade-crm/project/report',
      method: 'post',
      data:data,
  })
}

export const deptBySearch = (search) => {
  return request({
    url: 'api/blade-system/dept/deptBySearch',
    method: 'get',
    params:{
      search
    }
})
}


export const getUserInfoBySearch = (search) => {
  return request({
    url: 'api/blade-user/getUserInfoBySearch',
    method: 'get',
    params:{
      search
    }
})
}

export const blurrySelect = (search) => {
  return request({
    url: 'api/blade-crm/customer/blurrySelect',
    method: 'get',
    params:{
      search
    }
})
}

export const state = (parentCode) => {
  return request({
    url: 'api/blade-system/region/lazy-list',
    method: 'get',
    params:{
      parentCode
    }
})
}

export const detail = (projectId) => {
  return request({
    url: 'api/blade-crm/project/detail',
    method: 'get',
    params:{
      projectId
    }
})
}

export const save = (params) => {
  return request({
    url: 'api/blade-crm/project/save',
    method: 'post',
    data:params
})
}

export const upDate = (params) => {
  return request({
    url: 'api/blade-crm/project/alter',
    method: 'post',
    data:params
})
}

export const deleteByIds = (ids) => {
  return request({
    url: 'api/blade-crm/project/deleteByIds',
    method: 'get',
    params:{
      ids
    }
})
}

export const three_tree = () => {
  return request({
    url: 'api/blade-crm/three/three-tree',
    method: 'post',
})
}

export const addDefaultVaule = (modelName) => {
  return request({
    url: 'api/blade-dynamic/dynamicConfig/addDefaultValueByModelName',
    method: 'get',
    params:{
      modelName
    }
})
}

export const dictionary_group = (code,key) => {
  return request({
    url: 'api/blade-system/dict-biz/dictionary-group',
    method: 'get',
    params:{
      code,
      key
    }
})
}

export const getRegionBySearch = (search) => {
  return request({
    url: 'api/blade-system/region/getRegionBySearch',
    method: 'get',
    params:{
      search
    }
})
}

export const saveSingle = (data) => {
  return request({
    url: 'api/blade-crm/project/saveSingle',
    method: 'post',
    data:data
})
}