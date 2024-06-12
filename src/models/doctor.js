"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Doctor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doctor.belongsTo(models.Account, { foreignKey: "accountId" });
            Doctor.hasMany(models.Appointment, { foreignKey: "doctorId" });
            Doctor.hasMany(models.MedicalRecord, { foreignKey: "doctorId" });
            Doctor.hasMany(models.Prescription, { foreignKey: "doctorId" });
            Doctor.hasMany(models.Invoice, { foreignKey: "doctorId" });
        }
    }
    Doctor.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            image: DataTypes.STRING,
            dateOfBirth: DataTypes.DATE,
            gender: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.STRING,
            dateCreated: DataTypes.DATE,
            specialty: DataTypes.STRING,
            groupName: DataTypes.STRING,
            accountId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Doctor",
        }
    );
    return Doctor;
};
