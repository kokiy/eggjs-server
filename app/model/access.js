
'use strict'
module.exports = app => {
  const { STRING, ENUM, JSON } = app.Sequelize
  const access = app.model.define('access', {
    name: {
      type: STRING,
      allowNull: false,
    },
    type: ENUM('1', '2'), // 1表示模块 2表示操作
    key: {
      type: STRING,
      unique: true,
      allowNull: false,
    },
    requests: {
      type: JSON,
      comment: '请求配置json',
    },
    description: STRING,
  })
  access.associate = () => {
    access.hasMany(
      app.model.Access,
      {
        as: 'child',
        foreignKey: 'parent_id',
      }
    )
    access.belongsToMany(
      app.model.Role,
      {
        through: app.model.RoleAccess,
      })
  }

  return access
}

