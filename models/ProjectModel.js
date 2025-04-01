const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const ProjectModel = sequelize.define('PROJECTS', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    PROJECTCODE: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PROJECTCATEGORY: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PROJECTNAME: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PRODUCTID: {
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
    tableName: 'PROJECTS',
    hooks: {
        beforeCreate: (PROJECTS, options) => {
            // Manually set the CREATEDAT timestamp
            PROJECTS.CREATEDAT = new Date();
            PROJECTS.UPDATEDAT = new Date();
        },
        beforeUpdate: (PROJECTS, options) => {
            // Manually update the UPDATEDAT timestamp
            PROJECTS.UPDATEDAT = new Date();
        },
    },
});


// BaseDetailsModel.hasOne(KycDetailsModel, { foreignKey: 'baseDetailsId' });
// KycDetailsModel.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });
// BaseDetailsModel.hasOne(ResidentAddressModel, { foreignKey: 'baseDetailsId' });
// ResidentAddressModel.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });
// BaseDetailsModel.hasOne(ResidentDetailsInLocalLanguageModal, { foreignKey: 'baseDetailsId' });
// ResidentDetailsInLocalLanguageModal.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });

module.exports = ProjectModel