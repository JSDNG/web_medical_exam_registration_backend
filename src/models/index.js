"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const db = {};

// let sequelize;
// if (config.use_env_variable) {
//     sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//     sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    operatorsAliases: 0,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
    },
    define: {
        freezeTableName: config.define.freezeTableName,
    },
    logging: config.logging,
});
fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && file.indexOf(".test.js") === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
