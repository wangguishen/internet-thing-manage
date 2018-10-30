/**
 * axios封装
 * @authors jp
 * @date    2018-04-03
 */

//引入axios
import axios from 'axios'

let cancel = {};
let promiseArr = {};
const CancelToken = axios.CancelToken;
//请求拦截器
axios.interceptors.request.use(config => {
    //发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) {
        promiseArr[config.url]('操作取消')
        promiseArr[config.url] = cancel
    } else {
        promiseArr[config.url] = cancel
    }
      return config
}, error => {
    return Promise.reject(error)
})

//响应拦截器
axios.interceptors.response.use(response => {
  if (response.data === -1) {
    window.confirm('登录超时，请重新登录')
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.location.href = '/'
  } else {
    return response
  }
}, error => {
  return Promise.reject(error);
});

//axios.defaults.baseURL = 'http://172.16.43.136:8083'
axios.defaults.baseURL = ''

//设置默认请求头
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest'
}
axios.defaults.timeout = 200000

export default {
  //get请求
  get (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  //post请求
  post (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  }
}