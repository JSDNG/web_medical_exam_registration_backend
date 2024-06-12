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
            MedicalRecord.belongsTo(models.Doctor, { foreignKey: "doctorId" });
            MedicalRecord.belongsTo(models.Patient, { foreignKey: "patientId" });
            MedicalRecord.hasMany(models.Prescription, { foreignKey: "recordId" });
        }
    }
    MedicalRecord.init(
        {
            medicalHistory: DataTypes.STRING,
            reasonForExamination: DataTypes.STRING,
            diagnosis: DataTypes.STRING,
            treatmentPlan: DataTypes.STRING,
            dateCreated: DataTypes.DATE,
            patientId: DataTypes.INTEGER,
            doctorId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "MedicalRecord",
        }
    );
    return MedicalRecord;
};
