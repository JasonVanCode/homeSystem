import axios from 'axios';
import qs from 'qs';
import router from '../router';
import tool from '../cookie/index';
//关于前后端分离跨域问题
//由于自定义header之后，axios默认多了一个 请求方法是 option ，而后台对于option的请求方法没有设置跨域允许，所以会出现请求失败报错问题

const service = axios.create({
    timeout: 70000, // 请求超时时间
    baseURL: process.env.VUE_APP_API,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
});
// 拦截器
service.interceptors.request.use(
    config => {
         // 在发送请求之前做些什么
        if(config.headers['Content-Type'] == 'application/x-www-form-urlencoded'){
            config.data = qs.stringify(config.data);
        }
        let userinfo = tool.getCookie('userinfo')?JSON.parse(tool.getCookie('userinfo')):'';

        if(userinfo && userinfo.token){
            config.headers['Authorization'] = userinfo.token;
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        if(error.response){
            switch (error.response.status) {
                case 401:
                    router.push({ path: '/login' });
                break;
                
              }
        }
        return Promise.reject();
    }
);

export default service;
