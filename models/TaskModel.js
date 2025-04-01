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
const ModelHubModel = require("./ModuleHubModel");

const TaskModel = sequelize.define('TASKS', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
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
    },
    ISDELETE: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }

}, {
    timestamps: false,
    tableName: 'TASKS',
    hooks: {
        beforeCreate: (TASKS, options) => {
            // Manually set the CREATEDAT timestamp
            TASKS.CREATEDAT = new Date();
            TASKS.UPDATEDAT = new Date();
        },
        beforeUpdate: (TASKS, options) => {
            // Manually update the UPDATEDAT timestamp
            TASKS.UPDATEDAT = new Date();
        },
    },
});

ProductModel.hasMany(ProjectModel, { foreignKey: 'PRODUCTID', as: "projects" });
ProjectModel.belongsTo(ProductModel, { foreignKey: 'PRODUCTID', as: 'product' });

ProductModel.hasMany(TaskModel, { foreignKey: 'PRODUCTID', as: "tasks" });
TaskModel.belongsTo(ProductModel, {
    foreignKey: 'PRODUCTID', as: 'product',
});

ProjectModel.hasMany(TaskModel, { foreignKey: 'PROJECTID', as: "tasks" });
TaskModel.belongsTo(ProjectModel, { foreignKey: 'PROJECTID', as: 'project' });

ClientModel.hasMany(TaskModel, { foreignKey: 'CLIENTID', as: "tasks" });
TaskModel.belongsTo(ClientModel, { foreignKey: 'CLIENTID', as: "client" });

TaskdescriptionModel.hasMany(TaskModel, { foreignKey: 'TASKDESCRIPTIONID', as: "tasks" });
TaskModel.belongsTo(TaskdescriptionModel, { foreignKey: 'TASKDESCRIPTIONID', as: "taskdescription" });

UserModel.hasMany(TaskModel, { foreignKey: 'PROJECTLEADUSERID', as: "tasksprojectlead" });
TaskModel.belongsTo(UserModel, { foreignKey: 'PROJECTLEADUSERID', as: "projectlead" });

UserModel.hasMany(TaskModel, { foreignKey: 'TEAMLEADUSERID', as: "taskprojectlead" });
TaskModel.belongsTo(UserModel, { foreignKey: 'TEAMLEADUSERID', as: "teamleaduser" });

UserModel.hasMany(TaskModel, { foreignKey: 'ASSIGNEEUSERID', as: "tasksassineeuser" });
TaskModel.belongsTo(UserModel, { foreignKey: 'ASSIGNEEUSERID', as: "assigneeuser" });



ProjectModel.hasMany(ModuleModel, { foreignKey: 'PROJECTID', as: "modules" });
ModuleModel.belongsTo(ProjectModel, { foreignKey: 'PROJECTID', as: 'project' });

ModuleModel.hasMany(TaskModel, { foreignKey: 'MODULEID', as: "tasks" });
TaskModel.belongsTo(ModuleModel, { foreignKey: 'MODULEID', as: 'module' });


ClientModel.hasMany(ClientProjectMappingModel, { foreignKey: 'CLIENTID', as: "clientproductmappings" });
ClientProjectMappingModel.belongsTo(ClientModel, { foreignKey: 'CLIENTID', as: "client" });

ProductModel.hasMany(ClientProjectMappingModel, { foreignKey: 'PRODUCTID', as: "clientproductmappings" });
ClientProjectMappingModel.belongsTo(ProductModel, { foreignKey: 'PRODUCTID', as: 'product' });


TaskModel.hasMany(TaskCommentModel, { foreignKey: 'TASKID', as: "comments" });
TaskCommentModel.belongsTo(TaskModel, { foreignKey: 'TASKID', as: 'task' });

UserModel.hasMany(TaskCommentModel, { foreignKey: 'USERIDCOMMENTED', as: "taskcomments" });
TaskCommentModel.belongsTo(UserModel, { foreignKey: 'USERIDCOMMENTED', as: "user" });

ModelHubModel.hasMany(ProductModel, { foreignKey: 'PRODUCTID', as: "product" });
ProductModel.belongsTo(ModelHubModel, { foreignKey: 'PRODUCTID', as: 'modulehub' });

ModelHubModel.hasMany(ModuleModel, { foreignKey: 'MODULEHUBID', as: "module" });
ModuleModel.belongsTo(ModelHubModel, { foreignKey: 'MODULEHUBID', as: 'modulehub' });

////////////
// 

UserModel.hasMany(ManagerUserMappingModal, { foreignKey: 'MANAGERID', as: "managermapping" });
ManagerUserMappingModal.belongsTo(UserModel, { foreignKey: 'MANAGERID', as: 'manager' });

UserModel.hasMany(ManagerUserMappingModal, { foreignKey: 'USERID', as: "usermapping" });
ManagerUserMappingModal.belongsTo(UserModel, { foreignKey: 'USERID', as: 'user' })


UserModel.belongsToMany(UserModel, {
    through: ManagerUserMappingModal,
    foreignKey: "MANAGERID",
    otherKey: "USERID",
    as: "reporteelist"
})

UserModel.belongsToMany(UserModel, {
    through: ManagerUserMappingModal,
    foreignKey: "USERID",
    otherKey: "MANAGERID",
    as: "managerlist"
})




ProductModel.hasMany(ManagerUserMappingModal, { foreignKey: 'PRODUCTID', as: "managerteammapping" });
ManagerUserMappingModal.belongsTo(ProductModel, { foreignKey: 'PRODUCTID', as: 'product' });

//////////////////



// UserModel.hasMany(ManagerUserMappingModal, { foreignKey: 'MANAGERID', as: 'managermapping' });
// ManagerUserMappingModal.belongsTo(UserModel, { foreignKey: 'MANAGERID', as: 'manager' });

// UserModel.hasMany(ManagerUserMappingModal, { foreignKey: 'USERID', as: 'usermapping' });
// ManagerUserMappingModal.belongsTo(UserModel, { foreignKey: 'USERID', as: 'user' });

// Define the many-to-many self-relationship for user

// UserModel.belongsToMany(UserModel, {
//     through: ManagerUserMappingModal,
//     foreignKey: 'MANAGERID',
//     otherKey: 'USERID',
//     as: 'reporteelist'
// });

// UserModel.belongsToMany(UserModel, {
//     through: ManagerUserMappingModal,
//     foreignKey: 'USERID',
//     otherKey: 'MANAGERID',
//     as: 'managerlist'
// });

module.exports = TaskModel