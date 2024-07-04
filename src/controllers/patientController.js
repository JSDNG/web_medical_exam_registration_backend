const {
    getAllAppointment,
    createAppointment,
    deleteAppointment,
    deleteMedicalRecord,
    createMedicalRecord,
    putMedicalRecordById,
    putPatientInfoById,
} = require("../services/patientService");

const postAppointment = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await createAppointment(req.body);
        if (data.EC !== 0) {
            return res.status(200).json({
                EC: data.EC,
                EM: data.EM,
                DT: "",
            });
        }
        let appointmentId = data.DT && data.DT.toString();

        if (appointmentId) {
            let data1 = await createMedicalRecord(req.body, appointmentId);
            return res.status(200).json({
                EC: data1.EC,
                EM: data1.EM,
                DT: "",
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
const getAppointment = async (req, res) => {
    try {
        let data = await getAllAppointment();
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
const deleteAppointmentById = async (req, res) => {
    try {
        let data = await deleteAppointment(req.params.id);
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

const deleteMedicalRecordById = async (req, res) => {
    try {
        let data = await deleteMedicalRecord(req.params.id);
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
const putMedicalRecord = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                EC: 1,
                EM: "missing required params",
                DT: "",
            });
        } else {
            let data = await putMedicalRecordById(req.body);
            return res.status(200).json({
                EC: data.EC,
                EM: data.EM,
                DT: data.DT,
            });
        }
    } catch (err) {
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const putPatientInfo = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                EC: 1,
                EM: "missing required params",
                DT: "",
            });
        } else {
            let data = await putPatientInfoById(req.body);
            return res.status(200).json({
                EC: data.EC,
                EM: data.EM,
                DT: data.DT,
            });
        }
    } catch (err) {
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
module.exports = {
    postAppointment,
    getAppointment,
    deleteAppointmentById,
    deleteMedicalRecordById,
    putMedicalRecord,
    putPatientInfo,
};
