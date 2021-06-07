import request from '@/router/axios';

export const todoList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/task/todo-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const flowInfo = (proInstId) => {
  return request({
    url: '/api/blade-flow/task/history-list',
    method: 'get',
    params: {
      proInstId: proInstId
    }
  })
}

export const getHistoryTaskBack = (proInstId) => {
  return request({
    url: `/api/blade-flow/task/get-history-task-back/`,
    method: 'get',
    params: {
      proInstId: proInstId
    }
  })
}

// export const backToTask = (data) => {
//   return request({
//     url: `/api/blade-flow/task/back-to-task/`,
//     method: 'post',
//     data: data
//   })
// }

export const myToDoList = (row) => {
  return request({
    url: `/api/blade-flow/task/myToDoList`,
    method: 'post',
    data:row
  })
}

export const historyInfo = (params) => {
  return request({
    url: `/api/blade-flow/task/historyInfo`,
    method: 'get',
    params
  })
}
//同意
export const completeTask = (data) => {
  return request({
    url: `/api/blade-flow/task/complete-task`,
    method: 'post',
    data
  })
}
//转办
export const delegateTask = (data) => {
  return request({
    url: `/api/blade-flow/task/delegate-task`,
    method: 'post',
    data
  })
}
//签收
export const claimTask = (params) => {
  return request({
    url: `/api/blade-flow/task/claim-task`,
    method: 'get',
    params
  })
}
//抄送
export const copyTask = (data) => {
  return request({
    url: `/api/blade-flow/task/copy-task`,
    method: 'post',
    data
  })
}
//拒绝
export const stopTask = (data) => {
  return request({
    url: `/api/blade-flow/task/stop-task`,
    method: 'post',
    data
  })
}
//转办时的远程搜索
export const userBySearch = (params) => {
  return request({
    url: `/api/blade-user/userBySearch`,
    method: 'get',
    params
  })
}

//转办时的远程搜索
export const getUserInfoBySearch = (params) => {
  return request({
    url: `/api/blade-user/getUserInfoBySearch`,
    method: 'get',
    params
  })
}

//我的抄送数据
export const myInstCopyList = (data) => {
  return request({
    url: `/api/blade-flow/task/myInstCopyList`,
    method: 'post',
    data
  })
}

//我的抄送删除
export const deleteInstCopy = (params) => {
  return request({
    url: `/api/blade-flow/task/deleteInstCopy`,
    method: 'get',
    params
  })
}

//我的抄送编辑留言
export const updateInstCopy = (id,memo) => {
  return request({
    url: `/api/blade-flow/task/updateInstCopy`,
    method: 'post',
    data:{
      id,
      memo
    }
  })
}

//我的抄送回复
export const updateInstCopys = (id,reply,readStatus) => {
  return request({
    url: `/api/blade-flow/task/updateInstCopy`,
    method: 'post',
    data:{
      id,
      reply,
      readStatus
    }
  })
}

//回退下拉
export const getBackNode = (params) => {
  return request({
    url: `/api/blade-flow/task/get-back-node`,
    method: 'get',
    params
  })
}

//回退确认
export const backToTask = (taskId,targetActivityId,comment) => {
  return request({
    url: `/api/blade-flow/task/back-to-task`,
    method: 'post',
    data:{
      taskId,
      targetActivityId,
      comment
    },
  })
}

//回退确认移动端
export const backToTaskMobile = (taskId,targetActivityId,comment) => {
  return request({
    url: `/api/blade-flow/task/back-to-task`,
    method: 'post',
    data:{
      taskId,
      targetActivityId,
      comment
    },
    headers: {
      "isMobile": "true"
    }
  })
}

//强制转办
export const adminDelegateTask = (data) => {
  return request({
    url: `/api/blade-flow/task/admin-delegate-task`,
    method: 'post',
    data
  })
}

//我的授权
export const myPowerList = (data) => {
  return request({
    url: `/api/blade-flow/task/myPowerList`,
    method: 'post',
    data
  })
}

//授权给我的
export const powerMeList = (data) => {
  return request({
    url: `/api/blade-flow/task/powerMeList`,
    method: 'post',
    data
  })
}

//取消授权
export const deleteInstImPower = (params) => {
  return request({
    url: `/api/blade-flow/task/deleteInstImPower`,
    method: 'get',
    params
  })
}

//流程监控图
export const flowImage = (params) => {
  return request({
    url: `/api/blade-flow/task/flowImage`,
    method: 'get',
    params
  })
}