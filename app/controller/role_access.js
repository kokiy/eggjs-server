'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

class RoleAccessController extends Controller {


  async update() {
    const ctx = this.ctx
    const id = ctx.params.id
    const role = await ctx.model.Role.findByPk(id)
    const Op = ctx.app.Sequelize.Op
    if (!role) {
      this.ctx.throw(500, '角色不存在')
    }
    const { selectedAccess = [] } = ctx.request.body
    let matchAccess
    if (!_.isEmpty(selectedAccess)) {
      matchAccess = await ctx.model.Access.findAll({
        where: {
          id: {
            [Op.or]: selectedAccess,
          },
        },
      })
    } else {
      matchAccess = []
    }
    await role.setAccesses(matchAccess)
    ctx.body = {
      msg: '更新成功',
    }
  }


}

module.exports = RoleAccessController
