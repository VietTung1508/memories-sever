const Post = require("../model/post.js");
const Category = require("../model/category.js");
const User = require("../model/user.js");
const { cloudinary } = require("../cloudinary");

const getPosts = async (req, res) => {
  const { category, userId, pageNumber } = req.query;
  try {
    let posts;
    if (category) {
      posts = await Post.find({ category: category })
        .populate("author")
        .limit(10)
        .skip(10 * pageNumber);
    } else if (userId) {
      posts = await Post.find({ author: userId })
        .populate("author")
        .limit(10)
        .skip(10 * pageNumber);
    } else {
      posts = await Post.find({})
        .populate("author")
        .limit(10)
        .skip(10 * pageNumber);
    }
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json(e);
  }
};

const getFollowingPin = async (req, res) => {
  const { author } = req.body;
  const { pageNumber } = req.query;
  try {
    const posts = await Post.find({ author: { $in: [...author] } })
      .populate("author")
      .limit(10)
      .skip(10 * pageNumber);
    res.status(200).json(posts);
  } catch (e) {
    console.log(e);
  }
};

const searchPost = async (req, res) => {
  const { q, limit, pageNumber } = req.query;
  try {
    if (limit === "true") {
      const searchPost = await Post.find({ title: new RegExp(q, "i") })
        .populate("author")
        .limit(4);
      const users = await User.find({ username: new RegExp(q, "i") }).limit(4);
      res.status(200).json([...searchPost, ...users]);
    } else {
      const searchPost = await Post.find({
        $or: [{ title: new RegExp(q, "i") }, { category: new RegExp(q, "i") }],
      })
        .populate("author")
        .limit(10)
        .skip(10 * pageNumber);
      res.status(200).json(searchPost);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

const detail = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id)
      .populate("author")
      .populate({
        path: "comments",
        populate: { path: "author" },
      })
      .populate({
        path: "comments",
        populate: { path: "childComments", populate: { path: "author" } },
      });

    res.status(200).json(post);
  } catch (e) {
    res.status(500).json(e);
  }
};

const createPost = async (req, res) => {
  const { id: userId } = req.user;
  const post = req.body;
  try {
    if (!req.file) {
      res.status(500).json({ msg: "Cannot create post without Image" });
    }
    const category = await Category.findOne({ category: post.category });
    const img = {
      url: req.file.path,
      filename: req.file.filename,
    };
    if (!category) {
      const newCate = new Category({
        category: post.category,
        image: img,
      });
      await newCate.save();
    }
    const newPost = new Post({
      ...post,
      author: userId,
      image: img,
    });
    await newPost.save();
    res.status(200).json("Create Post Successfully");
  } catch (e) {}
};

const update = async (req, res) => {
  const { id } = req.params;
  const newPost = req.body;
  try {
    await Post.findByIdAndUpdate(id, newPost);
    res.status(200).json({ msg: "Update Successfully" });
  } catch (e) {
    res.status(500).json(e);
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    const isLastCategory = await Post.find({ category: post.category });
    if (isLastCategory.length === 1) {
      await Category.findOneAndDelete({ category: post.category });
    }
    await cloudinary.uploader.destroy(post.image.filename);
    await Post.findByIdAndDelete(id);
    res.status(200).json({ msg: "delete Successfully" });
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  getPosts,
  detail,
  searchPost,
  createPost,
  update,
  destroy,
  getFollowingPin,
};
