"use strict";

const { toDefaultValue } = require("sequelize/lib/utils");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Appointment",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                appointmentNumber: {
                    type: Sequelize.INTEGER,
                },
                statusId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "AllStatus",
                        key: "id",
                    },
                },
                scheduleId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Schedule",
                        key: "id",
                    },
                },
                patientId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Patient",
                        key: "id",
                    },
                },
                staffId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: "MedicalStaff",
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
        await queryInterface.dropTable("Appointment");
    },
};
