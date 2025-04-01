'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('MODULES', {
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
                type: Sequelize.DATE,
            },
            UPDATEDAT: {
                allowNull: true,
                type: Sequelize.DATE,
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
        })
    },

    async down(queryInterface, Sequelize) {
        return null;
    }
};
