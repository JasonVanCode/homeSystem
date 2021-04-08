import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
//侧边菜单栏数据
export function getSidebar(query){
    return request({
        url: '/menulist',
        method: 'get',
        params: query
    });
}

//人员登录
export function Login(data) {
    return request({
      url: '/login',
      data: {name:data.name,password:data.password}
    })
  }

//权限管理
export function getRoleMenulist(role_id){
    return request({
        url: '/auth/getrolemenulist',
        method: 'get',
        params: {role_id:role_id}
    });
}

export function getRoleList(){
    return request({
        url: '/auth/getrolelist',
        method: 'get',
    });
}

export function authList(){
    return request({
        url: '/auth',
        method: 'get',
    });
}

export function authSave(data){
    return request({
        url: '/auth/save',
        data: data
    });
}

//人员管理
export function getUserlist(query){
    return request({
        url: '/user',
        method: 'get',
        params: query
    });
}

export function userSave(data){
    return request({
        url: '/user/save',
        data:data,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export function getSwitchlist(data){
    return request({
        url: '/switch/getlist',
        method: 'get',
        params: data
    });
}

//获取switch游戏
export function userDel(data){
    return request({
        url: '/user/del',
        data: data
    });
}


//退出登录
export function loginOut(data){
    return request({
        url: '/loginout',
        data: data
    });
}

//富文本编辑器
export function blogSave(data){
    return request({
        url: '/blog/save',
        data: data
    });
}

export function blogList(data){
    return request({
        url: '/blog/getlist',
        params: data,
        method: 'get',
    });
}

export function blogEditList(data){
    return request({
        url: '/blog/geteditlist',
        params: data,
        method: 'get',
    });
}

export function blogDel(data){
    return request({
        url: '/blog/dellist',
        data: data
    });
}