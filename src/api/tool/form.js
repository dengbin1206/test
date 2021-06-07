import request from '@/router/axios';

export const getformList = (current, size, params) => {
    return request({
      url: '/api/blade-modelform/form/queryAll',
      method: 'get',
      params: {
        ...params,
        current,
        size,
      }
    })
  }
  export const findFlowList = (search) => {
    return request({
      url: '/api/blade-flow/model/getFlowModelByKeySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }
  export const getList = (current, size, params) => {
    return request({
      url: '/api/blade-modelform/form/getList',
      method: 'post',
      data: {
        ...params,
        current,
        size,
      }
    })
  }
  export const add = (row) => {
    return request({
      url: '/api/blade-modelform/form/save',
      method: 'post',
      data: row
    })
  }
  export const update = (row) => {
    return request({
      url: '/api/blade-modelform/form/updateForm',
      method: 'post',
      data: row
    })
  }

  export const remove = (ids) => {
    return request({
      url: '/api/blade-modelform/form/removeForm',
      method: 'post',
      params: {
        ids,
      }
    })
  }
  export const findFormBySearch = (search) => {
    return request({
      url: '/api/blade-modelform/form/findFormBySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }
  export const findTableNameBySearch = (search) => {
    return request({
      url: '/api/blade-modelform/model/findTableNameBySearch',
      method: 'get',
      params: {
        search,
      }
    })
  }


  export const syncDb = (id) => {
    return request({
      url: '/api/blade-modelform/model/syncDb',
      method: 'get',
      params: {
        id
      }
    })
  }
  //根据模型Id查询字段信息
  export const findFieldsById = (modelId) => {
    return request({
      url: '/api/blade-modelform/model/findFieldInfoById',
      method: 'get',
      params: {
        modelId
      }
    })
  }
  //新增修改设计器
  export const saveOrUpdateDesign = (data) => {
    return request({
      url: '/api/blade-modelform/form/saveOrUpdateDesign',
      method: 'post',
      data:data
    })
  }
  //详情
  export const formDetail = (formId) => {
    return request({
      url: '/api/blade-modelform/form/detail',
      method: 'get',
      params: {
        formId
      }
    })
  }
//获取单行文本处理规则
export const getInputRule = (params) => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=input-rule',
    method: 'get',
    params
  })
}
export const getChildList = (params) => {
  return request({
    url: '/api/blade-system/dict/child-list',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const getBizChildList = (params) => {
  return request({
    url: '/api/blade-system/dict-biz/child-list',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const getDictList = (params) => {
  return request({
    url: '/api/blade-system/dict/list',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getBizDictList = (params) => {
  return request({
    url: '/api/blade-system/dict-biz/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const getParentList = (params) => {
  return request({
    url: '/api/blade-system/dict/parent-list',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getBizParentList = (params) => {
  return request({
    url: '/api/blade-system/dict-biz/parent-list',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const getUserList = (params) => {
  return request({
    url: '/api/blade-user/user-list',
    method: 'get',
    params: {
      ...params
    }
  })
}
//获取省市级数据
export const getCity = (params) => {
  return request({
    url: '/api/blade-system/region/lazy-tree-level',
    method: 'get',
    params
  })
}
