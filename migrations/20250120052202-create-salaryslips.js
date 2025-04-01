'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('SALARYSLIPS', {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      STATEMENTDATE: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      EMPCODE: {
        type: DataTypes.STRING,
        allowNull: false
      },
      EPFUANNO: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ESICNO: {
        type: DataTypes.STRING,
        allowNull: true
      },
      GENDER: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DOB: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PAN: {
        type: DataTypes.STRING,
        allowNull: true
      },
      AADHAAR: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MEDICLAIMNO: {
        type: DataTypes.STRING,
        allowNull: true
      },
      EMPLOYEENAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DOJ: {
        type: DataTypes.STRING,
        allowNull: true
      },
      STATUS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DOE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TEAM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DESIGNATION: {
        type: DataTypes.STRING,
        allowNull: true
      },
      LEAVEOPBALANCE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      LEAVEADDITION: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PRESENTDAYS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      WOFF: {
        type: DataTypes.STRING,
        allowNull: true
      },
      LALEAVENTAKEN: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ABSENTDAYS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      HALFDAY: {
        type: DataTypes.STRING,
        allowNull: true
      },
      COMPOFF: {
        type: DataTypes.STRING,
        allowNull: true
      },
      WFH: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PAIDDAYS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      LEAVECF: {
        type: DataTypes.STRING,
        allowNull: true
      },
      BASICSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      HRASTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CONVSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MEDSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      EDUSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CCASTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      GROSSPMSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      BASIC: {
        type: DataTypes.STRING,
        allowNull: true
      },
      HRA: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CONV: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MED: {
        type: DataTypes.STRING,
        allowNull: true
      },
      EDU: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CCA: {
        type: DataTypes.STRING,
        allowNull: true
      },
      INCENTIVES: {
        type: DataTypes.STRING,
        allowNull: true
      },
      OTHERARREARS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TOTALCALCULATEDGROSSASPERPRESENDAYS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PT: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PF: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ESIC: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TDS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      LWF: {
        type: DataTypes.STRING,
        allowNull: true
      },
      OTHERDEDUCTION: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TOTALDEDUCTION: {
        type: DataTypes.STRING,
        allowNull: true
      },
      NETSALARY: {
        type: DataTypes.STRING,
        allowNull: true
      },
      WFHDEDUCTION: {
        type: DataTypes.STRING,
        allowNull: true
      },
      NETSALARYINHAND: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PAYMENTMODE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MONTH: {
        type: DataTypes.STRING,
        allowNull: true
      },
      GRATUITYPM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MEDICLAIMPM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      EMPLOYERPFPM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      EMPLOYERESIC: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CTCPM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CTCPA: {
        type: DataTypes.STRING,
        allowNull: true
      },
      BONUS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      GRATUITYPMSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MEDICLAIMPMSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      EMPLOYERPFPMSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      EMPLOYERESICSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TOTALSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CTCSTRUCTURE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CREATEDAT: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      UPDATEDAT: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    return null;
  }
};
