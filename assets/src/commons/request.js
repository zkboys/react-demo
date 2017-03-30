// import qs from 'query-string';
import axios from 'axios';
import config from '../configs';

const urlPrefix = config.apiPath;
// const debug = process.env.NODE_ENV !== 'production';
// axios配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = '/'; // http://localhost:8080';

// 添加请求拦截器
axios.interceptors.request.use(cfg => {
    // 在发送请求之前做些什么
    // TODO _xsrf 处理
    cfg.xsrfCookieName = '_xsrf';
    cfg.xsrfHeaderName = '_xsrf';
    return cfg;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

/**
 *
 * @param {*} url
 * @param {*} params
 * @param {*} method
 */
function fetch(url, params, method = 'get') {
    url = urlPrefix + url;
    return new Promise((resolve, reject) => {
        axios({
            method,
            url,
            data: params,
        }).then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function get(url, params) {
    return fetch(url, params, 'get');
}

export function post(url, params) {
    return fetch(url, params, 'post');
}

export function put(url, params) {
    return fetch(url, params, 'put');
}

export function del(url, params) {
    return fetch(url, params, 'delete');
}

