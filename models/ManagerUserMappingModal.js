const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const ManagerUserMappingModal = sequelize.define('MANAGERUSERMAPPING', {
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
    MANAGERID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    USERID: {
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
    timestamps: false,
    tableName: 'MANAGERUSERMAPPING',
    hooks: {
      
        beforeCreate: (MANAGERUSERMAPPING, options) => {
            // Manually set the CREATEDAT timestamp
            MANAGERUSERMAPPING.CREATEDAT = new Date();
            MANAGERUSERMAPPING.UPDATEDAT = new Date();
        },
        beforeUpdate: (MANAGERUSERMAPPING, options) => {
            // Manually update the UPDATEDAT timestamp
            MANAGERUSERMAPPING.UPDATEDAT = new Date();
        },
    },
});

module.exports = ManagerUserMappingModal