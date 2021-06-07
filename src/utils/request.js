import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, getUserInfo } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  timeout: 30 * 1000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['accessToken'] = getToken()
    }

    if (store.getters.userId) {
      config.headers['userId'] = getUserInfo() ? getUserInfo().userId : ''
    }
    config.headers['system'] = store.getters.system
    config.headers['paltform'] = store.getters.paltform

    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 200) {
      if (res.code === 401 || res.code === 403) {
        // 需要重新定位到登录页面
        // window.location.href = window.location.origin
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      } else {
        Message({
          message: res.message || 'error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(res.message || 'error')
      }
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
