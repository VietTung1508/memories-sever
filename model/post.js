const mongoose = require("mongoose");
const { Comment, childComment } = require("./comment");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    image: {
      url: { type: String },
      filename: { type: String },
    },
    category: { type: String, required: [true, "Category is required"] },
  },
  { timestamps: true }
);

postSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Comment.deleteMany({ _id: { $in: doc.comments } });
    await childComment.deleteMany({ parentId: { $in: doc.comments } });
  }
});

module.exports = mongoose.model("Post", postSchema);
