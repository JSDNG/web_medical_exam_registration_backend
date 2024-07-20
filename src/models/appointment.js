"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Appointment.belongsTo(models.Schedule, { foreignKey: "scheduleId" });
            Appointment.belongsTo(models.MedicalStaff, { foreignKey: "staffId" });
            Appointment.belongsTo(models.Patient, { foreignKey: "patientId" });
            Appointment.hasOne(models.MedicalRecord, {
                foreignKey: "appointmentId",
                onDelete: "CASCADE",
                hooks: true,
            });
            Appointment.belongsTo(models.AllStatus, { foreignKey: "statusId" });
        }
    }
    Appointment.init(
        {
            appointmentNumber: DataTypes.INTEGER,
            statusId: DataTypes.INTEGER,
            scheduleId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            staffId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Appointment",
        }
    );
    return Appointment;
};
