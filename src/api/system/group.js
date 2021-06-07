import request from '@/router/axios';
export const postDetail = (search) => {
    return request({
      url: '/api/blade-system/post/postBySearch',
      method: 'get',
      params: {
        search
      }
    })
  }

  export const user_code= (search) => {
    return request({
      url: '/api/blade-user/userBySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }

  export function getList(data) {
    return request({
      url: '/api/blade-system/group/groupDetail',
      method: 'post',
      data:data
    })
  }

  export const add = (row) => {
    return request({
      url: '/api/blade-system/group/submit',
      method: 'post',
      data: row
    })
  }

  export const update = (row) => {
    return request({
      url: '/api/blade-system/group/update',
      method: 'post',
      data: row
    })
  }

  export const remove = (ids) => {
    return request({
      url: '/api/blade-system/group/remove',
      method: 'post',
      params: {
        ids,
      }
    })
  }

  export const detail = (id) => {
    return request({
      url: '/api/blade-system/group/details',
      method: 'post',
      params: {
        id
      }
    })
  }