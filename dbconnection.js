const { Sequelize } = require('sequelize');
const oracledb = require('oracledb');
let sequelize;

//Local DB:
// username: taskmanagement,
// password: adroit11,
// database: orcl19c,
// host: 192.168.100.87,
// dialect: oracle,
// port: 1521
//production DB:
//192.168.100.27
//servicename :prim
//R&T db : taskmanagement_rta
//EDP db : taskmanagement
const dbName = 'taskmanagement'
const dbHostId = '192.168.100.27'
const serviceName = 'prim'


async function runDbConnection() {
    try {
        sequelize = new Sequelize(serviceName, dbName, 'adroit11', {
            host: dbHostId,
            dialect: "oracle",
            define: {
                timestamps: false, // ✅ Ensures no auto-generated timestamps
                underscored: false, // ✅ Ensures no auto-added snake_case columns
            },
            logging: console.log // ✅ Enables logging to track queries
        });
        await sequelize.authenticate();
        console.log('Connection has been established successfully to : ', dbHostId, " DB: ",dbName);
        //  await ProductModel.sync({ force: false, alter: true });
        // console.log('✅ Models synchronized.')
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


runDbConnection();

//192.168.100.87/orcl19c

// const dbConfig = {
//     user: dbName,
//     password: "adroit11",
//     connectString: `${dbHostId}/${serviceName}`
// };

// async function getConnection() {
//     try {
//         const connection = await oracledb.getConnection(dbConfig);
//         console.log("✅ Connected to Oracle DB successfully! using oracledb raw");
//         return connection;
//     } catch (error) {
//         console.error("❌ Unable to connect to Oracle DB using oracledb raw:", error);
//         throw error;
//     }
// }


module.exports = { sequelize,  };

