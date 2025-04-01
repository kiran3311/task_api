'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('USERS', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      FULLNAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
      USERNAME: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      PASSWORD: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ROLE: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "user"
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
      tableName: 'USERS',
      hooks: {
        beforeCreate: (USERS, options) => {
          // Manually set the CREATEDAT timestamp
          USERS.CREATEDAT = new Date();
          USERS.UPDATEDAT = new Date();
        },
        beforeUpdate: (USERS, options) => {
          // Manually update the UPDATEDAT timestamp
          USERS.UPDATEDAT = new Date();
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
