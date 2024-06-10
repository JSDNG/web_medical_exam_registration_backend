const fs = require("fs");
require("dotenv").config();
module.exports = {
    development: {
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "123456",
        database: process.env.DB_NAME || "tttn",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || "3308",
        dialect: process.env.DB_DIALECT || "mysql",
        dialectOptions: {
            bigNumberStrings: true,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            freezeTableName: true,
        },
        logging: false,
    },
    test: {
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "123456",
        database: process.env.DB_NAME || "tttn",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || "3308",
        dialect: process.env.DB_DIALECT || "mysql",
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    production: {
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "123456",
        database: process.env.DB_NAME || "tttn",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || "3308",
        dialect: process.env.DB_DIALECT || "mysql",
        dialectOptions: {
            bigNumberStrings: true,
            // ssl: {
            //     ca: fs.readFileSync(__dirname + "/mysql-ca-main.crt"),
            // },
        },
    },
};
