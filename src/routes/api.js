const express = require("express");
const { getSchedule, postSchedule } = require("../controllers/doctorController");
const {
    register,
    login,
    logout,
    getAllMedicalStaff,
    getAllTime,
    getOneMedicalStaff,
    putOneMedicalStaff,
    deleteOneMedicalStaff,
} = require("../controllers/adminController");
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
    router.get("medical-staff/:id", getOneMedicalStaff);
    router.put("medical-staff", putOneMedicalStaff);
    router.delete("/medical-staff/:id", deleteOneMedicalStaff);
    // Doctor
    router.get("/doctor/:id/schedule/all", getSchedule);
    router.post("/doctor/schedule", postSchedule);

    return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes; // export default
