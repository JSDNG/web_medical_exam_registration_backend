"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Relative extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Relative.belongsTo(models.Patient, { foreignKey: "patientId" });
            Relative.hasMany(models.MedicalRecord, { foreignKey: "relativeId" });
        }
    }
    Relative.init(
        {
            fullName: DataTypes.STRING,
            dateOfBirth: DataTypes.DATE,
            gender: DataTypes.STRING,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
            address: DataTypes.STRING,
            patientId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Relative",
        }
    );
    return Relative;
};
