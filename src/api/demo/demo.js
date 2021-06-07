import request from '@/router/axios';

/*
export const getDetail = () => {
  console.log('================');
  return request({
    url:'/api/demo/detail',
    method:'get'
  })
};
*/

export const getList = (current, size, params) => {
  return request({
    url: '/api/demo/list',
    method: 'get',
    params: {
      params,
      current,
      size,
    }
  })
};
export const getDetail = (id) => {
  return request({
    url: '/api/demo/detail',
    method: 'get',
    params: {
      id,
    }
  })
};
export const remove = (ids) => {
  return request({
    url: '/api/demo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
};
export const submit = (row) => {
  return request({
    url: '/api/demo/submit',
    method: 'post',
    data: row
  })
};
