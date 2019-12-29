'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, BOOLEAN, DATE } = Sequelize

    await queryInterface.createTable('user', {
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
      role_id: {
        type: INTEGER,
        references: {
          model: {
            tableName: 'role',
          },
          key: 'id',
        },
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },
  down: async queryInterface => {
    await queryInterface.dropTable('user')
  },
}
