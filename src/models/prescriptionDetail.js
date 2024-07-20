"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PrescriptionDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    PrescriptionDetail.init(
        {
            instruction: DataTypes.STRING,
            quantity: DataTypes.INTEGER,
            medicationId: DataTypes.INTEGER,
            prescriptionId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "PrescriptionDetail",
        }
    );
    return PrescriptionDetail;
};
