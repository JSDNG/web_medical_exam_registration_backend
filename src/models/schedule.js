"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Schedule.hasOne(models.Appointment, { foreignKey: "scheduleId" });
            Schedule.belongsTo(models.MedicalStaff, { foreignKey: "doctorId" });
            Schedule.belongsTo(models.PeriodOfTime, { foreignKey: "timeId" });
        }
    }
    Schedule.init(
        {
            price: DataTypes.STRING,
            date: DataTypes.DATE,
            doctorId: DataTypes.INTEGER,
            timeId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Schedule",
        }
    );
    return Schedule;
};
