const db = require("../models");
const _ = require("lodash");
const { reduce } = require("lodash");
const { Op } = require("sequelize");
const checkUser = async (id) => {
    let userId = await db.Patient.findOne({
        where: { id: id },
    });
    if (userId) {
        return true;
    }
    return false;
};
const createAppointment = async (rawData) => {
    try {
        let data = await db.Appointment.create({
            statusId: rawData.statusId,
            scheduleId: rawData.scheduleId,
            patientId: rawData.patientId,
        });
        return {
            EC: 0,
            EM: "Appointment created successfully",
            DT: data.id,
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
const createMedicalRecord = async (rawData, appointmentId) => {
    try {
        let data = await db.MedicalRecord.create({
            medicalHistory: rawData.medicalHistory,
            reason: rawData.reason,
            dateCreated: Date.now(),
            patientId: rawData.patientId,
            doctorId: rawData.doctorId,
            statusId: 6,
            appointmentId: appointmentId,
            specialtyId: rawData.specialtyId,
        });
        return {
            EC: 0,
            EM: "Medical Record created successfully",
            DT: data.id,
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
const getAllAppointment = async () => {
    try {
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Appointment.findAll({
            // where: { patientId: id },
            attributes: ["id"],
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
                    attributes: ["id", "price", "date"],
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
const deleteMedicalRecord = async (id) => {
    try {
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
        await db.MedicalRecord.update(
            {
                medicalHistory: rawData.medicalHistory,
                reason: rawData.reason,
                diagnosis: rawData.diagnosis,
                treatmentPlan: rawData.treatmentPlan,
                statusId: rawData.statusId,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "User updated successfully",
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
    createAppointment,
    getAllAppointment,
    deleteAppointment,
    createMedicalRecord,
    deleteMedicalRecord,
    putMedicalRecordById,
    putPatientInfoById,
};
