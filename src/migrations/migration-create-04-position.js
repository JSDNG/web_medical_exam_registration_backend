"use strict";

const { toDefaultValue } = require("sequelize/lib/utils");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Position",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                positionName: {
                    type: Sequelize.STRING,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                    onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            { charset: "utf8", collate: "utf8_general_ci" }
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Position");
    },
};
