const db = require("../models");
const _ = require("lodash");
const { reduce } = require("lodash");
const { Op } = require("sequelize");
const { sendEmailAppointment } = require("./emailService");

const updateAppointment = async (rawData) => {
    try {
        await db.Appointment.update(
            {
                statusId: rawData.statusId,
                staffId: rawData.staffId,
            },
            {
                where: { id: rawData.id },
            }
        );

        let data = await db.Appointment.findOne({
            where: { id: rawData.id },
            attributes: ["appointmentNumber"],
            include: [
                {
                    model: db.Schedule,
                    attributes: ["id", "date"],
                    include: [
                        {
                            model: db.MedicalStaff,
                            attributes: ["fullName", "gender", "phone", "price"],
                        },
                        {
                            model: db.PeriodOfTime,
                            attributes: ["time"],
                        },
                    ],
                },
                {
                    model: db.MedicalRecord,
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
                            model: db.Specialty,
                            attributes: ["id", "specialtyName"],
                        },
                    ],
                },
            ],
            raw: true,
            nest: true,
        });
        let patientInfo =
            data.MedicalRecord.Relative.id !== null ? data.MedicalRecord.Relative : data.MedicalRecord.Patient;
        result = {
            appointmentNumber: data.appointmentNumber,
            date: data.Schedule.date.toISOString().split("T")[0],
            time: data.Schedule.PeriodOfTime.time,
            MedicalStaff: data.Schedule.MedicalStaff,
            MedicalRecord: {
                id: data.MedicalRecord.id,
                medicalHistory: data.MedicalRecord.medicalHistory,
                reason: data.MedicalRecord.reason,
                specialtyMR: data.MedicalRecord.Specialty.specialtyName,
            },
            Patient: {
                id: patientInfo.id,
                fullName: patientInfo.fullName,
                dateOfBirth: patientInfo.dateOfBirth ? patientInfo.dateOfBirth.toISOString().split("T")[0] : null,
                gender: patientInfo.gender,
                phone: patientInfo.phone,
                email: patientInfo.email || patientInfo.Account?.email,
                address: patientInfo.address,
            },
        };
        if (rawData.staffId) {
            await sendEmailAppointment(result);
        }

        return {
            EC: 0,
            EM: "Approve appointment",
            DT: "result",
        };
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Something wrongs in service... a",
            DT: "",
        };
    }
};
const getAllAppointmentById = async (id) => {
    try {
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Appointment.findAll({
            where: [{ statusId: id }],
            attributes: ["id", "appointmentNumber", "updatedAt"],
            include: [
                {
                    model: db.AllStatus,
                    attributes: ["id", "statusName"],
                },
                {
                    model: db.MedicalRecord,
                    attributes: ["id", "medicalHistory", "reason"],
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
                            model: db.Specialty,
                            attributes: ["id", "specialtyName"],
                        },
                    ],
                },
                {
                    model: db.Schedule,
                    attributes: ["id", "date"],
                    include: [
                        {
                            model: db.MedicalStaff,
                            attributes: ["id", "fullName", "gender", "phone", "description", "price"],
                        },
                        {
                            model: db.PeriodOfTime,
                            attributes: ["id", "time"],
                        },
                    ],
                },
            ],
            raw: true,
            nest: true,
        });

        // Kiểm tra nếu data không có giá trị thì trả về mảng rỗng
        if (!data || data.length === 0) {
            return {
                EC: 0,
                EM: "No Appointments found",
                DT: [],
            };
        }
        let results = data.map((item) => {
            let patientInfo =
                item.MedicalRecord.Relative.id !== null ? item.MedicalRecord.Relative : item.MedicalRecord.Patient;

            let items = {
                id: item.id,
                appointmentNumber: item.appointmentNumber,
                updatedAt: item.updatedAt,
                statusAM: item.AllStatus.statusName,
                time: item.Schedule.PeriodOfTime.time,
                date: item.Schedule.date.toISOString().split("T")[0],
                MedicalRecord: {
                    id: item.MedicalRecord.id,
                    medicalHistory: item.MedicalRecord.medicalHistory,
                    reason: item.MedicalRecord.reason,
                    specialtyMR: item.MedicalRecord.Specialty.specialtyName,
                },
                Patient: {
                    id: patientInfo.id,
                    fullName: patientInfo.fullName,
                    dateOfBirth: patientInfo.dateOfBirth ? patientInfo.dateOfBirth.toISOString().split("T")[0] : null,
                    gender: patientInfo.gender,
                    phone: patientInfo.phone,
                    email: patientInfo.email || patientInfo.Account?.email,
                    address: patientInfo.address,
                },
            };

            return items;
        });
        if (+id === 1) {
            results.sort((a, b) => a.id - b.id);
        } else {
            results.sort((a, b) => b.updatedAt - a.updatedAt);
        }

        return {
            EC: 0,
            EM: "Get the Appointment list",
            DT: results,
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

const deleteAppointmentById = async (id) => {
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
            EM: "Appointments deleted",
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
module.exports = {
    updateAppointment,
    getAllAppointmentById,
    deleteAppointmentById,
};
