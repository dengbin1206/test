import request from '@/router/axios';

export const getParentList = (current, size, params) => {
    return request({
      url: '/api/blade-system/param/parent-list',
      method: 'get',
      params: {
        ...params,
        current,
        size,
      }
    })
  }

  export const getChildList = (current, size, params) => {
    return request({
      url: '/api/blade-system/param/child-list',
      method: 'get',
      params: {
        ...params,
        current,
        size,
      }
    })
  }


  export const add = (row) => {
    return request({
      url: '/api/blade-system/param/submit',
      method: 'post',
      data: row
    })
  }

  export const remove = (ids) => {
    return request({
      url: '/api/blade-system/param/remove',
      method: 'post',
      params: {
        ids,
      }
    })
  }

  export const update = (row) => {
    return request({
      url: '/api/blade-system/param/submit',
      method: 'post',
      data: row
    })
  }

  export const getDict = (id) => {
    return request({
      url: '/api/blade-system/param/detail',
      method: 'get',
      params: {
        id,
      }
    })
  }

  export const getDictTree = () => {
    return request({
      url: '/api/blade-system/param/tree',
      method: 'get'
    })
  }