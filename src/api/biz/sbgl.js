import request from '@/router/axios';

export const selectByStatus = (params) => {
    return request({
      url: 'api/blade-biz/check/selectByStatus',
      method: 'get',
      params: params
    })
  }


  export const checkList = (params) => {
    return request({
      url: 'api/blade-biz/check/checkList',
      method: 'post',
      data:params
    })
  }


  export const list = (data) => {
    return request({
      url: 'api/blade-biz/equipmentRepair/list',
      method: 'post',
      data:data
    })
  }


  export const detailSingle = (checkId) => {
    return request({
      url: 'api/blade-biz/register/detailSingle',
      method: 'get',
      params:{
        checkId
      }
    })
  }

  export const getRegister = (equipNum,checkId) => {
    return request({
      url: 'api/blade-biz/register/getRegister',
      method: 'get',
      params:{
        equipNum,
        checkId
      }
    })
  }

  export const detail = (params) => {
    return request({
      url: 'api/blade-biz/equipmentRepair/detail',
      method: 'post',
      data: params
    })
  }

  export const submit = (params) => {
    return request({
      url: 'api/blade-biz/equipmentRepair/submit',
      method: 'post',
      data:params
    })
  }

  export const blurrySelect = (search) => {
    return request({
      url: 'api/blade-biz/equipmentRepair/blurrySelect',
      method: 'get',
      params:{
        search
      }
    })
  }


  export const modelByName = (modelName) => {
    return request({
      url: 'api/blade-modelform/model/modelByName',
      method: 'get',
      params:{
        modelName
      }
    })
  }


  export const checkFinish = (params) => {
    return request({
      url: 'api/blade-biz/register/checkFinish',
      method: 'post',
      data:params
    })
  }


  export const getList = (current,size,params) => {
    return request({
      url: 'api/blade-biz/equipBasic/list',
      method: 'get',
      params: {
        current,
        size,
        ...params
      }
    })
  }

  export const add = (row) => {
    return request({
      url: 'api/blade-biz/equipBasic/submit',
      method: 'post',
      data:row
    })
  }

  export const update = (row) => {
    return request({
      url: 'api/blade-biz/equipBasic/submit',
      method: 'post',
      data:row
    })
  }

  export const remove = (ids) => {
    return request({
      url: 'api/blade-biz/equipBasic/remove',
      method: 'get',
      params:{
        ids
      }
    })
  }

  export function generateUrlNew(equipNum) {
    return request({
      url: 'api/blade-widget/qrCode/generateUrlNew',
      method: 'get',
      params:{
        equipNum
      }
    })
  }

  export const djAdd = (row) => {
    return request({
      url: 'api/blade-biz/register/saveSpot',
      method: 'post',
      data:row
    })
  }

export const qrCode = (equipNum) => {
  return request({
    url: 'api/blade-biz/equipBasic/parseQrCode',
    method: 'get',
    params:equipNum
  })
}

export const getNo = (equipNum) => {
  return request({
    url: 'api/blade-biz/equipBasic/getNo',
    method: 'get',
    params:{
      equipNum
    }
  })
}

export const singleDownloadByte = (affixId) => {
  return request({
    url: 'api/blade-resource/affix/singleDownloadByte',
    method: 'get',
    params:{
      affixId
    }
  })
}

export const search = (search) => {
  return request({
    url: 'api/blade-biz/checkTeam/search',
    method: 'get',
    params:{
      search
    }
  })
}

export const showCheck = (checkId) => {
  return request({
    url: 'api/blade-biz/register/showCheck',
    method: 'get',
    params:{
      checkId
    }
  })
};

export const repairList = (query) => {
  return request({
    url: 'api/blade-biz/equipmentRepair/list',
    method: 'post',
    data:query
  })
}

export const register = (equipNum) => {
  return request({
    url: 'api/blade-biz/register/register',
    method: 'get',
    params:{
      equipNum
    }
  })
}

export const flows = (equipmentRepairId) => {
  return request({
    url: 'api/blade-biz/equipmentRepair/flows',
    method: 'get',
    params:{
      equipmentRepairId
    }
  })
}

export const parse2QrCode = (equipNum) => {
  return request({
    url: 'api/blade-biz/register/parse2QrCode',
    method: 'get',
    params:{
      equipNum
    }
  })
}

export const getSpotCheck = (checkId) => {
  return request({
    url: 'api/blade-biz/register/getSpotCheck',
    method: 'get',
    params:{
      checkId
    }
  })
}

export const searchDetail = (groupCode,search) => {
  return request({
    url: 'api/blade-system/group/searchDetail',
    method: 'get',
    params:{
      groupCode,
      search
    }
  })
};
export const equipDetail = (equipId) => {
  return request({
    url: 'api/blade-biz/equipBasic/detail',
    method: 'get',
    params:{
      id:equipId
    }
  })
};
export const searchEquipType = (search) => {
  return request({
    url: 'api/blade-biz/check/selectEquipCate',
    method: 'get',
    params:{
      search
    }
  })
};
