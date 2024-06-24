"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class AllStatus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            AllStatus.hasOne(models.Appointment, { foreignKey: "statusId" });
            AllStatus.hasOne(models.MedicalRecord, { foreignKey: "statusId" });
        }
    }
    AllStatus.init(
        {
            statusName: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "AllStatus",
        }
    );
    return AllStatus;
};
