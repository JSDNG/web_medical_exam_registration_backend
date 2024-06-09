const express = require("express");

const router = express.Router();

const initAPIRoutes = (app) => {
    // User
    //router.get("/user/:id", getUser);
    //router.get("/user", getUsers);
    //router.put("/profile", updateUser);

    return app.use("/api/v1/", router);
};

module.exports = initAPIRoutes; // export default
