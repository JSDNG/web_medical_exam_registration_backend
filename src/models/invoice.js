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
            Invoice.belongsTo(models.MedicalStaff, { foreignKey: "doctorId" });
            Invoice.belongsTo(models.MedicalRecord, { foreignKey: "recordId" });
        }
    }
    Invoice.init(
        {
            totalPrice: DataTypes.STRING,
            dateCreated: DataTypes.DATE,
            doctorId: DataTypes.INTEGER,
            recordId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Invoice",
        }
    );
    return Invoice;
};
