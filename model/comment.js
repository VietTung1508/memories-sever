const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const childCommentSchema = new Schema(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    like: { type: Number, default: 0 },
    userLike: [{ type: Schema.Types.ObjectId, ref: "User" }],
    content: { type: String, required: [true, "Content is required"] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChildComment", childCommentSchema);

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    content: { type: String, required: [true, "Content is required"] },
    like: { type: Number, default: 0 },
    userLike: [{ type: Schema.Types.ObjectId, ref: "User" }],
    childComments: [childCommentSchema],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
const childComment = mongoose.model("ChildComment", childCommentSchema);

module.exports = {
  Comment,
  childComment,
};
