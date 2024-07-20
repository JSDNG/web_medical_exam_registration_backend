"use strict";

const { toDefaultValue } = require("sequelize/lib/utils");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "PrescriptionDetail",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                instruction: {
                    type: Sequelize.STRING,
                },
                quantity: {
                    type: Sequelize.INTEGER,
                },
                medicationId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Medication",
                        key: "id",
                    },
                },
                prescriptionId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Prescription",
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
        await queryInterface.dropTable("PrescriptionDetail");
    },
};
