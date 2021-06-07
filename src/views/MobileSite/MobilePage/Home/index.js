import request from '@/router/axios';

export const getTopMenu = () => request({
    url: '/api/blade-system/menu/mobile-user-menu-function-tree',
    method: 'get',
  });