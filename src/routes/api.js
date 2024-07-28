const express = require("express");
const {
    getSchedule,
    postSchedule,
    deleteScheduleById,
    getAllAppointmentDoctor,
    examiningDoctor,
    postPrescription,
    postInvoice,
    getAllInvoice,
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
    getAllPosition,
    putOneSpecialty,
    postSpecialty,
    getListOfFamousDoctors,
    getAllDoctorfromSpecialty,
    postMedication,
    putMedication,
    getAllMedication,
} = require("../controllers/adminController");
const {
    postAppointment,
    putPatientInfo,
    getRelative,
    quickCheckUp,
    getAllMedicalRecordfromPatient,
    getPatient,
    getScheduleForPatient,
} = require("../controllers/patientController");

const { putAppointment, getAllAppointment, deleteAppointment } = require("../controllers/staffController");
const { checkUserJWT, checkUserPermission } = require("../middleware/jwtAction");
const passport = require("passport");
const passportConfig = require("../middleware/passport");
require("dotenv").config();

const router = express.Router();

const initAPIRoutes = (app) => {
    router.all("*", checkUserJWT, checkUserPermission);
    //Account;
    router.post("/register", register);
    router.post("/login", login);
    router.post("/logout", logout);
    // Google
    router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    router.get(
        "/auth/google/callback",
        passport.authenticate("google", {
            session: false,
            failureRedirect: `${process.env.REACT_URL}/login`,
        }),
        (req, res) => {
            if (req.user && req.user.DT && req.user.DT.access_token && req.user.DT.refresh_token) {
                res.cookie("access_token", req.user.DT.access_token, {
                    httpOnly: true,
                    maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
                });
                res.cookie("refresh_token", req.user.DT.refresh_token, {
                    httpOnly: true,
                    maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
                });
                res.cookie("id", req.user.DT.user.id, {
                    httpOnly: false,
                    maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
                });
            }
            res.redirect(`${process.env.REACT_URL}`);
        }
    );

    // Admin
    router.get("/admin/medical-staff/all", getAllMedicalStaff);
    router.get("/admin/time/all", getAllTime);
    router.get("/admin/position/all", getAllPosition);

    router.get("/medical-staff", getOneMedicalStaff);
    router.put("/medical-staff", putOneMedicalStaff);

    router.get("/admin/specialty/all", getAllSpecialty);
    router.post("/admin/specialty", postSpecialty);
    router.put("/admin/specialty", putOneSpecialty);

    router.get("/admin/medication/all", getAllMedication);
    router.post("/admin/medication", postMedication);
    router.put("/admin/medication", putMedication);

    router.get("/admin/list-of-famous-doctors", getListOfFamousDoctors);
    router.get("/admin/all-doctor-specialty-by-id", getAllDoctorfromSpecialty);
    // Doctor
    router.get("/doctor/schedule/all", getSchedule);
    router.post("/doctor/schedule", postSchedule);
    router.delete("/doctor/schedule/:id", deleteScheduleById);

    router.get("/doctor/appointment-from-one-doctor/all", getAllAppointmentDoctor);
    router.put("/doctor/examining-doctor", examiningDoctor);

    router.post("/doctor/prescription", postPrescription);

    router.post("/doctor/send-email-invoice", postInvoice);
    router.get("/doctor/invoice", getAllInvoice);
    // Staff
    router.get("/appointment/all", getAllAppointment);
    router.put("/staff/appointment", putAppointment);
    router.delete("/staff/appointment/:id", deleteAppointment);

    // Patient
    router.post("/patient/appointment", postAppointment);
    router.get("/patient/find-the-right-schedule", getScheduleForPatient);
    router.get("/patient/medical-record/all", getAllMedicalRecordfromPatient);
    router.get("/patient/information", getPatient);
    router.put("/patient/information", putPatientInfo);

    router.post("/patient/quick-check-up", quickCheckUp);

    router.get("/relative/all", getRelative);
    return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes; // export default
