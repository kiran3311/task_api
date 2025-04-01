'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('TASKCOMMENTS', {
            ID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                unique: true,
                primaryKey: true,
                allowNull: false
            },
            COMMENT: {
                type: DataTypes.STRING,
                allowNull: true
            },

            TASKID: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            USERIDCOMMENTED: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            STARTDATE: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            ENDDATE: {
                type: DataTypes.DATE,
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
            tableName: 'TASKCOMMENTS',
            hooks: {
                beforeCreate: (TASKCOMMENTS, options) => {
                    // Manually set the CREATEDAT timestamp
                    TASKCOMMENTS.CREATEDAT = new Date();
                    TASKCOMMENTS.UPDATEDAT = new Date();
                },
                beforeUpdate: (TASKCOMMENTS, options) => {
                    // Manually update the UPDATEDAT timestamp
                    TASKCOMMENTS.UPDATEDAT = new Date();
                },
            },
        })
    },

    async down(queryInterface, Sequelize) {
        return null;
    }
};
