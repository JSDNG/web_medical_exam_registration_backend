"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Invoice.belongsTo(models.Doctor, { foreignKey: "doctorId" });
            Invoice.belongsTo(models.Prescription, { foreignKey: "prescriptionId" });
            Invoice.belongsTo(models.Patient, { foreignKey: "patientId" });
        }
    }
    Invoice.init(
        {
            totalPrice: DataTypes.STRING,
            dateCreated: DataTypes.DATE,
            status: DataTypes.STRING,
            doctorId: DataTypes.INTEGER,
            prescriptionId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Invoice",
        }
    );
    return Invoice;
};
