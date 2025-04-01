'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('MANAGERUSERMAPPING', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      PRODUCTID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MANAGERID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      USERID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CREATEDAT: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      UPDATEDAT: {
        allowNull: true,
        type: Sequelize.DATE,
      }

    }, {
      timestamps: false,
      tableName: 'MANAGERUSERMAPPING',
      hooks: {

        beforeCreate: (MANAGERUSERMAPPING, options) => {
          // Manually set the CREATEDAT timestamp
          MANAGERUSERMAPPING.CREATEDAT = new Date();
          MANAGERUSERMAPPING.UPDATEDAT = new Date();
        },
        beforeUpdate: (MANAGERUSERMAPPING, options) => {
          // Manually update the UPDATEDAT timestamp
          MANAGERUSERMAPPING.UPDATEDAT = new Date();
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
