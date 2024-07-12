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
            EM: "Get the specialty list",
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

module.exports = {
    updateAppointment,
};
