import axios from 'axios';
import Vue from 'vue';
import { Message } from 'hui';
import { trimOnlySpace, isObject } from '@hui-pro/utils';
import { getToken } from '@/utils/common';
import i18n from '@/i18n';
import merge from 'deepmerge';
import wrapAxiosInstance from 'traceservice-instrumentation-axios';
const isDev = process.env.NODE_ENV === 'development';
const devBaseUrl = '/api/dzavc';

const systemError = Vue.prototype.$systemError;

const http = axios.create({
  timeout: 180000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': getToken() },
  baseURL: isDev ? devBaseUrl : `/${process.env.VUE_APP_CONTEXT}/` // 接口基本路径
});

// 用于上报前端调用链信息
wrapAxiosInstance(http, {
  serviceName: process.env.VUE_APP_CONTEXT,
  remoteServiceName: process.env.VUE_APP_SERVICE_NAME,
  componentId: process.env.VUE_APP_COMPONENT_ID
});

// 错误提示
function showError({ type, serviceErrorCode, code, msg, traceCode }) {
  msg = msg || i18n.t('common.text.systemError');
  const alertError = type && type === -2;
  if (!alertError) {
    // 没有错误码，消息提示
    Message.error(msg);
  } else {
    systemError({
      title: msg,
      errorCode: serviceErrorCode || code,
      traceCode
    });
  }
}
// 相应拦截器
http.interceptors.response.use(
  function (response) {
    // 请求多语言的接口
    if (/.*\.json$/.test(response.config.url)) {
      return response;
    }
    // 调用链
    const traceId = response.headers.traceid || response.headers.traceId;
    if (traceId) {
      response.data.traceCode = traceId;
    }
    // 对错误进行统一处理
    if (response.data.code !== '0') {
      if (
        !response.config.errorNotNotify &&
        response.config.responseType !== 'blob' &&
        response.data.msg
      ) {
        showError(response.data);
      }
    } else if (response.data.code === '0' && response.config.successNotify) {
      // 弹出成功提示
      Message.success(
        i18n.t(response.config.successMsg) || i18n.t('common.text.saveSuccess')
      );
    }
    return Promise.resolve(response.data);
  },
  function (error) {
    // 根据响应状态码判断是否登录过期
    const response = error.response;
    const rp = response.status;
    // 调用链
    const traceId = response.headers.traceid || response.headers.traceId;
    if (traceId) {
      response.data.traceCode = traceId;
    }
    if (rp === 401 || rp === 403 || rp === 302) {
      if (process.env.NODE_ENV !== 'development') {
        window.location.reload();
      }
    } else if (rp === 500) {
      Message.error(i18n.t('common.text.systemError'));
    } else if (error.message.indexOf('timeout') > -1) {
      Message.error(i18n.t('common.text.timeoutMsg'));
    } else if (isObject(response.data)) {
      showError(response.data);
    }
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
// 请求拦截器
http.interceptors.request.use(
  function (config) {
    // 所有搜索框可输入元素，都不需要去掉前后空格，只有仅输入空格时，此字段搜索无效。(规范: http://10.33.43.73/huidesign/bscs/issues/83)
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    config.url += process.env.VUE_APP_API_SUFFIX;
    return trimOnlySpace(config);
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
export default {
  get(opts) {
    return new Promise((resolve, reject) => {
      const params = {
        method: 'get'
      };
      http(merge(params, opts))
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  delete(opts) {
    return new Promise((resolve, reject) => {
      const params = {
        method: 'delete'
      };
      http(merge(params, opts))
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  post(opts) {
    return new Promise((resolve, reject) => {
      const params = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      http(merge(params, opts))
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  upload(opts) {
    if (getToken() !== '') {
      opts.url += `?_csrf=${getToken()}`;
    }
    const params = {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    return new Promise((resolve, reject) => {
      http(merge(params, opts))
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  download(opts) {
    return new Promise((resolve, reject) => {
      let newParams = {
        method: 'get',
        responseType: 'blob'
      };
      newParams = merge(newParams, opts);
      http(newParams)
        .then(res => {
          const blob = new Blob([res]);
          if (res.type.indexOf('json') > -1) {
            const newblob = blob.slice(0, blob.size);
            const reader = new FileReader();
            reader.readAsText(newblob, 'utf-8');
            reader.onload = function (evt) {
              if (evt.target.readyState === FileReader.DONE) {
                const result = JSON.parse(evt.target.result);
                result.traceCode = res.traceCode;
                if (result.type === -1) {
                  Message.error(result.msg);
                } else if (result.type === -2) {
                  showError(result);
                }
              }
            };
          } else {
            const { params } = newParams;
            if (params.ext) {
              params.type = params.ext;
            }
            if (params.type === 'excel') {
              params.type = 'xls';
            }
            const fileName = `${params.fileName}.${params.type}`;
            if ('download' in document.createElement('a')) {
              // 非IE下载
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              /** IE10+下载**/
              navigator.msSaveBlob(blob, fileName);
            }
          }
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
export { showError };
