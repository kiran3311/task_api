const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const ClientProductMappingModel = sequelize.define('CLIENTPRODUCTMAPPING', {
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
        type: DataTypes.DATE,
    },
    UPDATEDAT: {
        allowNull: true,
        type: DataTypes.DATE,
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

});

module.exports = ClientProductMappingModel