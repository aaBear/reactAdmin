import ajax from './ajax';

// 登陆接口
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'post');