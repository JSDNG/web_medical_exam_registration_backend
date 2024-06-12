"use strict";

const { toDefaultValue } = require("sequelize/lib/utils");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Doctor",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                firstName: {
                    type: Sequelize.STRING,
                },
                lastName: {
                    type: Sequelize.STRING,
                },
                image: {
                    type: Sequelize.STRING,
                },
                dateOfBirth: {
                    type: Sequelize.DATE,
                },
                gender: {
                    type: Sequelize.STRING,
                },
                phone: {
                    type: Sequelize.STRING,
                },
                address: {
                    type: Sequelize.STRING,
                },
                dateCreated: {
                    type: Sequelize.STRING,
                },
                specialty: {
                    type: Sequelize.STRING,
                },
                groupName: {
                    type: Sequelize.STRING,
                },
                accountId: {
                    type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("Doctor");
    },
};
