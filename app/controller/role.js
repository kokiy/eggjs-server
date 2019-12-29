'use strict'

const Controller = require('egg').Controller


class RoleController extends Controller {


  async index() {
    const ctx = this.ctx
    ctx.body = await ctx.model.Role.findAll()
  }


  async show() {
    const ctx = this.ctx
    const item = await ctx.model.Role.findByPk(ctx.params.id)
    const access = await item.getAccesses({ raw: true })
    ctx.body = { ...item.dataValues, access }
  }

  async create() {
    const ctx = this.ctx
    const { name, description } = ctx.request.body
    const res = await ctx.service.common.findOneByQuery(ctx.model.Role, { name })
    if (res && res.name) {
      this.ctx.throw(500, '名称已存在')
    }
    await ctx.model.Role.create({ name, description })
    ctx.status = 201
    ctx.body = {
      msg: '新建成功',
    }
  }

  async update() {
    const ctx = this.ctx
    const id = ctx.params.id
    const role = await ctx.model.Role.findByPk(id)

    if (!role) {
      this.ctx.throw(500, '角色不存在')
    }
    const { name, description } = ctx.request.body
    await role.update({ name, description })
    ctx.body = {
      msg: '更新成功',
    }
  }

  async destroy() {
    const ctx = this.ctx
    const id = ctx.params.id
    const role = await ctx.model.Role.findByPk(id)
    if (!role) {
      this.ctx.throw(500, '角色不存在')
    }
    await role.setUsers([])
    await role.setAccesses([])
    await role.destroy()
    ctx.body = {
      msg: '删除成功',
    }
  }

}

module.exports = RoleController
