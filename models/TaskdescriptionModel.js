const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const TaskdescriptionModel = sequelize.define('TASKDESCRIPTION', {
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
        type: DataTypes.DATE,
    },
    UPDATEDAT: {
        allowNull: true,
        type: DataTypes.DATE,
    }
}, {
    timestamps:false,
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
});

module.exports = TaskdescriptionModel