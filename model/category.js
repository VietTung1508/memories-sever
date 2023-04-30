const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: { type: String, required: [true, "Category is required"] },
  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
});

module.exports = mongoose.model("Category", categorySchema);
