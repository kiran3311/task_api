'use strict';
/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MODULEHUB', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      HUBCODE
        : {
        type: DataTypes.STRING,
        allowNull: true
      },

      MODULEHUBNAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
      HUBDETAILS: {
        type: DataTypes.STRING,
        allowNull: true
      },

      PRODUCTID: {
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
      tableName: 'MODULEHUB',
      timestamps: false,
      hooks: {
        beforeCreate: (MODULEHUB, options) => {
          // Manually set the CREATEDAT timestamp
          MODULEHUB.CREATEDAT = new Date();
          MODULEHUB.UPDATEDAT = new Date();
        },
        beforeUpdate: (MODULEHUB, options) => {
          // Manually update the UPDATEDAT timestamp
          MODULEHUB.UPDATEDAT = new Date();
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    return null;
  }
};