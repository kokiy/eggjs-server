'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

class AccessController extends Controller {


  async index() {
    const ctx = this.ctx
    const { limit, offset, ...params } = ctx.query
    const query = { limit, offset, where: params }
    ctx.body = await ctx.model.Access.findAndCountAll(query)

  }

  async tree() {
    const ctx = this.ctx
    ctx.body = await ctx.model.Access.findAll({
      where: {
        type: '1',
      },
      order: [['id']],
      include: {
        model: ctx.model.Access,
        as: 'child',
        required: false,
        include: {
          all: true,
          nested: true,
        },
      },
    })
  }


  async show() {
    const ctx = this.ctx
    ctx.body = await ctx.model.Access.findByPk(ctx.params.id)
  }

  async create() {
    const ctx = this.ctx
    const { key } = ctx.request.body
    const res = await ctx.service.common.findOneByQuery(ctx.model.Access, { key })
    if (res && res.id) {
      this.ctx.throw(500, 'key值重复')
    }
    await ctx.model.Access.create(ctx.request.body)
    ctx.status = 201
    ctx.body = {
      msg: '新建成功',
    }
  }

  async update() {
    const ctx = this.ctx
    const id = ctx.params.id
    const item = await ctx.model.Access.findByPk(id)
    if (!item) {
      this.ctx.throw(500, '角色不存在')
    }
    const { key, name, description, requests, parent_id } = ctx.request.body
    await item.update({ key, name, description, requests, parent_id })
    ctx.body = {
      msg: '更新成功',
    }
  }

  async destroy() {
    const ctx = this.ctx
    const id = ctx.params.id
    const role = await ctx.model.Access.findByPk(id)
    if (!role) {
      this.ctx.throw(500, '角色不存在')
    }
    const childs = await this.ctx.model.Access.findAll({
      where: { parent_id: id },
    })
    _.each(childs, child => {
      child.destroy()
    })
    await role.destroy()
    ctx.body = {
      msg: '删除成功',
    }
  }

}

module.exports = AccessController
