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
                treatmentPlan: {
                    type: Sequelize.STRING,
                },
                dateCreated: {
                    type: Sequelize.DATE,
                },
                patientId: {
                    type: Sequelize.INTEGER,
                },
                doctorId: {
                    type: Sequelize.INTEGER,
                },
                statusId: {
                    type: Sequelize.INTEGER,
                },
                appointmentId: {
                    type: Sequelize.INTEGER,
                },
                specialtyId: {
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
        await queryInterface.dropTable("MedicalRecord");
    },
};
