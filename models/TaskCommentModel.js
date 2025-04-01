const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const TaskCommentModel = sequelize.define('TASKCOMMENTS', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    COMMENT: {
        type: DataTypes.TEXT("long"),
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
        type: DataTypes.DATE,
    },
    UPDATEDAT: {
        allowNull: true,
        type: DataTypes.DATE,
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
});


module.exports = TaskCommentModel