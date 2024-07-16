const { getMedicalStaffById, getOneSpecialty } = require("../services/adminService");
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
    findSchedudeForPatient,
    getOnePatient,
    getOneRelative,
    getAllDoctorfromSpecialtyById,
    getAllMedicalRecordfromPatientById,
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
                return res.status(200).json({
                    EC: relativeInfo.EC,
                    EM: relativeInfo.EM,
                    DT: "",
                });
            }
            relativeId = relativeInfo.DT;
        }

        const appointmentInfo = await createAppointment(appointment);
        if (appointmentInfo.EC !== 0) {
            if (relativeId) await deleteRelative(relativeId);
            return res.status(200).json({
                EC: appointmentInfo.EC,
                EM: appointmentInfo.EM,
                DT: "",
            });
        }

        appointmentId = appointmentInfo.DT.id;

        const data = await createMedicalRecord(medicalRecord, appointmentId, relativeId);
        if (data.EC !== 0) {
            if (appointmentId) await deleteAppointment(appointmentId);
            if (relativeId) await deleteRelative(relativeId);
            return res.status(200).json({
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
        if (data && data.DT.id) await deleteMedicalRecord(data.DT.id);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};

const quickCheckUp = async (req, res) => {
    let appointmentId = null;
    let relativeId = null;
    try {
        const { medicalRecord, dateQuickCheckUp, relative } = req.body;
        // Input validation
        if (!medicalRecord || !dateQuickCheckUp) {
            return res.status(400).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }

        // Find schedule for patient
        const schedule = await findSchedudeForPatient(dateQuickCheckUp);
        console.log(schedule);
        if (schedule.EC !== 0 || schedule.DT.length === 0) {
            return res.status(200).json({
                EC: schedule.EC,
                EM: schedule.EM,
                DT: "",
            });
        }

        // Create appointment
        const appointmentInfo = await createAppointment({
            statusId: 2,
            scheduleId: schedule.DT.id,
            patientId: medicalRecord?.patientId,
        });
        if (appointmentInfo.EC !== 0) {
            return res.status(200).json({
                EC: appointmentInfo.EC,
                EM: appointmentInfo.EM,
                DT: "",
            });
        }

        if (relative) {
            const relativeInfo = await createNewRelative(relative);
            if (relativeInfo.EC !== 0) {
                if (appointmentId) await deleteAppointment(appointmentId);
                return res.status(200).json({
                    EC: relativeInfo.EC,
                    EM: relativeInfo.EM,
                    DT: "",
                });
            }
            relativeId = relativeInfo.DT;
        }
        let medicalRecordData = {
            medicalHistory: medicalRecord?.medicalHistory,
            reason: medicalRecord?.reason,
            doctorId: schedule.DT.doctorId,
            patientId: medicalRecord?.patientId,
            specialtyId: medicalRecord?.specialtyId,
        };
        // Create medical record
        appointmentId = appointmentInfo.DT.id;
        const medicalRecordInfo = await createMedicalRecord(medicalRecordData, appointmentId, relativeId);
        if (medicalRecordInfo.EC !== 0) {
            if (appointmentId) await deleteAppointment(appointmentId);
            if (relativeId) await deleteRelative(relativeId);
            return res.status(200).json({
                EC: medicalRecordInfo.EC,
                EM: medicalRecordInfo.EM,
                DT: "",
            });
        }

        // Fetch additional info
        let doctorInfo = await getMedicalStaffById(schedule.DT.doctorId);
        let specialtyInfo = await getOneSpecialty(medicalRecordInfo.DT.specialtyId);
        let patientInfo;
        if (relative) {
            patientInfo = await getOneRelative(relativeId);
        } else {
            patientInfo = await getOnePatient(medicalRecordInfo.DT.patientId);
        }
        // Prepare response
        let result = {
            appointmentInfo: appointmentInfo.DT,
            medicalRecordInfo: medicalRecordInfo.DT,
            doctorInfo: doctorInfo.DT,
            specialtyInfo: specialtyInfo.DT,
            patientInfo: patientInfo.DT,
            schedule: schedule.DT,
        };

        // Send success response
        return res.status(200).json({
            EC: 0,
            EM: "Tạo lịch khám thành công",
            DT: result,
        });
    } catch (err) {
        console.error(err);
        // Handle errors and rollback if necessary
        if (medicalRecordInfo && medicalRecordInfo.DT.id) await deleteMedicalRecord(medicalRecordInfo.DT.id);
        if (appointmentId) await deleteAppointment(appointmentId);
        if (relativeId) await deleteRelative(relativeId);

        return res.status(500).json({
            EC: -1,
            EM: "Error from server",
            DT: "",
        });
    }
};
const getAllDoctorfromSpecialty = async (req, res) => {
    try {
        let data = await getAllDoctorfromSpecialtyById(req.query.id);
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
const getAllMedicalRecordfromPatient = async (req, res) => {
    try {
        let data = await getAllMedicalRecordfromPatientById(req.query);
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
    postAppointment,
    getAppointment,
    deleteAppointmentById,
    deleteMedicalRecordById,
    postMedicalRecord,
    putMedicalRecord,
    putPatientInfo,
    getRelative,
    quickCheckUp,
    getAllDoctorfromSpecialty,
    getAllMedicalRecordfromPatient,
};
