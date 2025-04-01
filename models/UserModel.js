const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const UserModel = sequelize.define('USERS', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    FULLNAME: {
        type: DataTypes.STRING,
        allowNull: true
    },
    USERNAME: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    PASSWORD: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ROLE: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "user"
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
    hooks: {
        beforeCreate: (USERS, options) => {
            // Manually set the CREATEDAT timestamp
            USERS.CREATEDAT = new Date();
            USERS.UPDATEDAT = new Date();
        },
        beforeUpdate: (USERS, options) => {
            // Manually update the UPDATEDAT timestamp
            USERS.UPDATEDAT = new Date();
        },
    },
    tableName: 'USERS'
});

// UserModel.hasMany(ResidentAddressModel);
// BaseDetailsModel.hasOne(KycDetailsModel, { foreignKey: 'baseDetailsId' });
// KycDetailsModel.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });
// BaseDetailsModel.hasOne(ResidentAddressModel, { foreignKey: 'baseDetailsId' });
// ResidentAddressModel.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });
// BaseDetailsModel.hasOne(ResidentDetailsInLocalLanguageModal, { foreignKey: 'baseDetailsId' });
// ResidentDetailsInLocalLanguageModal.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });

module.exports = UserModel