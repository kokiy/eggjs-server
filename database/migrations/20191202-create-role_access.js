'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DATE, INTEGER } = Sequelize

    await queryInterface.createTable('role_access', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      role_id: {
        type: INTEGER,
        references: {
          model: {
            tableName: 'role',
          },
          key: 'id',
        },
        allowNull: false,
      },
      access_id: {
        type: INTEGER,
        references: {
          model: {
            tableName: 'access',
          },
          key: 'id',
        },
        allowNull: false,
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },
  down: async queryInterface => {
    await queryInterface.dropTable('role_access')
  },
}
