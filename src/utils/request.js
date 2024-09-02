import axios from 'axios';
import Qs from 'qs'
import store from '../store/index'
import router from '../router'
import {
  baseURL
} from './config';
import {
  Message
} from 'element-ui';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = baseURL;

//http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    // config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "token": window.localStorage.getItem('token'),
      "userId": window.localStorage.getItem('userId')

      // 'userName': '17709224992',
      // 'XSRF-TOKEN': 'd004a475-e056-46a8-b22c-2ef09ced06c0'
    }
    // if(token){
    //   config.params = {'token':token}
    // }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  response => {
    let data = response.data;
    let code = data.errorCode;
    let errorMessage = data.errorMessage;
    
    if (code == 'SYS.0015') {
      if (errorMessage != '密码有误') { //修改用户支付密码报这个错
        window.localStorage.removeItem('userId');
        window.localStorage.removeItem('token');
        store.dispatch('setLogin', false);
        Message({
          message: '登录已过期，请重新登录',
          duration: 1000,
          type: 'error'
        });
        setTimeout(res => {
          router.replace('/login');
        }, 500)
      }
    }
    return response;
  },
  error => {
    let status = error.response && error.response.data.errorCode || '';
    if (status == 'SYS.0015') {
        window.localStorage.removeItem('userId');
        window.localStorage.removeItem('token');
        store.dispatch('setLogin', false);
        Message({
          message: '登录已过期，请重新登录',
          duration: 1000,
          type: 'error'
        });
        setTimeout(res => {
          router.replace('/login');
        }, 500)
    }
    return Promise.reject(error)
  }
)

const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err)
    })
  })
}

const post = (url, params = {}) => {
  
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(response => {
      resolve(response.data);
    }, err => {
      reject(err)
    })
  })
}
const post1 = (url, params = {}, data) => {
  let qs = Qs.stringify(params);
  url = url + '?' + qs
  // return axios.post(url, data);
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(response => {
      resolve(response.data);
    }, err => {
      reject(err)
    })
  })
}
export default {
  get,
  post,
  post1,
  axios: axios,
}
