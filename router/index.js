const authRoute = require("./auth.js");
const postRoute = require("./post.js");
const commentRoute = require("./comment.js");
const userRoute = require("./user.js");
const categoryRoute = require("./category.js");

const router = (app) => {
  app.use("/auth", authRoute);
  app.use("/posts", postRoute);
  app.use("/comments", commentRoute);
  app.use("/users", userRoute);
  app.use("/categories", categoryRoute);
};

module.exports = router;
