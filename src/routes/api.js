const express = require("express");
const { getSchedule, postSchedule, getTime } = require("../controllers/doctorController");
const { register, login, logout, getAllDoctor } = require("../controllers/adminController");
const router = express.Router();

const initAPIRoutes = (app) => {
    //router.all("*", checkUserJWT, checkUserPermission);
    //Account;
    router.post("/register", register);
    router.post("/login", login);
    router.post("/logout", logout);
    // Admin
    router.get("/admin/doctor/all", getAllDoctor)
    
    // Doctor
    router.get("/doctor/:id/schedule/all", getSchedule);
    router.post("/doctor/schedule", postSchedule);

    router.get("/time/all", getTime);

    return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes; // export default
