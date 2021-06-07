import request from '@/router/axios';

export const getList = (current, size, params, deptId) => {
  return request({
    url: '/api/blade-user/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      deptId,
    }
  })
}

export const userListAll = () => {
  return request({
    url: '/api/blade-user/allUser',
    method: 'get',
    params: {}
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-user/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
export const add = (row) => {
  return request({
    url: '/api/blade-user/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-user/update',
    method: 'post',
    data: row
  })
}

export const getUser = (id) => {
  return request({
    url: '/api/blade-user/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/api/blade-user/info',
    method: 'get',
  })
}

export const resetPassword = (userIds) => {
  return request({
    url: '/api/blade-user/reset-password',
    method: 'post',
    params: {
      userIds,
    }
  })
}

export const updatePassword = (oldPassword, newPassword, newPassword1) => {
  return request({
    url: '/api/blade-user/update-password',
    method: 'post',
    params: {
      oldPassword,
      newPassword,
      newPassword1,
    }
  })
}

export const updateInfo = (row) => {
  return request({
    url: '/api/blade-user/update-info',
    method: 'post',
    data: row
  })
}

export const grant = (userIds, roleIds) => {
  return request({
    url: '/api/blade-user/grant',
    method: 'post',
    params: {
      userIds,
      roleIds,
    }
  })
}


// 部门查询
export const deptDetail = (search) => {
  return request({
    url: '/api/blade-system/dept/deptBySearch',
    method: 'get',
    params: {
      search
    }
  })
}


export const getAuthTree = () => {
  return request({
    url: '/api/blade-system/proxyPower/treeWithDelete',
    method: 'get',
  })
}


export const getLeader = (search, deptId) => {
  return request({
    url: 'api/blade-system/proxyPower/personBySearch',
    method: 'get',
    params: {
      search,
      deptId,
    }
  })
}


// 角色查询
export const roleDetail = (search) => {
  return request({
    url: '/api/blade-system/role/roleBySearch',
    method: 'post',
    params: {
      search
    }
  })
}
export const proxyPowerSubmit = (row) => {
  return request({
    url: '/api/blade-system/proxyPower/submit',
    method: 'post',
    data: row
  })
}

export const getPersonAuth = (userId) => {
  return request({
    url: '/api/blade-system/proxyPower/list',
    method: 'get',
    params: {
      userId
    }
  })
}

export const personAuthDelete = (ids) => {
  return request({
    url: '/api/blade-system/proxyPower/delSelect',
    method: 'get',
    params: {
      ids
    }
  })
}

export const toPassword = () => {
  return request({
    url: '/api/blade-user/toPassword',
    method: 'post',
  })
}
