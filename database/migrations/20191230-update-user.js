'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize
    return queryInterface.addColumn('user', 'avatar', {
      type: STRING,
    })
  },
}
