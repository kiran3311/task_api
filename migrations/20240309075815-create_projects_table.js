'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('PROJECTS', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      PROJECTCODE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PROJECTCATEGORY: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PROJECTNAME: {
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
      timestamps: false,
      tableName: 'PROJECTS',
      hooks: {
        beforeCreate: (PROJECTS, options) => {
          // Manually set the CREATEDAT timestamp
          PROJECTS.CREATEDAT = new Date();
          PROJECTS.UPDATEDAT = new Date();
        },
        beforeUpdate: (PROJECTS, options) => {
          // Manually update the UPDATEDAT timestamp
          PROJECTS.UPDATEDAT = new Date();
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
