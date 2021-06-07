import request from '@/router/axios';


// 查询岗位数据列表
export function getList(data) {
  return request({
    url: '/api/blade-system/post/postListPage',
    method: 'post',
    data:data
  })
}

export const getPostList = (tenantId) => {
  return request({
    url: '/api/blade-system/post/select',
    method: 'get',
    params: {
      tenantId
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-system/post/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/post/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/post/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/post/submit',
    method: 'post',
    data: row
  })
}

export function getdepartment(query) {
  return request({
    url: '/api/blade-system/dept/list',
    method: 'get',
    params: query
  })
}

export const getUserName = (search) => {
  return request({
    url: '/api/blade-user/userBySearch',
    method: 'get',
    params: {
      search,
    }
  })
}
