const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const ProductModel = sequelize.define('PRODUCTS', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    PRODUCTCODE: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PRODUCTNAME: {
        type: DataTypes.STRING,
        allowNull: true
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
    tableName: 'PRODUCTS',
    underscored: false ,
    hooks: {
        beforeCreate: (PRODUCTS, options) => {
            // Manually set the CREATEDAT timestamp
            PRODUCTS.CREATEDAT = new Date();
            PRODUCTS.UPDATEDAT = new Date();
        },
        beforeUpdate: (PRODUCTS, options) => {
            // Manually update the UPDATEDAT timestamp
            PRODUCTS.UPDATEDAT = new Date();
        },
    },
});

module.exports = ProductModel