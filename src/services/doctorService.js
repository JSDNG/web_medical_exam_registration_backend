const db = require("../models");
const _ = require("lodash");
const { Op } = require("sequelize");
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
        // Lấy thông tin lịch hiện tại từ cơ sở dữ liệu
        let dataOld = await db.Schedule.findAll({
            where: { doctorId: rawData[0].doctorId, date: rawData[0].date },
            attributes: ["price", "date", "doctorId", "timeId"],
            raw: true,
        });

        // Chuyển đổi date của các lịch hiện tại sang timestamp
        const convertDateToTimestamp = (item) => {
            item.date = new Date(item.date).getTime();
            return item;
        };

        if (dataOld && dataOld.length > 0) {
            dataOld = dataOld.map(convertDateToTimestamp);
        }

        // So sánh và tạo danh sách các lịch cần tạo mới
        const toCreate = _.differenceWith(rawData, dataOld, (a, b) => {
            return a.timeId === b.timeId && new Date(a.date).getTime() === b.date;
        });

        // Tạo mới các lịch cần tạo
        if (toCreate.length > 0) {
            await db.Schedule.bulkCreate(toCreate);
        }
        return {
            EC: 0,
            EM: "Schedule created successfully",
            DT: "",
        };
    } catch (err) {
        console.error(err);
        return {
            EC: -1,
            EM: "Something wrongs in service...",
            DT: "",
        };
    }
};
const getAllSchedule = async (id) => {
    try {
        let data = await db.Schedule.findAll({
            where: { doctorId: id },
            attributes: ["id", "price", "date", "doctorId", "timeId"],
        });
        if (!data.length > 0) {
            return {
                EC: 0,
                EM: "Get All Study Sets",
                DT: "",
            };
        }
        for (let j = 0; j < data.length; j++) {
            const result = data[j];
            let time = await db.PeriodOfTime.findByPk(result.timeId, { attributes: ["time"] });
            result.timeId = time.get({ plain: true });
        }
        //console.log(data);
        return {
            EC: 0,
            EM: "Get the schedule list",
            DT: data,
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
const deleteSchedule = async (rawData) => {
    try {
        if (rawData) {
            await db.Schedule.destroy({
                where: {
                    id: {
                        [Op.in]: rawData,
                    },
                },
            });
            return {
                EC: 0,
                EM: "Deleted",
                DT: "",
            };
        }
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
const getAllTime = async () => {
    try {
        let results = await db.PeriodOfTime.findAll({ attributes: ["id", "time"] });
        let data = results && results.length > 0 ? results.map((result) => result.get({ plain: true })) : [];
        console.log(data);
        return {
            EC: 0,
            EM: "Get the time list",
            DT: data,
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
    getAllTime,
};
