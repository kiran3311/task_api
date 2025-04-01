'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('CLIENTPRODUCTMAPPING', {
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

      CLIENTID: {
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
      tableName: 'CLIENTPRODUCTMAPPING',
      hooks: {

        beforeCreate: (CLIENTPRODUCTMAPPING, options) => {
          // Manually set the CREATEDAT timestamp
          CLIENTPRODUCTMAPPING.CREATEDAT = new Date();
          CLIENTPRODUCTMAPPING.UPDATEDAT = new Date();
        },
        beforeUpdate: (CLIENTPRODUCTMAPPING, options) => {
          // Manually update the UPDATEDAT timestamp
          CLIENTPRODUCTMAPPING.UPDATEDAT = new Date();
        },
      },

    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
