'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('TASKS', {
      ID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          unique: true,
          primaryKey: true,
          allowNull: false
      },
      TASKNAME: {
          type: DataTypes.STRING,
          allowNull: true
      },
  
      REMARKFORINNERHTML: {
          type: DataTypes.TEXT("long"),
          allowNull: true
      },
  
      REMARKFOREDITTING: {
          type: DataTypes.TEXT("long"),
          allowNull: true
      },
  
      PRIORITY: {
          type: DataTypes.STRING,
          allowNull: true
      },
      FLAG: {
          type: DataTypes.STRING,
          allowNull: true
      },
  
      ASSIGNSTARTDATE: {
          type: DataTypes.DATE,
          allowNull: true,
      },
  
      DUEDATE: {
          type: DataTypes.DATE,
          allowNull: true,
      },
  
      ACTUALSTARTDATE: {
          type: DataTypes.DATE,
          allowNull: true,
      },
  
      COMPLETIONDATE: {
          type: DataTypes.DATE,
          allowNull: true,
      },
      STATUS: {
          type: DataTypes.STRING,
          allowNull: true,
      },
  
      TIMETOCOMPLETETASK: {
          type: DataTypes.STRING,
          allowNull: true,
      },
  
      BILLINGTYPE: {
          type: DataTypes.STRING,
          allowNull: true,
      },
  
      APPROVALSTATUS: {
          type: DataTypes.STRING,
          allowNull: true,
          default: "N"
      },
      TASKTYPE: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      PERCENTAGE: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      CLIENTID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      PRODUCTID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      PROJECTID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
  
      PROJECTLEADUSERID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
  
      ASSIGNEEUSERID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
  
      TEAMLEADUSERID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
  
      TASKDESCRIPTIONID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      MODULEID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      CREATEDBY: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      UPDATEDBY: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      CREATEDAT: {
          allowNull: true,
          type: DataTypes.DATE,
      },
      UPDATEDAT: {
          allowNull: true,
          type: DataTypes.DATE,
      },
      ISDELETE: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
      }
  
  }, {
      timestamps: false,
      tableName: 'TASKS',
      hooks: {
        beforeCreate: (TASKS, options) => {
          // Manually set the CREATEDAT timestamp
          TASKS.CREATEDAT = new Date();
          TASKS.UPDATEDAT = new Date();
        },
        beforeUpdate: (TASKS, options) => {
          // Manually update the UPDATEDAT timestamp
          TASKS.UPDATEDAT = new Date();
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
