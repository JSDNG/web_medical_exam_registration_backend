const {
    getAllSchedule,
    createSchedule,
    deleteSchedule,
    getAllAppointmentfromOneDoctor,
    createPrescription,
    createInvoice,
    getAllInvoiceByDoctorId,
    putMedicalRecordById,
} = require("../services/doctorService");
const { updateAppointment } = require("../services/staffService");

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
    postPrescription,
    postInvoice,
    getAllInvoice,
};
