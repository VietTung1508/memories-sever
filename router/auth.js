const express = require("express");
const route = express.Router();
const auth = require("../controllers/auth.js");
const validate = require("../middleware/validation.js");
const localVariables = require("../middleware/localVariables.js");
const verifyToken = require("../middleware/verifyToken.js");

route.get("/generateOTP", localVariables, auth.generateOTP);

route.get("/verifyOTP", auth.verifyOTP);

route.post("/sendGmail", auth.sendGmail);

route.post("/register", validate.validationUser, auth.register);

route.post("/login", auth.login);

route.get("/createResetSession", auth.createResetSession);

route.put("/resetPassword", auth.resetPassword);

module.exports = route;
