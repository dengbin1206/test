import request from '@/router/axios';

export const myToDoCount = () => {
    return request({
      url: 'api/blade-flow/task/myToDoCount',
      method: 'get',
    })
}

export const instCopyMeCount = () => {
    return request({
      url: 'api/blade-flow/task/instCopyMeCount',
      method: 'get',
    })
}

export const myToDoList = (search,current,size) => {
  return request({
    url: 'api/blade-flow/task/mobile/myToDoList',
    method: 'get',
    params:{
      search,
      current,
      size
    }
  })
}

export const myDoneList = (search,status,current,size) => {
  return request({
    url: 'api/blade-flow/task/mobile/myDoneList',
    method: 'get',
    params:{
      search,
      status,
      current,
      size
    }
  })
}

export const queryAllList = (search,status,current,size) => {
  return request({
    url: 'api/blade-flow/task/mobile/queryAllList',
    method: 'get',
    params:{
      search,
      status,
      current,
      size
    }
  })
}

export const instCopyReply = (search,status,current,size) => {
  return request({
    url: 'api/blade-flow/task/mobile/instCopyReply',
    method: 'get',
    params:{
      search,
      status,
      current,
      size,
    }
  })
}


export const changeCopyStatus = (proInstId) => {
  return request({
    url: 'api/blade-flow/task/changeCopyStatus',
    method: 'get',
    params:{
      proInstId
    }
  })
}


export const signature = (params) => {
  return request({
    url: 'api/blade-system/integrationSign/dingTalk',
    method: 'get',
    params
  })
}

