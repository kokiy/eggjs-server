'use strict'

const Controller = require('egg').Controller
const md5 = require('md5')
const _ = require('lodash')


class UserController extends Controller {


  async index() {
    const ctx = this.ctx
    const { limit, offset } = ctx.query
    const query = {
      include: [{ model: ctx.model.Role, attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] },
      limit,
      offset,
    }
    ctx.body = await ctx.model.User.findAndCountAll(query)
  }


  async show() {
    const ctx = this.ctx
    const user = await ctx.model.User.findByPk(ctx.params.id)
    if (!user) {
      this.ctx.throw(500, '用户不存在')
    }
    const role = await user.getRole()
    user.dataValues.role = role
    ctx.body = user.dataValues
  }

  async create() {
    const ctx = this.ctx
    const { username, password, mobile, email } = ctx.request.body
    const res = await ctx.service.common.findOneByQuery(ctx.model.User, { mobile })
    if (res && res.mobile) {
      this.ctx.throw(500, '该手机号已存在')
    }
    await ctx.model.User.create({ username, password: md5(password), email, mobile })
    ctx.status = 201
    ctx.body = {
      msg: '注册成功',
    }
  }

  async updateCurrentUser() {
    const user = await this.ctx.model.User.findByPk(this.ctx.session.user.id)
    if (!user) {
      this.ctx.throw(500, '该用户不存在')
    }
    const { avatar } = this.ctx.request.body
    await user.update({ avatar })
    this.ctx.body = {
      msg: '更新成功',
    }
  }

  async updateRole() {
    const ctx = this.ctx
    const { id, roleId } = ctx.request.body
    const user = await ctx.model.User.findByPk(id)
    if (!user) {
      this.ctx.throw(500, '该用户不存在')
    }
    await user.setRole(roleId)
    ctx.body = {
      msg: '更新成功',
    }

  }

  async destroy() {
    const ctx = this.ctx
    const id = ctx.params.id
    const user = await ctx.model.User.findByPk(id)
    if (!user) {
      this.ctx.throw(500, '用户不存在')
    }
    await user.destroy()
    ctx.body = {
      msg: '删除成功',
    }
  }

  async login() {
    const ctx = this.ctx
    const { mobile, password, captcha } = ctx.request.body
    if (_.toLower(captcha) !== _.toLower(ctx.session.captcha)) {
      ctx.throw(500, '验证码不正确')
    }
    const res = await ctx.service.common.findOneByQuery(ctx.model.User, { mobile })
    const encryPassword = md5(password)
    if (!res) {
      ctx.throw(500, '该用户没有注册')
    } else if (res.password === encryPassword) {
      // 角色id ,is_super 一般不怎么变化缓存起来
      ctx.session.user = {
        id: res.id,
        roleId: res.roleId,
        is_super: res.is_super,
      }
      ctx.body = {
        msg: '登录成功',
      }
    } else {
      ctx.throw(500, '密码不正确')
    }
  }

  async logout() {
    this.ctx.session.user = null
    this.ctx.body = {
      msg: '注销成功',
    }
  }

  async currentUser() {
    const user = await this.ctx.service.user.getCurrentUser()
    this.ctx.body = user
  }
}

module.exports = UserController
