import request from '@/router/axios';

//抄送给我的条数
export const flowInfo = (proInstId) => {
    return request({
      url: '/api/blade-flow/task/instCopyMeCount',
      method: 'get',
    })
}

//我的待办条数
export const flowInfo = (proInstId) => {
    return request({
      url: '/api/blade-flow/task/myToDoCount',
      method: 'get',
    })
}