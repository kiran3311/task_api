const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const ModuleModel = sequelize.define('MODULES', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    MODULENAME: {
        type: DataTypes.STRING,
        allowNull: true
    },

    MODULEDESCRIPTION: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PRODUCTID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    PROJECTID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    WEIGHTAGE: {
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
    },
    MODULEHUBID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }

}, {
    timestamps: false,
    tableName: 'MODULES',
    hooks: {

        beforeCreate: (MODULES, options) => {
            // Manually set the CREATEDAT timestamp
            MODULES.CREATEDAT = new Date();
            MODULES.UPDATEDAT = new Date();
        },
        beforeUpdate: (MODULES, options) => {
            // Manually update the UPDATEDAT timestamp
            MODULES.UPDATEDAT = new Date();
        },
    },
});

module.exports = ModuleModel