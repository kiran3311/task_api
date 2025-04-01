'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('TASKDESCRIPTION', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      TASKTYPE: {
        type: DataTypes.ENUM('Development', 'Support'),
        allowNull: true
      },
      TASKDESCRIPTION: {
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
      tableName: 'TASKDESCRIPTION',
      hooks: {
        beforeCreate: (TASKDESCRIPTION, options) => {
          // Manually set the CREATEDAT timestamp
          TASKDESCRIPTION.CREATEDAT = new Date();
          TASKDESCRIPTION.UPDATEDAT = new Date();
        },
        beforeUpdate: (TASKDESCRIPTION, options) => {
          // Manually update the UPDATEDAT timestamp
          TASKDESCRIPTION.UPDATEDAT = new Date();
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
