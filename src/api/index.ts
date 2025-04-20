import request from '../utils/request'
// 获取验证码
export function getCode(data: any) {
    return request.post('/get/code', data)
}

//注册
export function useraAuthentication(data: any) {
    return request.post('/user/authentication', data)
}

export function login(data: any) {
    return request.post('/login', data)
}

export function authAdmin(params: any) {
    return request.get('/auth/admin', { params })
}

//菜单权限数据
export function userGetmenu() {
    return request.get('/user/getmenu')
}
//菜单权限修改
export function userSetMenu(data: any) {
    return request.post('/user/setmenu', data)
}
//菜单权限的列表
export function menuList(params: any) {
    return request.get('/menu/list', { params })
}
//权限下拉列表
export function menuSelectlist() {
    return request.get('/menu/selectlist')
}

//用户数据修改
export function updateUser(data: any) {
    return request.post('/update/user', data)
}
//用户菜单权限
export function menuPermissions() {
    return request.get('/menu/permissions')
}
