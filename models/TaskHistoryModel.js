const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');
const ProductModel = require("../models/ProductModel")
const ProjectModel = require("./ProjectModel");
const ClientModel = require('./ClientModel');
const TaskdescriptionModel = require("./TaskdescriptionModel");
const UserModel = require('./UserModel');
const ModuleModel = require("./ModuleModel")
const ClientProjectMappingModel = require("./ClientProductMappingModel")
const TaskCommentModel = require("./TaskCommentModel")
const ManagerUserMappingModal = require("./ManagerUserMappingModal")

const TaskHistoryModel= sequelize.define('TASKSHISTORY', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    TASKID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    TASKNAME: {
        type: DataTypes.STRING,
        allowNull: true
    },

    REMARKFORINNERHTML: {
        type: DataTypes.TEXT("long"),
        allowNull: true
    },

    REMARKFOREDITTING: {
        type: DataTypes.TEXT("long"),
        allowNull: true
    },

    PRIORITY: {
        type: DataTypes.STRING,
        allowNull: true
    },
    FLAG: {
        type: DataTypes.STRING,
        allowNull: true
    },

    ASSIGNSTARTDATE: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    DUEDATE: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    ACTUALSTARTDATE: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    COMPLETIONDATE: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    STATUS: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    TIMETOCOMPLETETASK: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    BILLINGTYPE: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    APPROVALSTATUS: {
        type: DataTypes.STRING,
        allowNull: true,
        default: "N"
    },
    TASKTYPE: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    PERCENTAGE: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    CLIENTID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    PRODUCTID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    PROJECTID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    PROJECTLEADUSERID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    ASSIGNEEUSERID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    TEAMLEADUSERID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    TASKDESCRIPTIONID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    MODULEID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    CREATEDBY: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    UPDATEDBY: {
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
    tableName: 'TASKSHISTORY',
    hooks: {
        beforeCreate: (TASKSHISTORY, options) => {
            // Manually set the CREATEDAT timestamp
            TASKSHISTORY.CREATEDAT = new Date();
            TASKSHISTORY.UPDATEDAT = new Date();
        },
        beforeUpdate: (TASKSHISTORY, options) => {
            // Manually update the UPDATEDAT timestamp
            TASKSHISTORY.UPDATEDAT = new Date();
        },
    },
});


// ProductModel.hasMany(TaskHistoryModel, { foreignKey: 'PRODUCTID', as: "tasks" });
// TaskHistoryModel.belongsTo(ProductModel, {
//     foreignKey: 'PRODUCTID', as: 'product',
// });

// ProjectModel.hasMany(TaskHistoryModel, { foreignKey: 'PROJECTID', as: "tasks" });
// TaskHistoryModel.belongsTo(ProjectModel, { foreignKey: 'PROJECTID', as: 'project' });

// ClientModel.hasMany(TaskHistoryModel, { foreignKey: 'CLIENTID', as: "tasks" });
// TaskHistoryModel.belongsTo(ClientModel, { foreignKey: 'CLIENTID', as: "client" });

// TaskdescriptionModel.hasMany(TaskHistoryModel, { foreignKey: 'TASKDESCRIPTIONID', as: "tasks" });
// TaskHistoryModel.belongsTo(TaskdescriptionModel, { foreignKey: 'taskdescriptionid', as: "taskdescription" });

// UserModel.hasMany(TaskHistoryModel, { foreignKey: 'PROJECTLEADUSERID', as: "tasksprojectlead" });
// TaskHistoryModel.belongsTo(UserModel, { foreignKey: 'PROJECTLEADUSERID', as: "projectlead" });

// UserModel.hasMany(TaskHistoryModel, { foreignKey: 'TEAMLEADUSERID', as: "taskprojectlead" });
// TaskHistoryModel.belongsTo(UserModel, { foreignKey: 'TEAMLEADUSERID', as: "teamleaduser" });

// UserModel.hasMany(TaskHistoryModel, { foreignKey: 'ASSIGNEEUSERID', as: "tasksassineeuser" });
// TaskHistoryModel.belongsTo(UserModel, { foreignKey: 'ASSIGNEEUSERID', as: "assigneeuser" });


// ModuleModel.hasMany(TaskHistoryModel, { foreignKey: 'MODULEID', as: "tasks" });
// TaskHistoryModel.belongsTo(ModuleModel, { foreignKey: 'MODULEID', as: 'module' });


// TaskHistoryModel.hasMany(TaskCommentModel, { foreignKey: 'TASKID', as: "comments" });
// TaskCommentModel.belongsTo(TaskHistoryModel, { foreignKey: 'TASKID', as: 'task' });


module.exports = TaskHistoryModel