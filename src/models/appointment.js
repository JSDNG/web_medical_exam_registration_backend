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
            Appointment.belongsTo(models.MedicalStaff, { foreignKey: "doctorId", as: "doctorData" });
            Appointment.belongsTo(models.MedicalStaff, { foreignKey: "staffId", as: "staffData" });
            Appointment.belongsTo(models.Patient, { foreignKey: "patientId" });
            Appointment.hasMany(models.MedicalRecord, { foreignKey: "appointmentId" });
            Appointment.belongsTo(models.PeriodOfTime, { foreignKey: "timeId" });
            Appointment.belongsTo(models.AllStatus, { foreignKey: "statusId" });
        }
    }
    Appointment.init(
        {
            queueNumber: DataTypes.INTEGER,
            date: DataTypes.DATE,
            price: DataTypes.STRING,
            timeId: DataTypes.INTEGER,
            statusId: DataTypes.INTEGER,
            doctorId: DataTypes.INTEGER,
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
