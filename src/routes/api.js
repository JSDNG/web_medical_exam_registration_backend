const express = require("express");
const {
    getSchedule,
    postSchedule,
    deleteScheduleById,
    getAllAppointmentDoctor,
    examiningDoctor,
    postPrescription,
    deleteMultiPrescription,
    postInvoice,
} = require("../controllers/doctorController");
const {
    register,
    login,
    logout,
    getAllMedicalStaff,
    getAllTime,
    getAllSpecialty,
    getOneMedicalStaff,
    putOneMedicalStaff,
    deleteOneMedicalStaff,
    getAllPosition,
    putOneSpecialty,
    postSpecialty,
} = require("../controllers/adminController");
const {
    postAppointment,
    putMedicalRecord,
    deleteAppointmentById,
    deleteMedicalRecordById,
    putPatientInfo,
    getAppointment,
    getRelative,
    quickCheckUp,
    getAllDoctorfromSpecialty,
    getAllMedicalRecordfromPatient,
} = require("../controllers/patientController");

const {
    putAppointment,
    getAllAppointment,
    deleteAppointmentAndMedicalRecord,
} = require("../controllers/staffController");
const { create } = require("lodash");
const router = express.Router();

const initAPIRoutes = (app) => {
    //router.all("*", checkUserJWT, checkUserPermission);
    //Account;
    router.post("/register", register);
    router.post("/login", login);
    router.post("/logout", logout);

    // Admin
    router.get("/admin/medical-staff/all", getAllMedicalStaff);
    router.get("/admin/time/all", getAllTime);
    router.get("/admin/position/all", getAllPosition);
    router.get("/admin/specialty/all", getAllSpecialty);
    router.get("/medical-staff/:id", getOneMedicalStaff);
    router.put("/medical-staff", putOneMedicalStaff);
    router.delete("/medical-staff/:id", deleteOneMedicalStaff);

    router.post("/admin/specialty", postSpecialty);
    router.put("/admin/specialty", putOneSpecialty);
    // Doctor
    router.get("/doctor/:id/schedule/all", getSchedule);
    router.post("/doctor/schedule", postSchedule);
    router.delete("/doctor/schedule/:id", deleteScheduleById);
    router.get("/doctor/appointment-from-one-doctor/all", getAllAppointmentDoctor);
    router.put("/doctor/examining-doctor", examiningDoctor);
    // Staff
    router.put("/staff/appointment", putAppointment);
    router.get("/staff/appointment/all", getAllAppointment);
    router.delete("/staff/delete/medical-record/appointment", deleteAppointmentAndMedicalRecord);

    router.post("/doctor/prescription", postPrescription);
    router.delete("/doctor/prescription", deleteMultiPrescription);

    router.post("/doctor/invoice", postInvoice);
    // Patient
    router.post("/patient/appointment", postAppointment);
    //router.get("/patient/:id/appointment/all", getAppointment);
    router.delete("/patient/appointment/:id", deleteAppointmentById);

    router.get("/patient/medical-record/all", getAllMedicalRecordfromPatient);
    router.put("/patient/medical-record", putMedicalRecord);
    router.delete("/patient/medical-record/:id", deleteMedicalRecordById);

    router.put("/patient/information", putPatientInfo);

    router.post("/patient/quick-check-up", quickCheckUp);

    router.get("/relative/all", getRelative);

    router.get("/all-doctor/specialty-by-id", getAllDoctorfromSpecialty);

    return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes; // export default
