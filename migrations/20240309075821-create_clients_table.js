'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('CLIENTS', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      CLIENTCODE: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      CLIENTNAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CLIENTDETAILS: {
        type: DataTypes.STRING,
        allowNull: true
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
      tableName: 'CLIENTS',
      timestamps: false,
      hooks: {
        beforeCreate: (CLIENTS, options) => {
          // Manually set the CREATEDAT timestamp
          CLIENTS.CREATEDAT = new Date();
          CLIENTS.UPDATEDAT = new Date();
        },
        beforeUpdate: (CLIENTS, options) => {
          // Manually update the UPDATEDAT timestamp
          CLIENTS.UPDATEDAT = new Date();
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
