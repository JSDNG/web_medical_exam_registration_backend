const { deleteMedicalRecord } = require("../services/patientService");
const { updateAppointment, getAllAppointmentById, deleteAppointmentById } = require("../services/staffService");

const putAppointment = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                EC: 1,
                EM: "missing required params",
                DT: "",
            });
        } else {
            let data = await updateAppointment(req.body);
            return res.status(200).json({
                EC: data.EC,
                EM: data.EM,
                DT: data.DT,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllAppointment = async (req, res) => {
    try {
        let data = await getAllAppointmentById(req.query.id);
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

const deleteAppointment = async (req, res) => {
    try {
        let data = await deleteAppointmentById(req.params.id);
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
    putAppointment,
    getAllAppointment,
    deleteAppointment,
};
