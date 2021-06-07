import request from '@/router/axios';

export const startList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/start-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const claimList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/claim-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const todoList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/todo-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const sendList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/send-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const doneList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/done-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const claimTask = (taskId) => {
  return request({
    url: '/api/blade-flow/work/claim-task',
    method: 'post',
    params: {
      taskId
    }
  })
}



export const completeTask = (data) => {
  return request({
    url: '/api/blade-flow/work/complete-task',
    method: 'post',
    data
  })
}


export const myDoneList = (row) => {
  return request({
    url: '/api/blade-flow/task/myDoneList',
    method: 'post',
    data: row
  })
}

export const myInstanceList = (row) => {
  return request({
    url: '/api/blade-flow/task/myInstanceList',
    method: 'post',
    data: row
  })
}

export const adminTask = (params) => {
  return request({
    url: '/api/blade-flow/task/admin-stop-task',
    method: 'get',
    params
  })
}

//抄送回复
export const instCopyReply = (row) => {
  return request({
    url: '/api/blade-flow/task/instCopyReply',
    method: 'post',
    data: row
  })
}

//查询所有事务
export const queryAllList = (row) => {
  return request({
    url: '/api/blade-flow/task/queryAllList',
    method: 'post',
    data: row
  })
}


export const impowerProcess = (proInstId, userIds) => {
  return request({
    url: '/api/blade-flow/task/impower-process',
    method: 'post',
    data: {
      proInstId,
      userIds
    }
  })
}

//取回
export const retrieve = (params) => {
  return request({
    url: '/api/blade-flow/task/retrieve',
    method: 'get',
    params
  })
}

export const queryForm = (paramId,
  paramType,
  proDefId,
  nodeCode) => {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/queryFormInfoNew',
    method: 'get',
    params: {
      paramId,
      paramType,
      proDefId,
      nodeCode
    }
  })
}

export const initData = (row) => {
  return request({
    url: '/api/blade-dynamic/dynamicConfig/findByIdNew',
    method: 'post',
    data: row
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