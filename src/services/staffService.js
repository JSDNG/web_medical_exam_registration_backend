const db = require("../models");
const _ = require("lodash");
const { reduce } = require("lodash");
const { Op } = require("sequelize");

const updateAppointment = async (rawData) => {
    try {
        await db.Appointment.update(
            {
                statusId: rawData.statusId,
                staffId: rawData.statusId,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "Appointment updated successfully",
            DT: "",
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};

module.exports = {
    updateAppointment,
};
