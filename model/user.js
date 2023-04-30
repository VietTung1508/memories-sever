const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true, unique: true },
  introduction: { type: String },
  avatar: {
    url: { type: String },
    filename: { type: String },
  },
  savedPin: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
