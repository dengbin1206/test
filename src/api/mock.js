/*
 * @Date: 2021-01-03 11:01:33
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-03 11:15:55
 * @FilePath: /SX-DTBF-VIEW/src/api/mock.js
 * @Description: 
 */

import request from '@/router/axios';

export const mockList = () => {
    return request({
      url: '/list',
      method: 'get',
    })
}