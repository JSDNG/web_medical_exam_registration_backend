"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Account.belongsTo(models.Role, { foreignKey: "roleId" });
            Account.hasOne(models.MedicalStaff, { foreignKey: "accountId" });
            Account.hasOne(models.Patient, { foreignKey: "accountId" });
        }
    }
    Account.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            accountType: DataTypes.STRING,
            authGoogleId: DataTypes.STRING,
            authType: DataTypes.STRING,
            refreshToken: DataTypes.STRING,
            roleId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Account",
        }
    );
    return Account;
};
