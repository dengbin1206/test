import request from '@/router/axios';

export const list = (data) => {
    return request({
      url: 'api/blade-biz/manage/list',
      method: 'post',
      data:data
    })
  }


export const submit = (data) => {
    return request({
      url: 'api/blade-biz/manage/submit',
      method: 'post',
      data:data
    })
  }

  export const detail = (id) => {
    return request({
      url: 'api/blade-biz/manage/detail',
      method: 'get',
      params:{
          id
      }
    })
  }

  export const fileConfigBySearch = (search) => {
    return request({
      url: 'api/blade-biz/file/fileConfigBySearch',
      method: 'get',
      params:{
        search
      }
    })
  }

  export const wjpzList = () => {
    return request({
      url: 'api/blade-biz/file/list',
      method: 'get',
    })
  }

  export const wjpzSub = (data) => {
    return request({
      url: 'api/blade-biz/file/submit',
      method: 'post',
      data:data
    })
  }

  export const deptByLabel = (search) => {
    return request({
      url: 'api/blade-system/dept/deptByLabel',
      method: 'get',
      params:{search}
    })
  }

  export const delManage = (id) => {
    return request({
      url: 'api/blade-biz/manage/delManage',
      method: 'get',
      params:{id}
    })
  }


