/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-25 16:40:43
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-23 14:30:39
 */
import Vue from 'vue'
import axios from 'axios'
import { Toast } from 'vant'
import { userInfo } from '../axios/mockApi.js'

const request = axios.create({
  timeout: '30000',
  baseURL: '',
  method: 'post'
})

// const testIp = 'http://10.15.80.192:9427';
// const testIp = 'http://10.19.141.119:9427';
const testIp = 'http://10.33.40.229:9427'

/** 添加请求拦截器 */
request.interceptors.request.use(
  async (req) => {
    // eslint-disable-next-line no-prototype-builtins
    if (Vue.prototype.GLOBAL.isMobile) {
      req.baseURL = process.env.NODE_ENV === 'development' ? testIp : Vue.prototype.GLOBAL.address
      req.headers.Token = (await setReqHeader()).token
    } else {
      req.baseURL = testIp
      req.headers.Token = userInfo.token;
    }
    return req
  },
  (error) => {
    Promise.reject(error)
  }
)

/* 添加响应拦截器 */
request.interceptors.response.use(
  (res) => {
    if (res.data.code === '0' || res.data.code === '200') {
      return res.data
    } else {
      if (res.code === '0x11900001' || res.msg.indexOf('80000029') > -1) {
        Toast.fail({ message: `认证信息过期,请重新登陆!`, duration: 3000 })
        setTimeout(() => {
          Vue.prototype.$hatom.rootInfo.redirectLogin();
        }, 4000)
      } else {
        Toast.fail({ message: res.msg, duration: 3000 })
        return Promise.reject(res.msg)
      }
    }
  },
  (err) => {
    if (err.response && err.response.status >= 500) {
      Toast.fail({ message: `服务器开小差了....(${err.response.status})`, duration: 3000 })
    } else if (err.response && err.response.status === 403) {
      Toast.fail({ message: `认证信息过期,请重新登陆!(${err.response.status})`, duration: 3000 })
      setTimeout(() => {
        Vue.prototype.$hatom.rootInfo.redirectLogin();
      }, 4000)
    } else if (err.isAxiosError) {
      if (err.response && err.response.status) {
        Toast.fail({ message: `网络故障,请检查网络!(${err.response.status})`, duration: 3000 })
      } else {
        Toast.fail({ message: "网络故障,请检查网络!", duration: 3000 })
      }
    }
  }
)

/**
 * 
 */
const setReqHeader = async () => {
  const rootInfo = new Promise((resolve, reject) => {
    try {
      Vue.prototype.$hatom.rootInfo.getRootInfo((res) => {
        res = JSON.parse(res.message);
        resolve(res)
      });
    } catch (error) {
      reject(error)
    }
  })
  return await rootInfo
}

export default request
