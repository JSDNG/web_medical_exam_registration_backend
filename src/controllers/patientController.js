const {
    getAllAppointment,
    createAppointment,
    deleteAppointment,
    deleteMedicalRecord,
    createMedicalRecord,
    putMedicalRecordById,
    putPatientInfoById,
    createNewRelative,
    deleteRelative,
    getAllRelative,
} = require("../services/patientService");

const postAppointment = async (req, res) => {
    let relativeId = null;
    let appointmentId = null;

    try {
        const { appointment, medicalRecord, relative } = req.body;
        if (!appointment || !medicalRecord) {
            return res.status(400).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }

        if (relative) {
            const relativeInfo = await createNewRelative(relative);
            if (relativeInfo.EC !== 0) {
                return res.status(400).json({
                    EC: relativeInfo.EC,
                    EM: relativeInfo.EM,
                    DT: "",
                });
            }
            relativeId = relativeInfo.DT ? relativeInfo.DT.toString() : null;
        }

        const appointmentInfo = await createAppointment(appointment);
        if (appointmentInfo.EC !== 0) {
            if (relativeId) await deleteRelative(relativeId);
            return res.status(400).json({
                EC: appointmentInfo.EC,
                EM: appointmentInfo.EM,
                DT: "",
            });
        }

        appointmentId = appointmentInfo.DT ? appointmentInfo.DT.toString() : null;

        const data = await createMedicalRecord(medicalRecord, appointmentId, relativeId);
        if (data.EC !== 0) {
            await deleteAppointment(appointmentId);
            if (relativeId) await deleteRelative(relativeId);
            return res.status(400).json({
                EC: data.EC,
                EM: data.EM,
                DT: "",
            });
        }
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.error(err);

        if (appointmentId) await deleteAppointment(appointmentId);
        if (relativeId) await deleteRelative(relativeId);

        return res.status(500).json({
            EC: -1,
            EM: "Error from server",
            DT: "",
        });
    }
};

const getAppointment = async (req, res) => {
    try {
        let data = await getAllAppointment(req.params.id);
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
const postMedicalRecord = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await createMedicalRecord(req.body);
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

const getRelative = async (req, res) => {
    try {
        let data = await getAllRelative(req.query.id);
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
    postAppointment,
    getAppointment,
    deleteAppointmentById,
    deleteMedicalRecordById,
    postMedicalRecord,
    putMedicalRecord,
    putPatientInfo,
    getRelative,
};
