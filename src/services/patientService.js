const db = require("../models");
const _ = require("lodash");
const { reduce } = require("lodash");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const { getAllSchedule } = require("./doctorService");
const checkUser = async (id) => {
    let userId = await db.Patient.findOne({
        where: { id: id },
    });
    if (userId) {
        return true;
    }
    return false;
};
const checkEmailFromRelative = async (email) => {
    let relative = await db.Relative.findOne({
        where: { email: email },
    });
    if (relative) {
        return relative.id;
    }
    return false;
};
const createAppointment = async (rawData) => {
    try {
        const maxAppointment = await db.Appointment.findOne({
            attributes: [[Sequelize.fn("max", Sequelize.col("appointmentNumber")), "maxAppointmentNumber"]],
            raw: true,
        });
        const maxAppointmentNumber = maxAppointment ? maxAppointment.maxAppointmentNumber || 0 : 0;

        const nextAppointmentNumber = maxAppointmentNumber + 1;

        const data = await db.Appointment.create({
            appointmentNumber: nextAppointmentNumber,
            statusId: rawData.statusId,
            scheduleId: rawData.scheduleId,
            patientId: rawData.patientId,
        });

        return {
            EC: 0,
            EM: "Appointment created successfully",
            DT: data,
        };
    } catch (err) {
        console.error("Error:", err);
        return {
            EC: -1,
            EM: "Something went wrong in service...",
            DT: "",
        };
    }
};
const createMedicalRecord = async (rawData, appointmentId, relativeId) => {
    try {
        let data = await db.MedicalRecord.create({
            medicalHistory: rawData.medicalHistory,
            reason: rawData.reason,
            dateCreated: Date.now(),
            patientId: rawData.patientId,
            relativeId: relativeId,
            doctorId: rawData.doctorId,
            statusId: 6,
            appointmentId: appointmentId,
            specialtyId: rawData.specialtyId,
        });
        data = data.get({ plain: true });
        data.dateCreated = data.dateCreated ? data.dateCreated.toISOString().split("T")[0] : null;
        return {
            EC: 0,
            EM: "Medical Record created successfully",
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
const getAllRelative = async (id) => {
    try {
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Relative.findAll({
            where: { patientId: id },
            attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "email", "address"],
            raw: true,
            nest: true,
        });

        if (!data || data.length === 0) {
            return {
                EC: 0,
                EM: "No Relatives found",
                DT: [],
            };
        }
        let modifiedDT = data.map((item) => ({
            ...item,
            dateOfBirth: item.dateOfBirth ? new Date(item?.dateOfBirth).toISOString().split("T")[0] : null,
        }));
        return {
            EC: 0,
            EM: "Get the Relatives list",
            DT: modifiedDT,
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
const createNewRelative = async (rawData) => {
    try {
        const relativeData = {
            fullName: rawData.fullName,
            dateOfBirth: new Date(rawData.dateOfBirth),
            gender: rawData.gender,
            phone: rawData.phone,
            email: rawData.email,
            address: rawData.address,
            patientId: rawData.patientId,
        };
        let id = await checkEmailFromRelative(rawData.email);
        if (id) {
            let data = await db.Relative.update(relativeData, {
                where: { id: id },
            });
            return {
                EC: 0,
                EM: "Relative updated successfully",
                DT: data,
            };
        } else {
            let data = await db.Relative.create(relativeData);
            return {
                EC: 0,
                EM: "Relative created successfully",
                DT: data.id,
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
const deleteRelative = async (id) => {
    try {
        if (!id) {
            return {
                EC: 1,
                EM: "No Relative to delete",
                DT: "",
            };
        }
        await db.Relative.destroy({
            where: { id: id },
        });
        return {
            EC: 0,
            EM: "Deleted",
            DT: "",
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
const getAllAppointment = async (id) => {
    try {
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Appointment.findAll({
            where: [{ patientId: id }, { statusId: 3 }],
            attributes: ["id", "appointmentNumber"],
            include: [
                {
                    model: db.AllStatus,
                    attributes: ["id", "statusName"],
                },
                {
                    model: db.Patient,
                    attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address"],
                },
                {
                    model: db.Schedule,
                    attributes: ["id", "date"],
                    include: [
                        {
                            model: db.MedicalStaff,
                            attributes: [
                                "id",
                                "fullName",
                                "image",
                                "dateOfBirth",
                                "gender",
                                "phone",
                                "description",
                                "price",
                                "address",
                            ],
                        },
                        {
                            model: db.PeriodOfTime,
                            attributes: ["id", "time"],
                        },
                    ],
                },
            ],
        });

        // Kiểm tra nếu data không có giá trị thì trả về mảng rỗng
        if (!data || data.length === 0) {
            return {
                EC: 0,
                EM: "No Appointments found",
                DT: [],
            };
        }
        return {
            EC: 0,
            EM: "Get the Appointment list",
            DT: data,
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
const deleteAppointment = async (id) => {
    try {
        console.log(id);
        if (!id) {
            return {
                EC: 1,
                EM: "No Appointments to delete",
                DT: "",
            };
        }
        await db.Appointment.destroy({
            where: { id: id },
        });
        return {
            EC: 0,
            EM: "Deleted 1",
            DT: "",
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
const deleteMedicalRecord = async (id) => {
    try {
        console.log(id);
        if (!id) {
            return {
                EC: 1,
                EM: "No medical record to delete",
                DT: "",
            };
        }
        await db.MedicalRecord.destroy({
            where: { id: id },
        });
        return {
            EC: 0,
            EM: "Deleted",
            DT: "",
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
const putMedicalRecordById = async (rawData) => {
    try {
        console.log(rawData);
        await db.MedicalRecord.update(
            {
                medicalHistory: rawData.medicalHistory,
                reason: rawData.reason,
                diagnosis: rawData.diagnosis,
                statusId: rawData.statusId,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "Medical Record updated successfully",
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
const putPatientInfoById = async (rawData) => {
    try {
        let isUser = await checkUser(rawData.id);
        if (!isUser) {
            return {
                EC: 1,
                EM: "Patient doesn't already exist",
                DT: "",
            };
        }
        let user = await db.Patient.update(
            {
                fullName: rawData.fullName,
                dateOfBirth: new Date(rawData.dateOfBirth),
                gender: rawData.gender,
                phone: rawData.phone,
                address: rawData.address,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "Patient updated successfully",
            DT: user,
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
const findSchedudeForPatient = async (date) => {
    try {
        const [datePart, timePart] = date.split(" ");
        let data = await getAllSchedule();

        // Lọc các lịch trình theo điều kiện Appointment
        data.DT.forEach((entry) => {
            entry.schedules = entry.schedules.filter((schedule) => {
                if (schedule.Appointment && schedule.Appointment.id === null) {
                    delete schedule.Appointment;
                    return true;
                }
                return !schedule.Appointment || schedule.Appointment.id === null;
            });
        });
        const result = data.DT.filter((item) => item.schedules.length > 0 && item.date === datePart);
        if (result.length === 0) {
            return { EC: 1, EM: "No schedules found", DT: result };
        }
        const convertToSeconds = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 3600 + minutes * 60;
        };

        const timeASeconds = convertToSeconds(timePart);

        let closestSchedules = [];

        result.forEach((item) => {
            item.schedules.forEach((schedule) => {
                const scheduleTime = schedule.timeId.time.split(" - ")[0];
                const scheduleSeconds = convertToSeconds(scheduleTime);
                const difference = scheduleSeconds - timeASeconds;
                if (difference > 0) {
                    closestSchedules.push(schedule);
                }
            });
        });

        if (closestSchedules.length === 0) {
            return { EC: 0, EM: "No schedules found", DT: closestSchedules };
        }
        // Chỉ lấy các phần tử có thời gian liên tiếp giống nhau
        let results = [closestSchedules[0]];

        for (let i = 1; i < closestSchedules.length; i++) {
            if (closestSchedules[i].timeId.time === closestSchedules[i - 1].timeId.time) {
                results.push(closestSchedules[i]);
            } else {
                break;
            }
        }
        let maxItems = [];
        let maxCount = 0;

        for (const item of results) {
            let { count } = await db.MedicalRecord.findAndCountAll({
                where: {
                    doctorId: item.doctorId,
                    statusId: 3,
                },
            });

            if (count > maxCount) {
                maxCount = count;
                maxItems = [item];
            } else if (count === maxCount) {
                maxItems.push(item);
                break;
            }
        }

        return {
            EC: 0,
            EM: "Found schedules successfully",
            DT: maxItems[0],
        };
    } catch (err) {
        console.error(err);
        return {
            EC: -1,
            EM: "Something went wrong in service",
            DT: "",
        };
    }
};
const getOnePatient = async (id) => {
    try {
        let result = await db.Patient.findOne({
            where: { id: id },
            attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address"],
            include: [
                {
                    model: db.Account,
                    attributes: ["id", "email"],
                },
            ],
            raw: true,
            nest: true,
        });
        result.dateOfBirth = result.dateOfBirth ? result.dateOfBirth.toISOString().split("T")[0] : null;
        result.email = result.Account.email;

        // Xóa thuộc tính Account không cần thiết
        delete result.Account;
        return {
            EC: 0,
            EM: "Get the patient",
            DT: result,
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
const getOneRelative = async (id) => {
    try {
        let result = await db.Relative.findOne({
            where: { id: id },
            attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address", "email"],
            raw: true,
            nest: true,
        });
        result.dateOfBirth = result.dateOfBirth ? result.dateOfBirth.toISOString().split("T")[0] : null;
        return {
            EC: 0,
            EM: "Get the relative",
            DT: result,
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

const getAllDoctorfromSpecialtyById = async (id) => {
    try {
        let result = await db.Specialty.findOne({
            where: { id: id },
            attributes: ["id", "specialtyName", "description", "image"],
            include: [
                {
                    model: db.MedicalStaff,
                    attributes: [
                        "id",
                        "fullName",
                        "image",
                        "dateOfBirth",
                        "gender",
                        "phone",
                        "description",
                        "price",
                        "address",
                    ],
                    through: { attributes: [] },
                    include: [
                        {
                            model: db.Position,
                            attributes: ["id", "positionName"],
                        },
                    ],
                },
            ],
        });

        if (result.image) {
            result.image = Buffer.from(result.image, "binary").toString("base64");
        }

        result = result.get({ plain: true });

        if (result.MedicalStaffs && result.MedicalStaffs.length > 0) {
            result.MedicalStaffs.forEach((item) => {
                item.dateOfBirth = item.dateOfBirth ? item.dateOfBirth.toISOString().split("T")[0] : null;
                if (item.image) {
                    item.image = Buffer.from(item.image, "binary").toString("base64");
                }
            });
        }
        return {
            EC: 0,
            EM: "Get All doctor from specialty",
            DT: result,
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
const getAllMedicalRecordfromPatientById = async (rawData) => {
    try {
        const data = await db.MedicalRecord.findAll({
            where: {
                patientId: rawData.patientId,
                statusId: rawData.statusId,
            },
            attributes: ["id", "medicalHistory", "reason", "diagnosis"],
            include: [
                {
                    model: db.Relative,
                    attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "email", "address"],
                },
                {
                    model: db.Patient,
                    attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address"],
                    include: [
                        {
                            model: db.Account,
                            attributes: ["email"],
                        },
                    ],
                },
                {
                    model: db.AllStatus,
                    attributes: ["id", "statusName"],
                },
                {
                    model: db.Specialty,
                    attributes: ["id", "specialtyName"],
                },
                {
                    model: db.Appointment,
                    attributes: ["id", "appointmentNumber"],
                    include: [
                        {
                            model: db.Schedule,
                            attributes: ["id", "date"],
                            include: [
                                {
                                    model: db.PeriodOfTime,
                                    attributes: ["id", "time"],
                                },
                            ],
                        },
                    ],
                },

                {
                    model: db.MedicalStaff,
                    attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address"],
                },
                {
                    model: db.Prescription,
                    attributes: ["id", "medicationName", "price", "quantity", "instruction"],
                },
                {
                    model: db.Invoice,
                    attributes: ["id", "totalPrice", "dateCreated"],
                },
            ],
            raw: true,
            nest: true,
        });
        const groupedData = data.reduce((acc, current) => {
            const found = acc.find((item) => item.id === current.id);
            if (found) {
                if (!Array.isArray(found.Prescriptions)) {
                    found.Prescriptions = [found.Prescriptions];
                }
                found.Prescriptions.push(current.Prescriptions);
            } else {
                current.Prescriptions = [current.Prescriptions];
                acc.push(current);
            }
            return acc;
        }, []);

        const result = {
            MedicalRecordRelative: [],
            MedicalRecordPatient: [],
        };

        groupedData.forEach((record) => {
            const commonFields = {
                id: record.id,
                medicalHistory: record.medicalHistory,
                reason: record.reason,
                diagnosis: record.diagnosis,
                statusMR: record.AllStatus.statusName,
                specialtyMR: record.Specialty.specialtyName,
                appointmentNumber: record.Appointment.appointmentNumber,
                date: record.Appointment.Schedule.date
                    ? record.Appointment.Schedule.date.toISOString().split("T")[0]
                    : null,
                time: record.Appointment.Schedule.PeriodOfTime.time,
                MedicalStaff: {
                    fullName: record.MedicalStaff.fullName,
                    dateOfBirth: record.MedicalStaff.dateOfBirth
                        ? record.MedicalStaff.dateOfBirth.toISOString().split("T")[0]
                        : null,
                    gender: record.MedicalStaff.gender,
                    phone: record.MedicalStaff.phone,
                    address: record.MedicalStaff.address,
                },
                Prescriptions: record.Prescriptions[0].id ? record.Prescriptions : null,
                Invoice: record.Invoices.id ? record.Invoices : null,
            };

            if (record.Relative && record.Relative.id) {
                result.MedicalRecordRelative.push({
                    ...commonFields,
                    Patient: {
                        id: record.Relative.id,
                        fullName: record.Relative.fullName,
                        dateOfBirth: record.Relative.dateOfBirth
                            ? record.Relative.dateOfBirth.toISOString().split("T")[0]
                            : null,
                        gender: record.Relative.gender,
                        phone: record.Relative.phone,
                        email: record.Relative.email,
                        address: record.Relative.address,
                    },
                });
            } else {
                result.MedicalRecordPatient.push({
                    ...commonFields,
                    Patient: {
                        id: record.Patient.id,
                        fullName: record.Patient.fullName,
                        dateOfBirth: record.Patient.dateOfBirth
                            ? record.Patient.dateOfBirth.toISOString().split("T")[0]
                            : null,
                        gender: record.Patient.gender,
                        phone: record.Patient.phone,
                        email: record.Patient.Account?.email,
                        address: record.Patient.address,
                    },
                });
            }
        });

        return {
            EC: 0,
            EM: "Get All medical record",
            DT: result,
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

module.exports = {
    createAppointment,
    getAllAppointment,
    deleteAppointment,
    createMedicalRecord,
    getAllRelative,
    createNewRelative,
    deleteRelative,
    deleteMedicalRecord,
    putMedicalRecordById,
    putPatientInfoById,
    findSchedudeForPatient,
    getOnePatient,
    getOneRelative,
    getAllDoctorfromSpecialtyById,
    getAllMedicalRecordfromPatientById,
};
