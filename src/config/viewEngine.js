const path = require("path");
const express = require("express"); //commonjs
const configViewEngine = (app) => {
  //console.log(">>> check:", path.join("./src", "views"))
  app.set("views", path.join("./src", "views"));
  app.set("view engine", "ejs");

  // config static files
  app.use(express.static(path.join("./src", "public")));
};

module.exports = configViewEngine;
