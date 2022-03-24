const express = require("express");
const router = express.Router();
const { getAllCategories, getCategory, getMeal } = require("../controllers/Categories");


router.route('/').get(getAllCategories)
router.route("/:category").get(getCategory);
router.route("/:category/:mealID/:meal").get(getMeal);



module.exports = router