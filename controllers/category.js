const Category = require("../model/category.js");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  getCategories,
};
