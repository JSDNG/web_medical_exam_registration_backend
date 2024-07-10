"use strict";

const { toDefaultValue } = require("sequelize/lib/utils");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Invoice",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                totalPrice: {
                    type: Sequelize.STRING,
                },
                dateCreated: {
                    type: Sequelize.DATE,
                },
                doctorId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "MedicalStaff",
                        key: "id",
                    },
                },
                recordId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "MedicalRecord",
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
        await queryInterface.dropTable("Invoice");
    },
};
