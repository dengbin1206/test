import request from '@/router/axios';

export const getList = () => {
  return request({
    url: '/api/blade-system/role/tree',
    method: 'get'
  })
}

export const grantTree = () => {
  return request({
    url: '/api/blade-system/menu/grant-tree',
    method: 'get'
  })
}
export const checkTree = (roleId) => {
  return request({
    url: '/api/blade-system/role/role-tree-check',
    method: 'get',
    params:{
      roleId
    }
  })
}



export const remove = (id) => {
  return request({
    url: '/api/blade-system/role/remove',
    method: 'post',
    params: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/role/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/role/submit',
    method: 'post',
    data: row
  })
}


export const getRole = (roleIds) => {
  return request({
    url: '/api/blade-system/function/role-tree-keys',
    method: 'get',
    params: {
      roleIds,
    }
  })
}

export const getRoleTree = (tenantId) => {
  return request({
    url: '/api/blade-system/role/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const groupBySearch = (search) => {
  return request({
    url: '/api/blade-system/group/groupBySearch',
    method: 'get',
    params: {
      search,
    }
  })
}

export const detail = (id) => {
  return request({
    url: '/api/blade-system/role/detail',
    method: 'get',
    params: {
      id,
    }
  })
}


export const modelForm = (menuFunctionId,roleId) => {
  return request({
    url: '/api/blade-system/role/model-form-field',
    method: 'post',
    params:{
      menuFunctionId,
      roleId
    }
  })
}
export const submitField = (row) => {
  return request({
    url: '/api/blade-system/role/role-grant',
    method: 'post',
    data:row
  })
}

export const LazyList = () => {
  return request({
    url: '/api/blade-power/power/LazyList',
    method: 'get'
  })
}

export const getPowerObjById = (id) => {
  return request({
    url: '/api/blade-power/power/getPowerObjById',
    method: 'get',
    params:{
      id
    }
  })
}

export const buttonCheck = (roleId,menuFunctionId) => {
  return request({
    url: '/api/blade-system/role/role-button-check',
    method: 'get',
    params:{
      roleId,
      menuFunctionId,   
    }
  })
}

export const rolePowerList = (roleId) => {
  return request({
    url: '/api/blade-power/rolePower/list',
    method: 'get',
    params:{
      roleId
    }
  })
}

export const getDataByCodeAndName = (powerFieldId,search) => {
  return request({
    url: '/api/blade-power/powerField/getDataByCodeAndName',
    method: 'get',
    params:{
      powerFieldId,
      search
    }
  })
}