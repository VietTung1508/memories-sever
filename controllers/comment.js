const { Comment, childComment } = require("../model/comment.js");
const Post = require("../model/post.js");
const User = require("../model/user.js");
const mongoose = require("mongoose");

const create = async (req, res) => {
  const { postId } = req.params;
  const comment = req.body;
  try {
    const post = await Post.findById(postId);
    const newComment = new Comment(comment);
    post.comments.push(newComment);
    await newComment.save();
    await post.save();
    res.status(200).json(newComment);
  } catch (e) {
    res.status(500).json(e);
  }
};

const createChild = async (req, res) => {
  const { commentId } = req.params;
  const nestedComment = req.body;
  try {
    const parentComment = await Comment.findById(commentId);
    const newChildComment = new childComment(nestedComment);
    parentComment.childComments.push(newChildComment);
    await parentComment.save();
    await newChildComment.save();
    res.status(200).json("Success");
  } catch {}
};

const likeComment = async (req, res) => {
  const { isChild } = req.query;
  const { commentId } = req.params;
  const { userId } = req.body;
  const ObjectId = new mongoose.Types.ObjectId(commentId);
  const UserId = new mongoose.Types.ObjectId(userId);
  try {
    const user = await User.findById(userId);
    if (isChild === "true") {
      const child = await childComment.findById(commentId);
      const isLiked = child.userLike.includes(user._id);
      if (isLiked) {
        await Comment.findByIdAndUpdate(
          child.parentId,
          {
            $inc: {
              "childComments.$[field].like": -1,
            },
            $pull: {
              "childComments.$[field].userLike": UserId,
            },
          },
          {
            arrayFilters: [
              {
                "field._id": ObjectId,
              },
            ],
          }
        );
        const removeIndex = child.userLike.indexOf(user._id);
        child.like -= 1;
        child.userLike.splice(removeIndex, 1);
      } else {
        await Comment.findByIdAndUpdate(
          child.parentId,
          {
            $inc: {
              "childComments.$[field].like": 1,
            },
            $push: {
              "childComments.$[field].userLike": user,
            },
          },
          {
            arrayFilters: [
              {
                "field._id": ObjectId,
              },
            ],
          }
        );
        child.like += 1;
        child.userLike.push(user);
      }
      await child.save();
      res.status(200).json("Good");
    } else {
      const comment = await Comment.findById(commentId);
      const isLiked = comment.userLike.includes(user._id);
      if (isLiked) {
        const removeIndex = comment.userLike.indexOf(user._id);
        comment.like -= 1;
        comment.userLike.splice(removeIndex, 1);
      } else {
        comment.like += 1;
        comment.userLike.push(user);
      }
      comment.save();
      res.status(200).json("Good");
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

const edit = async (req, res) => {
  const { commentId } = req.params;
  const comment = req.body;
  const { isChild } = req.query;
  const ObjectId = new mongoose.Types.ObjectId(commentId);
  try {
    if (isChild === "true") {
      const child = await childComment.findById(commentId);

      await Comment.findByIdAndUpdate(
        child.parentId,
        {
          $set: {
            "childComments.$[field].content": comment.content,
          },
        },
        {
          arrayFilters: [
            {
              "field._id": ObjectId,
            },
          ],
        }
      );
      await childComment.findByIdAndUpdate(commentId, {
        $set: { content: comment.content },
      });
    } else {
      await Comment.findByIdAndUpdate(commentId, {
        $set: {
          content: comment.content,
        },
      });
    }
    res.status(200).json("Success Fully Edit Comment");
  } catch (e) {
    res.status(500).json(e);
  }
};

const destroy = async (req, res) => {
  const { commentId } = req.params;
  const { isChild } = req.query;
  try {
    if (isChild === "true") {
      const child = await childComment.findById(commentId);
      await Comment.findByIdAndUpdate(child.parentId, {
        $pull: { childComments: { _id: commentId } },
      });
      await childComment.findByIdAndDelete(commentId);
    } else {
      await Comment.findByIdAndDelete(commentId);
      await childComment.deleteMany({ parentId: commentId });
    }

    res.status(200).json("Delete Successfully");
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  create,
  createChild,
  likeComment,
  edit,
  destroy,
};
