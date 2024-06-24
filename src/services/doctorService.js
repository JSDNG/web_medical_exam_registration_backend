const db = require("../models");
// const checkUserId = async (id) => {
//     let userId = await db.User.findOne({
//         where: { id: id },
//     });

//     if (userId) {
//         return true;
//     }
//     return false;
// };
// const checkUsername = async (username) => {
//     let user = await db.User.findOne({
//         where: { username: username },
//     });

//     if (user) {
//         return true;
//     }
//     return false;
// };
const createSchedule = async (rawData) => {
    try {
        let data = await db.Schedule.bulkCreate(rawData);
        // let data = await db.PeriodOfTime.findAll({
        //     // where: { id: 1 },
        //     // attributes: ["id", "email", "password"],
        //     // include: [{ model: db.Role, attributes: ["roleName"] }],
        // });
        return {
            EC: 200,
            EM: "Schedule created successfully",
            DT: data,
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
const getAllSchedule = async () => {
    try {
        let data = await db.Schedule.findAll();
        return {
            EC: 200,
            EM: "Get the schedule list",
            DT: data,
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
const deleteSchedule = async (id) => {
    try {
        await db.Schedule.destroy({
            where: {
                id: id,
            },
        });
        return {
            EC: 201,
            EM: "Deleted",
            DT: "",
        };
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
module.exports = {
    createSchedule,
    getAllSchedule,
    deleteSchedule,
};
