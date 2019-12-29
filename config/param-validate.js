'use strict'
// 参数校验配置
module.exports = [
  {
    path: '/api/user/login',
    method: 'POST',
    rule: {
      mobile: { type: 'string', max: '11', min: '11' },
      password: { type: 'string', min: '6' },
      captcha: { type: 'string' },
    },
  },
  {
    path: '/api/user',
    method: 'POST',
    rule: {
      username: { type: 'string' },
      password: { type: 'string', min: '6' },
      mobile: { type: 'string', max: '11', min: '11' },
      email: { type: 'email' },
    },
  },
  {
    path: '/api/role',
    method: 'POST',
    rule: {
      name: { type: 'string' },
    },
  },


]

