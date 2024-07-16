require("dotenv").config();
const express = require("express"); //commonjs
const configViewEngine = require("./config/viewEngine");
const configCors = require("./config/cors");
//const db = require("./models");
const cookieParser = require("cookie-parser");
const initWebRoutes = require("./routes/web");
const initAPIRoutes = require("./routes/api");
const connection = require("./config/connectDB");
const app = express(); // app express
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;

//config req.body
app.use(express.json()); // Used to parse JSON bodies // {limit: "50mb"}
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies // {limit: "50mb"}

// Middleware to handle JSON parse errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(200).json({
            EC: 1,
            EM: "Invalid JSON",
            DT: "",
        });
    }
    next();
});

// config template engine
configViewEngine(app);

connection();
// config cors
configCors(app);

// config cookie-parser
app.use(cookieParser());
// db.sequelize
//     .sync()
//     .then(() => {
//         console.log("Synced database.");
//     })
//     .catch((err) => {
//         console.log("Failed to sync database: " + err.message);
//     });

// khai bao route
initWebRoutes(app);
initAPIRoutes(app);

app.use((req, res) => {
    return res.send("404 not found");
});
// run server
app.listen(port, hostname, () => {
    console.log(`BackEnd app listening on port ${port}`);
});
