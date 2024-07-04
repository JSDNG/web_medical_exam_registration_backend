const { getAllSchedule, createSchedule, deleteSchedule, getAllMedicalRecord, getAllAppointmentfromOneDoctor } = require("../services/doctorService");

const postSchedule = async (req, res) => {
    try {
        if (!req.body.create && !req.body.delete) {
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
        let data = await getAllSchedule(req.params.id);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
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
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllMedicalRecordById = async (req, res) => {
    try {
        console.log(req.query.id);
        let data = await getAllMedicalRecord(req.query.id);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllAppointment = async (req, res) => {
    try {
        let data = await getAllAppointmentfromOneDoctor(req.query.id);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
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
    getAllMedicalRecordById,
    getAllAppointment,
};
