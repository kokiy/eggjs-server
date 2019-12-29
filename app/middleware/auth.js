'use strict'
module.exports = () => {
  return async (ctx, next) => {
    if (ctx.session.user) {
      const canCall = await ctx.service.auth.authCheck()
      if (canCall) {
        await next()
      } else {
        ctx.throw(403, '没有权限')
      }
    } else {
      ctx.status = 401
      ctx.body = {
        msg: '没有登录',
      }
    }
  }
}
