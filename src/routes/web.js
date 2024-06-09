const express = require("express");
const { getHomePage } = require("../controllers/homeController");
const router = express.Router();

// router.method("/route", handler);
const initWebRoutes = (app) => {
    router.get("/", getHomePage);
    router.get("/abc", getHomePage);
    return app.use("/", router);
};

module.exports = initWebRoutes; // export default
