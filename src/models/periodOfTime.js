"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PeriodOfTime extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            PeriodOfTime.hasOne(models.Appointment, { foreignKey: "timeId" });
        }
    }
    PeriodOfTime.init(
        {
            time: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "PeriodOfTime",
        }
    );
    return PeriodOfTime;
};
