//importing api's
const express = require("express");
const Users = require("./routes/usersRoute");
const Auth = require("./routes/authRoute");
const Application = require("./routes/applicationRoute");
const Grants = require("./routes/grantsRoute");


module.exports = function (app) {
  //look for dependency
  //Middlware
  app.use(express.json());

  app.use("/api/users", Users);
  app.use("/api/auth", Auth);
  app.use("/api/applications", Application);
  app.use("/api/grants", Grants);
  // app.use(error)
};
