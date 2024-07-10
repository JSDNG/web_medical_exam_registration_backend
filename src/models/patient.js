"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Patient.belongsTo(models.Account, { foreignKey: "accountId" });
            Patient.hasMany(models.Appointment, { foreignKey: "patientId" });
            Patient.hasMany(models.MedicalRecord, { foreignKey: "patientId" });
            Patient.hasMany(models.Relative, { foreignKey: "patientId" });
        }
    }
    Patient.init(
        {
            fullName: DataTypes.STRING,
            dateOfBirth: DataTypes.DATE,
            gender: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.STRING,
            accountId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Patient",
        }
    );
    return Patient;
};
