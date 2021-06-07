import request from '@/router/axios';

export const modelList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/model/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const queryList = (row) => {
  return request({
    url: '/api/blade-flow/model/queryList',
    method: 'post',
    data: row
  })
}

export const saveModel = (row) => {
  return request({
    url: '/api/blade-flow/model/save',
    method: 'post',
    data: row
  })
}
export const updateModel = (row) => {
  return request({
    url: '/api/blade-flow/model/update',
    method: 'post',
    data: row
  })
}
//详情
export const flowDetail = (id) => {
  return request({
    url: '/api/blade-flow/model/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const managerList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/manager/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const followList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/follow/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const removeModel = (ids) => {
  return request({
    url: '/api/blade-flow/model/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const deployModel = (params) => {
  return request({
    url: '/api/blade-flow/model/deploy',
    method: 'post',
    params
  })
}

export const processform = (proDefId) => {
  return request({
    url: '/api/blade-flow/flow/form/list',
    method: 'get',
    params: {
      proDefId
    }
  })
}

export const findFormBySearch = (search) => {
  return request({
    url: `/api/blade-modelform/form/findFormBySearch`,
    method: 'get',
    params: {
      search
    }
  })
}

export const findTableNameBySearch = (search) => {
  return request({
    url: `/api/blade-modelform/model/findTableNameBySearch`,
    method: 'get',
    params: {
      search
    }
  })
}

export const variableList = (params) => {
  return request({
    url: '/api/blade-flow/flow/variable/list',
    method: 'get',
    params: params
  })
}

export const variableDelete = (id) => {
  return request({
    url: `/api/blade-flow/flow/variable/delete`,
    method: 'post',
    params: {
      id
    }
  })
}


export const processNodeTree = (id) => {
  return request({
    url: `/api/blade-flow/flow/node/getProcessNodes/${id}`,
    method: 'get',
  })
}


export const getProcessNodesForDict = (proDefId) => {
  return request({
    url: '/api/blade-flow/flow/node/getProcessNodesForDict',
    method: 'get',
    params: {
      proDefId
    }
  })
}



export const saveFlowSet = (params) => {
  return request({
    url: '/api/blade-flow/flow/process/config/saveOrUpdate',
    method: 'post',
    data: params
  })
}


export const changeState = (params) => {
  return request({
    url: '/api/blade-flow/manager/change-state',
    method: 'post',
    params
  })
}

export const deployUpload = (category, tenantIds, files) => {
  const formData = new FormData();
  formData.append('category', category);
  formData.append('tenantIds', tenantIds);
  files.forEach(file => {
    formData.append('files', file);
  });
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/blade-flow/manager/deploy-upload',
    method: 'post',
    data: formData
  })
}

export const deleteDeployment = (deploymentIds) => {
  return request({
    url: '/api/blade-flow/manager/delete-deployment',
    method: 'post',
    params: {
      deploymentIds,
    }
  })
}

export const deleteProcessInstance = (params) => {
  return request({
    url: '/api/blade-flow/follow/delete-process-instance',
    method: 'post',
    params
  })
}

export const findFieldInfoById = (modelId) => {
  return request({
    url: '/api/blade-modelform/model/findFieldInfoById',
    method: 'get',
    params: {
      modelId
    }
  })
}


export const getBackNode = (taskId) => {
  return request({
    url: '/api/blade-flow/task/get-back-node',
    method: 'get',
    params: {
      taskId
    }
  })
}


export const getFlowModelSource = (modelId) => {
  return request({
    url: '/api/blade-modelform/model/getFlowModelSource',
    method: 'get',
    params: {
      modelId
    }
  })
}


export const processConfigList = (proDefId) => {
  return request({
    url: '/api/blade-flow/flow/processConfig/list',
    method: 'get',
    params: {
      proDefId
    }
  })
}

export const flowMesConfig = (proDefId) => {
  return request({
    url: '/api/blade-flow/flow/flowMesConfig/list',
    method: 'get',
    params: {
      proDefId
    }
  })
}

export const flowImageByDef = (proDefId) => {
  return request({
    url: '/api/blade-flow/task/flowImageByDef',
    method: 'get',
    params: {
      proDefId
    }
  })
}

export const showVersion = (modelKey) => {
  return request({
    url: '/api/blade-flow/model/showVersion',
    method: 'get',
    params: {
      modelKey
    }
  })
}

export const getFormById = (formId) => {
  return request({
    url: '/api/blade-modelform/form/getFormById',
    method: 'get',
    params: {
      formId
    }
  })
}


export const getUserInfoByIds = (userIds) => {
  return request({
    url: '/api/blade-user/getUserInfoByIds',
    method: 'post',
    data: userIds
  })
}

export const getAll = () => {
  return request({
    url: '/api/blade-user/getAll',
    method: 'get',
  })
}

export const getAllSys = () => {
  return request({
    url: '/api/blade-system/post/getAllSys',
    method: 'get',
  })
}

export const deptTree = () => {
  return request({
    url: '/api/blade-system/dept/tree',
    method: 'get',
  })
}

