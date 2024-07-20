"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Medication extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Medication.belongsToMany(models.Prescription, {
                through: models.PrescriptionDetail,
                foreignKey: "medicationId",
            });
        }
    }
    Medication.init(
        {
            medicationName: DataTypes.STRING,
            description: DataTypes.STRING,
            price: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Medication",
        }
    );
    return Medication;
};
