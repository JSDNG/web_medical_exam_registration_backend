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
            Appointment.belongsTo(models.Doctor, { foreignKey: "doctorId" });
            Appointment.belongsTo(models.Patient, { foreignKey: "patientId" });
            Appointment.hasOne(models.QQueueNumber, { foreignKey: "appointmentId" });
        }
    }
    Appointment.init(
        {
            appointmentDateTime: DataTypes.STRING,
            status: DataTypes.STRING,
            patientId: DataTypes.INTEGER,
            doctorId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Appointment",
        }
    );
    return Appointment;
};
