const express = require("express");
const {
    getSchedule,
    postSchedule,
    deleteScheduleById,
    getAllAppointment,
    examiningDoctor,
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
} = require("../controllers/adminController");
const {
    postAppointment,
    putMedicalRecord,
    deleteAppointmentById,
    deleteMedicalRecordById,
    putPatientInfo,
    getAppointment,
} = require("../controllers/patientController");

const { putAppointment } = require("../controllers/staffController");
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
    router.get("/admin/specialty/all", getAllSpecialty);
    router.get("/medical-staff/:id", getOneMedicalStaff);
    router.put("/medical-staff", putOneMedicalStaff);
    router.delete("/medical-staff/:id", deleteOneMedicalStaff);

    // Doctor
    router.get("/doctor/:id/schedule/all", getSchedule);
    router.post("/doctor/schedule", postSchedule);
    router.delete("/doctor/schedule/:id", deleteScheduleById);
    router.get("/doctor/appointment-from-doctor/all", getAllAppointment);
    router.put("/doctor/examining-doctor", examiningDoctor);
    // Staff
    router.put("/staff/appointment", putAppointment);

    // Patient
    router.post("/patient/appointment", postAppointment);
    router.get("/patient/:id/appointment/all", getAppointment);
    router.delete("/patient/appointment/:id", deleteAppointmentById);

    router.put("/patient/medical-record", putMedicalRecord);
    router.delete("/patient/medical-record/:id", deleteMedicalRecordById);

    router.put("/patient/information", putPatientInfo);

    return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes; // export default
