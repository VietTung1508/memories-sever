const express = require("express");
const route = express.Router();
const commentController = require("../controllers/comment.js");
const verifyToken = require("../middleware/verifyToken.js");

route.post("/:postId", verifyToken, commentController.create);
route.post("/:commentId/child", verifyToken, commentController.createChild);
route.post(
  "/:commentId/likeComment",
  verifyToken,
  commentController.likeComment
);
route.put("/:commentId", verifyToken, commentController.edit);
route.delete("/:commentId", verifyToken, commentController.destroy);

module.exports = route;
