const {
    getAllSchedule,
    createSchedule,
    deleteSchedule,
    getAllAppointmentfromOneDoctor,
    createPrescription,
    createInvoice,
    getAllInvoiceByDoctorId,
    putMedicalRecordById,
    checkMedicalRecord,
} = require("../services/doctorService");
const { createAppointment, createMedicalRecord } = require("../services/patientService");
const { updateAppointment } = require("../services/staffService");
const { deleteAppointment } = require("./staffController");

const postSchedule = async (req, res) => {
    try {
        if (!req.body.create[0].date && !req.body.delete) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data;
        if (req.body.delete && req.body.delete.length > 0) {
            data = await deleteSchedule(req.body.delete);
        }
        if (req.body.create && req.body.create.length > 0) {
            data = await createSchedule(req.body.create);
        }
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getSchedule = async (req, res) => {
    try {
        let data = await getAllSchedule(req.query.id);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const deleteScheduleById = async (req, res) => {
    try {
        let data = await deleteSchedule([req.params.id]);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllAppointmentDoctor = async (req, res) => {
    try {
        let data = await getAllAppointmentfromOneDoctor(req.query.doctorId, req.query.statusId);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const examiningDoctor = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }

        await updateAppointment(req.body.appointment);
        let data = await putMedicalRecordById(req.body.medicalRecord);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const postReExamination = async (req, res) => {
    let appointmentId = null;
    try {
        if (!req.body) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let patientId = null;
        let relativeId = null;
        let check = await checkMedicalRecord(req.body.recordId);
        if (check.status) {
            relativeId = req.body.patientId;
        } else {
            patientId = req.body.patientId;
        }
        //Create appointment
        const appointmentInfo = await createAppointment({
            statusId: 8,
            scheduleId: req.body.scheduleId,
            patientId: check.patientId,
        });
        if (appointmentInfo.EC !== 0) {
            return res.status(200).json({
                EC: appointmentInfo.EC,
                EM: appointmentInfo.EM,
                DT: "",
            });
        }

        let medicalRecordData = {
            doctorId: req.body.doctorId,
            patientId: check.patientId,
            specialtyId: check.specialtyId,
        };
        // Create medical record
        appointmentId = appointmentInfo.DT.id;
        const medicalRecordInfo = await createMedicalRecord(medicalRecordData, appointmentId, relativeId);
        if (medicalRecordInfo.EC !== 0) {
            if (appointmentId) await deleteAppointment(appointmentId);
            return res.status(200).json({
                EC: medicalRecordInfo.EC,
                EM: medicalRecordInfo.EM,
                DT: "",
            });
        }
        // Send success response
        return res.status(200).json({
            EC: 0,
            EM: "Tạo lịch tái khám thành công.",
            DT: "",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const postPrescription = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await createPrescription(req.body);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const postInvoice = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await createInvoice(req.body);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllInvoice = async (req, res) => {
    try {
        let data = await getAllInvoiceByDoctorId(req.query.id);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
module.exports = {
    postSchedule,
    getSchedule,
    deleteScheduleById,
    getAllAppointmentDoctor,
    examiningDoctor,
    postReExamination,
    postPrescription,
    postInvoice,
    getAllInvoice,
};
