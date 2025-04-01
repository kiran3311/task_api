const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const ModuleHubModel = sequelize.define('MODULEHUB', {
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
    type: DataTypes.DATE,
  },
  UPDATEDAT: {
    allowNull: true,
    type: DataTypes.DATE,
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



module.exports = ModuleHubModel