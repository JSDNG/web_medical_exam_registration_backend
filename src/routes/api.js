const express = require("express");
const { getSchedule, postSchedule} = require("../controllers/doctorController");
const { register, login, logout } = require("../controllers/adminController");
const router = express.Router();

const initAPIRoutes = (app) => {
    //router.all("*", checkUserJWT, checkUserPermission);
    //Account;
    router.post("/register", register);
    router.post("/login", login);
    router.post("/logout", logout);

    // Doctor
    router.get("/doctor/:id/schedule/all", getSchedule);
    router.post("/doctor/schedule", postSchedule);

    return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes; // export default
