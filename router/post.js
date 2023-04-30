const express = require("express");
const postControllers = require("../controllers/post.js");
const route = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary/index.js");
const upload = multer({ storage });
const verifyToken = require("../middleware/verifyToken.js");

route.get("/", postControllers.getPosts);
route.get("/search", postControllers.searchPost);
route.get("/:id", postControllers.detail);
route.post("/following", postControllers.getFollowingPin);
route.post(
  "/create",
  verifyToken,
  upload.single("image"),
  postControllers.createPost
);
route.put("/:id", verifyToken, postControllers.update);
route.delete("/:id", verifyToken, postControllers.destroy);

module.exports = route;
