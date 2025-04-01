'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('MODULES', 'MODULEHUBID', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return;
  }
};
