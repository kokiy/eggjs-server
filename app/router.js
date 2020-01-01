'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router } = app
  // 用户模块
  router.post('/api/user/login', 'user.login')
  router.get('/api/user/logout', 'user.logout')
  router.get('/api/user/current', 'user.currentUser')
  router.put('/api/user/role-update', 'user.updateRole')
  router.put('/api/user/update', 'user.updateCurrentUser')


  router.resources('user', '/api/user', 'user')
  router.get('/api/captcha', 'captcha.index')
  router.resources('role', '/api/role', 'role')

  router.get('/api/access/tree', 'access.tree')
  router.resources('access', '/api/access', 'access')
  router.resources('roleAccess', '/api/role-access', 'roleAccess')

  router.post('/api/file/upload', 'file.index')
  router.post('/api/file/batch-upload', 'file.batch')


}
