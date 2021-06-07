import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-cs/return-factory/list',
      method: 'post',
      data:data
    })
  }


  export const save = (data) => {
    return request({
      url: 'api/blade-cs/return-factory/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-cs/return-factory/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const deletedById = (id) => {
    return request({
      url: 'api/blade-cs/return-factory/deletedById',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const fcjhList = () => {
    return request({
      url: 'api/blade-cs/config-plan/list',
      method: 'get'
    })
  }

  export const saveOrUpdate = (data) => {
    return request({
      url: 'api/blade-cs/config-plan/saveOrUpdate',
      method: 'post',
      data:data
    })
  }

  export const azsqData = (id) => {
    return request({
      url: 'api/blade-cs/install-assign/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const tssqData = (id) => {
    return request({
      url: 'api/blade-cs/debug-assign/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const wbsqData = (id) => {
    return request({
      url: 'api/blade-cs/maintenance-assign/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const getList = () => {
    return request({
      url: 'api/blade-cs/config-plan/list',
      method: 'get'
    })
  }