'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('PRODUCTS', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      PRODUCTCODE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PRODUCTNAME: {
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
      timestamps: false,
      tableName: 'PRODUCTS',
      hooks: {
        beforeCreate: (PRODUCTS, options) => {
          // Manually set the CREATEDAT timestamp
          PRODUCTS.CREATEDAT = new Date();
          PRODUCTS.UPDATEDAT = new Date();
        },
        beforeUpdate: (PRODUCTS, options) => {
          // Manually update the UPDATEDAT timestamp
          PRODUCTS.UPDATEDAT = new Date();
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
