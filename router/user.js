const express = require("express");
const route = express.Router();
const userController = require("../controllers/user.js");
const multer = require("multer");
const { storage } = require("../cloudinary/index.js");
const upload = multer({ storage });
const verifyToken = require("../middleware/verifyToken.js");

route.get("/:id", userController.getUser);
route.post("/:id", userController.savePin);
route.post("/follow/:id", userController.followUser);
route.put("/", verifyToken, upload.single("avatar"), userController.edit);

module.exports = route;
