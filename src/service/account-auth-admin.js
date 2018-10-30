/**
 * 用户中心service层
 * @authors jp
 * @date    2018-05-21
 */

import axios from '@/config/api.js'

/* 登录 */
export const apiLogin = params => axios.post('/account_auth_admin/administrator-api.login', params)

/*获取用户*/
export const apiFindUser = params => axios.post('/account_auth_admin/user-api.findUser', params)