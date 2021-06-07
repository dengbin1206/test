import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/function/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getLazyList = ( data ) => {
  return request({
    url: '/api/blade-system/function/lazy-list',
    method: 'post',
    data:data
  })
}

export const getLazyNewList = ( data ) => {
  return request({
    url: '/api/blade-system/function/lazy-button-list',
    method: 'post',
    data:data
  })
}

export const getLazyMenuList = (parentId, params) => {
  return request({
    url: '/api/blade-system/function/lazy-menu-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}

export const getMenuList = (tenantId) => {
  return request({
    url: '/api/blade-system/function/menu-list',
    method: 'get',
    params: {
      tenantId,
    }
  })
}


export const remove = (ids) => {
  return request({
    url: '/api/blade-system/function/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/function/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/function/submit',
    method: 'post',
    data: row
  })
}

export const getMenu = (id) => {
  return request({
    url: '/api/blade-system/function/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getTopMenu = (params) => request({
  url: '/api/blade-system/menu/top-menu',
  method: 'get',
  params:{
    params
  }
});

export const getRoutes = (topMenuId,showType) => request({
  url: '/api/blade-system/menu/user-menu-function-tree',
  method: 'get',
  params: {
    topMenuId,
    showType
  }
});

export const getRoutesAll = () => request({
  url: '/api/blade-system/menu/user-menu-function-tree-all',
  method: 'get',
});

export const getResource = (type,search) => {
  return request({
    url: '/api/blade-system/function/resource',
    method: 'post',
    params: {
      type,
      search
    }
  })
}

//其他功能模糊搜索
export const otherFuncSearch = (search,functionId) => {
  return request({
    url: '/api/blade-system/function/search-other-function',
    method: 'get',
    params: {
      functionId,
      search
    }
  })
}


export const otherFuncBtn = (functionId) => {
  return request({
    url: '/api/blade-system/function/getBtnByFunctionId',
    method: 'get',
    params: {
      functionId
    }
  })
}

export const getFormName = (search) => {
  return request({
    url: '/api/blade-modelform/form/findFormBySearch',
    method: 'get',
    params: {
      search
    }
  })
}

export const submitBtn = (row) => {
  return request({
    url: '/api/blade-system/function/addOrUpdateBtn',
    method: 'post',
    data: row
  })
}

export const getFlowModelByKeySearch = (search) => {
  return request({
    url: '/api/blade-flow/model/getFlowModelByKeySearch',
    method: 'get',
    params:{
      search
    }
  })
}


export const getModelId = (search) => {
  return request({
    url: '/api/blade-modelform/model/findTableNameBySearch',
    method: 'get',
    params:{
      search
    }
  })
}

export const getModelFieldId = (dbMainTableId) => {
  return request({
    url: '/api/blade-modelform/model/rollTableInfo',
    method: 'get',
    params:{
      dbMainTableId
    }
  })
}

export const permissionSubmit = (row) => {
  return request({
    url: '/api/blade-system/functionField/submit',
    method: 'post',
    data: row
  })
}

export const getPermissionList = (functionId) => {
  return request({
    url: '/api/blade-system/functionField/list',
    method: 'get',
    params:{
      functionId
    }
  })
}

export const permissionRemove = (functionId,id) => {
  return request({
    url: '/api/blade-system/functionField/remove',
    method: 'post',
    params: {
      functionId,
      id,
    }
  })
}

export const getBtnByFunctionPath = (functionPath) => {
  return request({
    url: '/api/blade-dynamic/dynamicViewInit/viewInitButton',
    method: 'post',
    data: {
      functionPath: functionPath
    }
  })
}
