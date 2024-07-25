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
    getAppointment,
    getRelative,
    quickCheckUp,
    getAllMedicalRecordfromPatient,
} = require("../controllers/patientController");

const { putAppointment, getAllAppointment, deleteAppointment } = require("../controllers/staffController");
const { checkUserJWT, checkUserPermission } = require("../middleware/jwtAction");
const passport = require("passport");
const passportConfig = require("../middleware/passport");
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
        passport.authenticate("google", { session: false }, { failureRedirect: "/login" }),
        (req, res) => {
            // Successful authentication, redirect home.
            console.log("check user", res.user);
            res.redirect("/");
        },
    );

    //router.post("/auth/google", passport.authenticate("google-oauth-token", { session: false }), authGoogle);
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
    //router.get("/patient/:id/appointment/all", getAppointment);

    router.get("/patient/medical-record/all", getAllMedicalRecordfromPatient);

    router.put("/patient/information", putPatientInfo);

    router.post("/patient/quick-check-up", quickCheckUp);

    router.get("/relative/all", getRelative);
    return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes; // export default
