import request from '@/router/axios';

export const dynamicSelect = (url,params,size) => {
  return request({
    url: url?url:'/api/blade-dynamic/dynamicConfig/dynamicSelectSearch',
    method: 'post',
    data: params
  })
};
