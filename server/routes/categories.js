const express = require("express");
const router = express.Router();
const { getCategory, getMeal } = require("../controllers/Categories");


router.route("/:category").get(getCategory);
router.route("/:category/:mealID").get(getMeal);



module.exports = router