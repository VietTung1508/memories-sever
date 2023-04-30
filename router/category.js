const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/category.js");

route.get("/", categoryController.getCategories);

module.exports = route;
