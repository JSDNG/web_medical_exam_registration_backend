"use strict";

const { toDefaultValue } = require("sequelize/lib/utils");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "MedicalStaff",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                fullName: {
                    type: Sequelize.STRING,
                },
                image: {
                    type: Sequelize.BLOB,
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
                description: {
                    type: Sequelize.STRING,
                },
                address: {
                    type: Sequelize.STRING,
                },
                price: {
                    type: Sequelize.STRING,
                },
                accountId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Account",
                        key: "id",
                    },
                },
                positionId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: "Position",
                        key: "id",
                    },
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
        await queryInterface.dropTable("MedicalStaff");
    },
};
