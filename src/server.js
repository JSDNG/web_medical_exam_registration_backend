require("dotenv").config();
const express = require("express"); //commonjs
const configViewEngine = require("./config/viewEngine");
//const configCors = require("./config/cors");
//const db = require("./models");
const cookieParser = require("cookie-parser");
const initWebRoutes = require("./routes/web");
const initAPIRoutes = require("./routes/api");

const app = express(); // app express
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;

//config req.body
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// config template engine
configViewEngine(app);

// config cors
//configCors(app);

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
