const User = require("../model/user.js");
const Post = require("../model/post.js");
const { cloudinary } = require("../cloudinary");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
      .populate("savedPin")
      .populate({ path: "savedPin", populate: { path: "author" } })
      .populate("following");

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
};

const savePin = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(id);
    const user = await User.findById(userId);
    const isSaved = user.savedPin.includes(post._id);
    if (isSaved) {
      const removeIndex = user.savedPin.indexOf(post._id);
      user.savedPin.splice(removeIndex, 1);
    } else {
      user.savedPin.push(post);
    }
    await user.save();
    res.status(200).json("save Success");
  } catch (e) {
    res.status(500).json(e);
  }
};

const followUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const followUser = await User.findById(id);
    const user = await User.findById(userId);
    const isFollowed = user.following.includes(followUser._id);
    if (isFollowed) {
      const removeIndex = user.following.indexOf(followUser._id);
      user.following.splice(removeIndex, 1);
      followUser.followers -= 1;
    } else {
      user.following.push(followUser);
      followUser.followers += 1;
    }
    await user.save();
    await followUser.save();
    res.status(200).json("follow success");
  } catch (e) {
    res.status(500).json(e);
  }
};

const edit = async (req, res) => {
  const { id } = req.user;
  const userUpdate = req.body;
  try {
    const user = await User.findById(id);
    if (Boolean(req.file)) {
      const avatar = {
        url: req.file.path,
        filename: req.file.filename,
      };
      cloudinary.uploader.destroy(user.avatar.filename);
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          avatar,
          ...userUpdate,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...userUpdate,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  getUser,
  savePin,
  followUser,
  edit,
};
