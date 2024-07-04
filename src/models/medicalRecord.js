"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class MedicalRecord extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            MedicalRecord.belongsTo(models.MedicalStaff, { foreignKey: "doctorId" });
            MedicalRecord.belongsTo(models.Patient, { foreignKey: "patientId" });
            MedicalRecord.belongsTo(models.Relative, { foreignKey: "relativeId" });
            MedicalRecord.hasMany(models.Prescription, { foreignKey: "recordId" });
            MedicalRecord.hasMany(models.Invoice, { foreignKey: "recordId" });
            MedicalRecord.belongsTo(models.Appointment, { foreignKey: "appointmentId" });
            MedicalRecord.belongsTo(models.AllStatus, { foreignKey: "statusId" });
            MedicalRecord.belongsTo(models.Specialty, { foreignKey: "specialtyId" });
        }
    }
    MedicalRecord.init(
        {
            medicalHistory: DataTypes.STRING,
            reason: DataTypes.STRING,
            diagnosis: DataTypes.STRING,
            treatmentPlan: DataTypes.STRING,
            dateCreated: DataTypes.DATE,
            patientId: DataTypes.INTEGER,
            relativeId: DataTypes.INTEGER,
            doctorId: DataTypes.INTEGER,
            statusId: DataTypes.INTEGER,
            appointmentId: DataTypes.INTEGER,
            specialtyId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "MedicalRecord",
        }
    );
    return MedicalRecord;
};
