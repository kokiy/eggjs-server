'use strict'

const Controller = require('egg').Controller

class CaptchaController extends Controller {
  async index() {
    const { text, data } = this.ctx.helper.generateCaptcha()
    this.ctx.session.captcha = text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = data
  }
}

module.exports = CaptchaController
