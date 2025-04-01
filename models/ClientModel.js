const { DataTypes } = require('sequelize');
const {sequelize} = require('../dbconnection');

const ClientModel = sequelize.define('CLIENTS', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    CLIENTCODE
        : {
        type: DataTypes.STRING,
        allowNull: true
    },

    CLIENTNAME: {
        type: DataTypes.STRING,
        allowNull: true
    },
    CLIENTDETAILS: {
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
    tableName: 'CLIENTS',
    timestamps: false,
    hooks: {
        beforeCreate: (CLIENTS, options) => {
            // Manually set the CREATEDAT timestamp
            CLIENTS.CREATEDAT = new Date();
            CLIENTS.UPDATEDAT = new Date();
        },
        beforeUpdate: (CLIENTS, options) => {
            // Manually update the UPDATEDAT timestamp
            CLIENTS.UPDATEDAT = new Date();
        },
    },
});


// BaseDetailsModel.hasOne(KycDetailsModel, { foreignKey: 'baseDetailsId' });
// KycDetailsModel.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });
// BaseDetailsModel.hasOne(ResidentAddressModel, { foreignKey: 'baseDetailsId' });
// ResidentAddressModel.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });
// BaseDetailsModel.hasOne(ResidentDetailsInLocalLanguageModal, { foreignKey: 'baseDetailsId' });
// ResidentDetailsInLocalLanguageModal.belongsTo(BaseDetailsModel, { foreignKey: 'baseDetailsId' });

module.exports = ClientModel