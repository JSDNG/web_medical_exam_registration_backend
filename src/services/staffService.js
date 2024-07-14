const db = require("../models");
const _ = require("lodash");
const { reduce } = require("lodash");
const { Op } = require("sequelize");

const updateAppointment = async (rawData) => {
    try {
        console.log("1", rawData);
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
                            attributes: ["fullName", "phone", "price", "address"],
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
            data.MedicalRecords.Relative.id !== null ? data.MedicalRecords.Relative : data.MedicalRecords.Patient;
        result = {
            appointmentNumber: data.appointmentNumber,
            date: data.Schedule.date.toISOString().split("T")[0],
            time: data.Schedule.PeriodOfTime.time,
            MedicalStaff: data.Schedule.MedicalRecord,
            MedicalRecord: {
                id: data.MedicalRecords.id,
                medicalHistory: data.MedicalRecords.medicalHistory,
                reason: data.MedicalRecords.reason,
                specialtyMR: data.MedicalRecords.Specialty.specialtyName,
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
        return {
            EC: 0,
            EM: "Approve appointment",
            DT: result,
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
                            attributes: [
                                "id",
                                "fullName",
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
                item.MedicalRecords.Relative.id !== null ? item.MedicalRecords.Relative : item.MedicalRecords.Patient;

            let items = {
                id: item.id,
                appointmentNumber: item.appointmentNumber,
                updatedAt: item.updatedAt,
                statusAM: item.AllStatus.statusName,
                time: item.Schedule.PeriodOfTime.time,
                date: item.Schedule.date.toISOString().split("T")[0],
                MedicalRecord: {
                    id: item.MedicalRecords.id,
                    medicalHistory: item.MedicalRecords.medicalHistory,
                    reason: item.MedicalRecords.reason,
                    specialtyMR: item.MedicalRecords.Specialty.specialtyName,
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

module.exports = {
    updateAppointment,
    getAllAppointmentById,
};
