const db = require("../models");
const _ = require("lodash");
const { reduce } = require("lodash");
const { Op } = require("sequelize");
const checkUserId = async (id) => {
    let userId = await db.MedicalStaff.findOne({
        where: { id: id },
    });
    if (userId) {
        return true;
    }
    return false;
};
// const checkUsername = async (username) => {
//     let user = await db.MedicalStaff.findOne({
//         where: { fullName: username },
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
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Schedule.findAll({
            where: { doctorId: id },
            attributes: ["id", "price", "date", "doctorId", "timeId"],
            raw: true,
            nest: true,
            order: [["date", "ASC"]],
        });

        // Kiểm tra nếu data không có giá trị thì trả về mảng rỗng
        if (!data || data.length === 0) {
            return {
                EC: 0,
                EM: "No schedules found",
                DT: [],
            };
        }

        // Lấy tất cả các timeId cần thiết trong một lần truy vấn
        const timeIds = data.map((schedule) => schedule.timeId);
        const times = await db.PeriodOfTime.findAll({
            where: { id: timeIds },
            attributes: ["id", "time"],
            raw: true,
        });

        // Tạo một map từ timeId đến time để dễ dàng tra cứu
        const timeMap = times.reduce((acc, time) => {
            acc[time.id] = time.time;
            return acc;
        }, {});
        //console.log(timeMap);
        // Thay thế timeId bằng thời gian tương ứng
        data.forEach((schedule) => {
            schedule.timeId = { time: timeMap[schedule.timeId] };
        });
        //console.log(data);
        // Nhóm các đối tượng theo ngày
        const groupedData = data.reduce((acc, schedule) => {
            const date = schedule.date.toISOString().split("T")[0]; // Lấy ngày (không lấy giờ)
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(schedule);
            return acc;
        }, {});

        // Chuyển đổi định dạng để trả về
        const result = Object.keys(groupedData).map((date) => ({
            date,
            schedules: groupedData[date],
        }));

        // Sắp xếp thời gian của lịch trình theo thứ tự tăng dần
        result.forEach((item) => {
            item.schedules.sort((a, b) => {
                // Trích xuất thời gian bắt đầu từ chuỗi thời gian
                const timeA = a.timeId.time.split(" - ")[0];
                const timeB = b.timeId.time.split(" - ")[0];

                // Chuyển đổi thời gian sang dạng số để so sánh
                const [hoursA, minutesA] = timeA.split(":").map(Number);
                const [hoursB, minutesB] = timeB.split(":").map(Number);

                return hoursA - hoursB || minutesA - minutesB;
            });
        });

        return {
            EC: 0,
            EM: "Get the schedule list",
            DT: result,
        };
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Something went wrong in service...",
            DT: "",
        };
    }
};

const deleteSchedule = async (rawData) => {
    try {
        if (rawData && rawData.length > 0) {
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
module.exports = {
    createSchedule,
    getAllSchedule,
    deleteSchedule,
};
