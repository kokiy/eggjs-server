'use strict'

const Controller = require('egg').Controller
const webpush = require('web-push')

class MessageController extends Controller {

  async subscribe() {
    const ctx = this.ctx
    this.app.subscription = ctx.request.body
    ctx.body = { status: true }
  }

  async push() {
    const ctx = this.ctx
    const data = ctx.request.body
    const res = await webpush.sendNotification(this.app.subscription, JSON.stringify(data), { proxy: 'http://127.0.0.1:1087' })
    ctx.body = res
  }

}

module.exports = MessageController
