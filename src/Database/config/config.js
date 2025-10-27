require('dotenv').config({path: `config/env/.${process.env.NODE_ENV}.env`});


module.exports = {
    development: {
        username: process.env.MYSQLUSERNAME,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        dialect: process.env.MYSQLDIALECT,
    },
    production: {
        username: process.env.MYSQLUSERNAME,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        dialect: process.env.MYSQLDIALECT,
    },
};