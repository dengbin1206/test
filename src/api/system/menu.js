import request from '@/router/axios'

export const getTree = (topMenuId) => request({
    url: '/api/blade-system/menu/grant-tree',
    method: 'get',
    params:{
      topMenuId
    }
  });
  export const topTree = () => request({
    url: '/api/blade-system/menu/menu-function-tree',
    method: 'get'
  });

  export const detail = (id) => {
    return request({
      url: '/api/blade-system/menu/detail',
      method: 'get',
      params: {
        id,
      }
    })
  }


  export const remove = (ids) => {
    return request({
      url: '/api/blade-system/menu/remove',
      method: 'post',
      params: {
        ids,
      }
    })
  }

  export const add = (row) => {
    return request({
      url: '/api/blade-system/menu/submit',
      method: 'post',
      data: row
    })
  }

  export const getFunTree = () => request({
    url: '/api/blade-system/function/menu-tree',
    method: 'get'
  });

  export const menuAdd = (row) => {
    return request({
      url: '/api/blade-system/menu/submitConfigure',
      method: 'post',
      data: row
    })
  }

  export const getList = () => request({
    url: '/api/blade-system/function/menu-list',
    method: 'get'
  });


  export const configure = (id) => {
    return request({
      url: '/api/blade-system/menu/configure',
      method: 'post',
      params: {
        id,
      }
    })
  }

  export const menu_sort = (parentId) => {
    return request({
      url: '/api/blade-system/menu/menu-sort',
      method: 'get',
      params: {
        parentId,
      }
    })
  }
  export const subSort = (row) => {
    return request({
      url: '/api/blade-system/menu/sort',
      method: 'post',
      data: row
    })
  }
