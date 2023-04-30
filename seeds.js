const { Comment, childComment } = require("./model/comment.js");
const Category = require("./model/category.js");
const Post = require("./model/post.js");
const User = require("./model/user.js");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/social_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("db connected");
});

const categories = [
  {
    img: "https://i.pinimg.com/474x/23/dd/93/23dd932e24c1709f5f69710a19ad819c.jpg",
    cate: "Cars",
  },
];

const deleteComment = async () => {
  await Comment.deleteMany({});
  await childComment.deleteMany({});
  await Category.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});
};

deleteComment().then(() => {
  mongoose.connection.close();
});
