"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class MedicalStaff extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            MedicalStaff.belongsTo(models.Account, { foreignKey: "accountId" });
            MedicalStaff.belongsTo(models.Position, { foreignKey: "positionId" });
            MedicalStaff.hasMany(models.Schedule, { foreignKey: "doctorId" });
            MedicalStaff.hasMany(models.Appointment, { foreignKey: "staffId" });
            MedicalStaff.hasMany(models.MedicalRecord, { foreignKey: "doctorId" });
            MedicalStaff.hasMany(models.Invoice, { foreignKey: "doctorId" });
            MedicalStaff.belongsToMany(models.Specialty, {
                through: models.DoctorSpecialty,
                foreignKey: "doctorId",
            });
            MedicalStaff.hasMany(models.Prescription, { foreignKey: "doctorId" });
        }
    }
    MedicalStaff.init(
        {
            fullName: DataTypes.STRING,
            image: DataTypes.BLOB,
            gender: DataTypes.STRING,
            phone: DataTypes.STRING,
            description: DataTypes.STRING,
            price: DataTypes.STRING,
            accountId: DataTypes.INTEGER,
            positionId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "MedicalStaff",
        }
    );
    return MedicalStaff;
};
