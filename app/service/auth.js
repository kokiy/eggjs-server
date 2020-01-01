'use strict'

const Service = require('egg').Service
const _ = require('lodash')

class AuthService extends Service {

  async authCheck() {
    const Op = this.ctx.app.Sequelize.Op
    const { roleId, is_super } = this.ctx.session.user
    if (is_super) {
      return true
    }
    const role = await this.ctx.model.Role.findByPk(roleId)
    const roleAccesses = await role.getAccesses({ attributes: ['requests'], where: { parent_id: { [Op.not]: null } }, raw: true })
    const matchAccess = _.find(roleAccesses, ({ requests = [] }) => {
      const isMatch = _.find(requests, ({ method, path }) => {
        const pathExp = new RegExp(path)
        if (this.ctx.method === method && pathExp.test(this.ctx.path)) {
          return true
        }
        return false
      })
      return !!isMatch
    })
    return !!matchAccess

  }
}


module.exports = AuthService
