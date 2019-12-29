'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, JSON } = Sequelize
    await queryInterface.createTable('access', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
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
      parent_id: {
        type: INTEGER,
        references: {
          model: {
            tableName: 'access',
          },
          key: 'id',
        },
      },
      description: STRING,
      created_at: DATE,
      updated_at: DATE,
    })
  },
  down: async queryInterface => {
    await queryInterface.dropTable('access')
  },
}
