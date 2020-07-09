const dotenv = require('dotenv');

dotenv.config();

const {
    PORT,
    SQL_USER,
    SQL_PASSWORD,
    SQL_DATABASE,
    SQL_SERVER,
    SQL_PORT
} = process.env;

const dbconfig = {
    server: SQL_SERVER,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    port: SQL_PORT,
    options: {
        encrypt: true
    }
}

module.exports = {
    port: PORT,
    dbconfig
}