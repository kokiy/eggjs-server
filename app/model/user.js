'use strict'

module.exports = app => {
  const { STRING, BOOLEAN, INTEGER } = app.Sequelize
  const user = app.model.define('user', {
    id: {
      type: INTEGER(8).ZEROFILL,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    username: {
      type: STRING,
      allowNull: false,
    },
    password: {
      type: STRING,
      allowNull: false,
    },
    mobile: {
      type: STRING(11),
      unique: true,
      allowNull: false,
    },
    email: STRING,
    status: {
      type: BOOLEAN,
      defaultValue: true,
    },
    is_super: {
      type: BOOLEAN,
      defaultValue: false,
    },
    avatar: STRING,
  })

  user.associate = () => {
    user.belongsTo(app.model.Role)
  }

  return user

}

