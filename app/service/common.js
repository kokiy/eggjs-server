'use strict'

const Service = require('egg').Service

class CommonService extends Service {

  async findOneByQuery(model, data) {
    const res = await model.findOne({
      where: data,
      raw: true,
    })
    return res
  }
}


module.exports = CommonService
