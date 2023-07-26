require('dotenv').config();
const { Client, Pool } = require('pg');

const dbPool = new Pool({
    user: process.env.POSTGRESQL_USER,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.POSTGRESQL_DATABASE,
    password: process.env.POSTGRESQL_PASSWORD,
    port: process.env.POSTGRESQL_PORT
});
// let dbClient;
// (async function() {
//     const getDbClient = async ()=>{
//         return await dbPool.connect();
//     }
//     dbClient = await dbPool.connect();
// }())


module.exports = dbPool;