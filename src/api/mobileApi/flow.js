import request from '@/router/axios';
import website from "@/config/website";

export const mobileLogin = (tenantId, username, password, type, key, code) => request({
    url: '/api/blade-auth/oauth/token',
    method: 'post',
    headers: {
        'Tenant-Id': tenantId,
        'Captcha-Key': key,
        'Captcha-Code': code,
        "isMobile": "true"
    },
    params: {
        tenantId,
        username,
        password,
        grant_type: (website.captchaMode ? "captcha" : "password"),
        scope: "all",
        type
    }
});

//回退下拉
export const getBackNode = (params) => {
    return request({
        url: `/api/blade-flow/task/get-back-node`,
        method: 'get',
        headers: {
            "isMobile": "true"
        },
        params
    })
}


// 用户选择
export const userList = (params) => {
    return request({
        url: '/api/blade-user/getUserInfoPageBySearch',
        method: 'post',
        headers: {
            "isMobile": "true"
        },
        data: {
            ...params
        }
    })
}

//待办列表
export const myToDoList = (search, current, size) => {
    return request({
        url: 'api/blade-flow/task/mobile/myToDoList',
        method: 'get',
        headers: {
            "isMobile": "true"
        },
        params: {
            search,
            current,
            size
        }
    })
}

// 已办列表
export const myDoneList = (search, status, current, size) => {
    return request({
        url: '/api/blade-flow/task/mobile/myDoneList',
        method: 'get',
        headers: {
            "isMobile": "true"
        },
        params: {
            search,
            status,
            current,
            size,
        }
    })
}

//  我的发起
export const queryAllList = (search, status, current, size) => {
    return request({
        url: 'api/blade-flow/task/mobile/myInstanceList',
        method: 'get',
        headers: {
            "isMobile": "true"
        },
        params: {
            search,
            status,
            current,
            size
        }
    })
}


// 抄送回复
export const instCopyReply = (search, status, current, size) => {
    return request({
        url: 'api/blade-flow/task/mobile/instCopyReply',
        method: 'get',
        headers: {
            "isMobile": "true"
        },
        params: {
            search,
            status,
            current,
            size,
        }
    })
}


// 我的待办条目数
export const myToDoCount = () => {
    return request({
        url: 'api/blade-flow/task/myToDoCount',
        method: 'get',
        headers: {
            "isMobile": "true"
        },

    })
}

//抄送回复条数
export const instCopyMeCount = () => {
    return request({
        url: 'api/blade-flow/task/instCopyMeCount',
        method: 'get',
        headers: {
            "isMobile": "true"
        },
    })
}

// 用户详情
export const getUserInfo = () => {
    return request({
        url: '/api/blade-user/info',
        method: 'get',
        headers: {
            "isMobile": "true"
        },
    })
}

// 流程详情

export const historyInfo = (params) => {
    return request({
        url: `/api/blade-flow/task/historyInfo`,
        method: 'get',
        params,
        headers: {
            "isMobile": "true"
        },
    })
}


// 抄送状态变已读

export const changeCopyStatus = (proInstId) => {
    return request({
        url: 'api/blade-flow/task/changeCopyStatus',
        method: 'get',
        params: {
            proInstId
        }
    })
}


// 流程同意
export const completeTask = (data) => {
    return request({
        url: '/api/blade-flow/task/complete-task',
        method: 'post',
        data,
        headers: {
            "isMobile": "true"
        },
    })
}

//拒绝
export const stopTask = (data) => {
    return request({
        url: `/api/blade-flow/task/stop-task`,
        method: 'post',
        data,
        headers: {
            "isMobile": "true"
        },
    })
}

// 签收

export const siginTask = (taskId) => {
    return request({
        url: `/api/blade-flow/task/claim-task`,
        method: 'get',
        params: taskId,
        headers: {
            "isMobile": "true"
        },
    })
}


// 回退
export const backToTask = (data) => {
    return request({
        url: `/api/blade-flow/task/back-to-task/`,
        method: 'post',
        data: data,
        headers: {
            "isMobile": "true"
        },
    })
}


//抄送
export const copyTask = (data) => {
    return request({
        url: `/api/blade-flow/task/copy-task`,
        method: 'post',
        data,
        headers: {
            "isMobile": "true"
        },
    })
}

//转办
export const delegateTask = (data) => {
    return request({
        url: `/api/blade-flow/task/delegate-task`,
        method: 'post',
        data,
        headers: {
            "isMobile": "true"
        },
    })
}

// 授权查看
export const impowerProcess = (proInstId, userIds) => {
    return request({
        url: '/api/blade-flow/task/impower-process',
        method: 'post',
        data: {
            proInstId,
            userIds
        },
        headers: {
            "isMobile": "true"
        },
    })
}

//取回
export const retrieve = (params) => {
    return request({
        url: '/api/blade-flow/task/retrieve',
        method: 'get',
        params,
        headers: {
            "isMobile": "true"
        },
    })
}


// 作废
export const adminTask = (params) => {
    return request({
        url: '/api/blade-flow/task/admin-stop-task',
        method: 'get',
        params,
        headers: {
            "isMobile": "true"
        },
    })
}

//我的抄送回复保存
export const updateInstCopys = (id, reply, readStatus = 1) => {
    return request({
        url: `/api/blade-flow/task/updateInstCopy`,
        method: 'post',
        data: {
            id,
            reply,
            readStatus
        },
        headers: {
            "isMobile": "true"
        },
    })
}


// 表单字段查询
export const queryForm = (paramId,
    paramType,
    proDefId,
    nodeCode) => {
    return request({
        url: '/api/blade-dynamic/dynamicConfig/queryFormInfoNew',
        method: 'get',
        params: {
            paramId,
            paramType,
            proDefId,
            nodeCode
        },
        headers: {
            "isMobile": "true"
        },
    })
}

// 表单数据查询
export const initData = (row) => {
    return request({
        url: '/api/blade-dynamic/dynamicConfig/findByIdNew',
        method: 'post',
        data: row,
        headers: {
            "isMobile": "true"
        },
    })
}

// 模糊搜索
export const fuzzySearch = (data) => {
    return request({
        url: '/api/blade-modelform/model/fuzzySearch',
        method: 'post',
        data: data,
        headers: {
            "isMobile": "true"
        },
    })
}


// 部门选择
export const deptList = (params) => {
    return request({
        url: '/api/blade-system/dept/getDeptPageBySearch',
        method: 'post',
        headers: {
            "isMobile": "true"
        },
        data: {
            ...params
        }
    })
}


// 图片回显
export const showImage = (fileId) => {
    return request({
        url: '/api/blade-resource/affix/singleDownloadByteByFildId',
        method: 'get',
        params: {
            fileId
        },
        headers: {
            "isMobile": "true"
        },
    })
}


// 表单保存
export const update = (row) => {
    return request({
        url: '/api/blade-dynamic/dynamicConfig/updateNew',
        method: 'post',
        data: row,
        headers: {
            "isMobile": "true"
        },
    })
}
