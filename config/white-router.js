'use strict'
// 路由白名单 不需要校验是否登录就可以访问的api


const GET = 'GET'
const PUT = 'PUT'
const POST = 'POST'
const DELETE = 'DELETE'

module.exports = [
  { path: '/api/user/login', method: POST },
  { path: '/api/user/logout', method: GET },

  { path: '/api/user', method: POST },
  { path: '/api/captcha', method: GET },
  { path: '/api/user/current', method: GET },


]

