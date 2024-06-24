require("dotenv").config();
const configCors = (app) => {
    // Add headers before the router are defined
    app.use((req, res, next) => {
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

        // Request methods you wish to allow
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

        // Request headers you wish to allow
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-with, content-type, Authorization");

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", true);

        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        next();
    });
};

module.exports = configCors;
