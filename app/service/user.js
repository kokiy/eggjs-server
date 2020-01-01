'use strict'

const Service = require('egg').Service

class UserService extends Service {

  async getCurrentUser() {
    const user = await this.ctx.model.User.findByPk(this.ctx.session.user.id)
    const { roleId, username, mobile, email, is_super, avatar } = user.dataValues
    const role = await this.ctx.model.Role.findByPk(roleId)
    const roleAccesses = await role.getAccesses({ attributes: ['requests', 'name', 'key', 'type'], raw: true })
    return { username, mobile, email, is_super, avatar, accesses: roleAccesses }
  }

}


module.exports = UserService
