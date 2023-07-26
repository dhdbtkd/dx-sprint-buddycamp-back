const { Client } = require('pg');

const dbClient = new Client({
    user: process.env.POSTGRESQL_USER,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.POSTGRESQL_DATABASE,
    password: process.env.POSTGRESQL_PASSWORD,
    port: process.env.POSTGRESQL_PORT
});
dbClient.connect();

const UsersController = {
    getUserInfoByNm: async (name) => {
        let result;
        try {
            result = await dbClient.query(`SELECT * FROM public."user" WHERE name='${name}';`);
            return result.rows[0];
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = UsersController;