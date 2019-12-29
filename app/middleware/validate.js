'use strict'
const _ = require('lodash')
const validateRule = require('../../config/param-validate')

const queryValidate = { limit: { type: 'int?' }, offset: { type: 'int?' } }

module.exports = () => {
  return async (ctx, next) => {
    const matchRule = _.find(validateRule, ({ path, method }) => path === ctx.path && method === ctx.method)
    if (matchRule && matchRule.rule) {
      const validateParams = ctx.request.body
      ctx.validate(matchRule.rule, validateParams)
    } else {
      // 查询公共校验
      const validateParams = ctx.request.query
      validateParams.limit = validateParams.limit && _.parseInt(validateParams.limit)
      validateParams.offset = validateParams.offset && _.parseInt(validateParams.offset)
      ctx.validate(queryValidate, validateParams)
    }
    await next()
  }
}
