
'use strict'
module.exports = app => {
  const { STRING } = app.Sequelize
  const role = app.model.define('role', {
    name: {
      type: STRING,
      allowNull: false,
    },
    description: STRING,
  })
  role.associate = () => {
    role.hasMany(app.model.User)
    role.belongsToMany(
      app.model.Access,
      {
        through: app.model.RoleAccess,
      })
  }

  return role
}

