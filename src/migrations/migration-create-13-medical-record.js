"use strict";

const { toDefaultValue } = require("sequelize/lib/utils");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "MedicalRecord",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                medicalHistory: {
                    type: Sequelize.STRING,
                },
                reason: {
                    type: Sequelize.STRING,
                },
                diagnosis: {
                    type: Sequelize.STRING,
                },
                dateCreated: {
                    type: Sequelize.DATE,
                },
                patientId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Patient",
                        key: "id",
                    },
                },
                relativeId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: "Relative",
                        key: "id",
                    },
                },
                doctorId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "MedicalStaff",
                        key: "id",
                    },
                },
                statusId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "AllStatus",
                        key: "id",
                    },
                },
                appointmentId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onDelete: "cascade",
                    references: {
                        model: "Appointment",
                        key: "id",
                    },
                },
                specialtyId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Specialty",
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
        await queryInterface.dropTable("MedicalRecord");
    },
};
