/* eslint valid-jsdoc: "off" */

'use strict'
const _ = require('lodash')

const whiteRouterList = require('./white-router')


module.exports = appInfo => {

  const config = {
    security: {
      csrf: {
        enable: false,
      },
    },
    keys: appInfo.name + '_1571582766788_6866',
    session: {
      key: 'guid',
      maxAge: 24 * 3600 * 1000, // 1 天
      httpOnly: true,
      encrypt: true,
    },
    sequelize: {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      database: 'egg',
      username: 'root',
      password: '123456',
      define: {
        underscored: true,
        freezeTableName: true,
      },
      timezone: '+08:00', // 保存为本地时区
      dialectOptions: {
        dateStrings: true,
        typeCast(field, next) {
          // for reading from database
          if (field.type === 'DATETIME') {
            return field.string()
          }
          return next()
        },
      },

    },
    middleware: ['errorHandler', 'validate', 'auth'],
    auth: {
      ignore: ctx => {
        return _.find(whiteRouterList, ({ path, method }) => path === ctx.path && method === ctx.method)
      },
    },
  }


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
  }
}
